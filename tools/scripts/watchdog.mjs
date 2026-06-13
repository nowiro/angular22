/*
 * Watchdog — monitors the upstreams that matter for this repo and reports what
 * changed since the last run, so stack drift and new Copilot/spec-kit/Angular
 * practices get surfaced (and can be proposed via SDD `deps`/`chore`).
 *
 * Local dev tool (needs network) — there are no GitHub Actions here. Run:
 *   pnpm watchdog          # fetch, report, and update the snapshot
 *   pnpm watchdog --check  # report only (CI-style; non-zero exit if anything is new)
 *
 * Sources are declared in WATCHERS below; add URLs worth tracking there. Each
 * watcher resolves a single "marker" string (a version or a latest-entry id);
 * the marker is compared to tools/watchdog/state.json from the previous run.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STATE_FILE = resolve(ROOT, 'tools/watchdog/state.json');
const CHECK_ONLY = process.argv.includes('--check');
const TIMEOUT_MS = 12_000;

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const pinned = { ...pkg.dependencies, ...pkg.devDependencies };

/** npm dist-tag `latest` for a package; flags drift vs the version pinned in package.json. */
const npm = (name) => ({
  id: `npm:${name}`,
  label: name,
  pinned: (pinned[name] ?? '—').replace(/^[\^~]/, ''),
  async fetchMarker() {
    const r = await fetchJson(`https://registry.npmjs.org/${name}/latest`);
    return r?.version ?? null;
  },
});

/** Latest GitHub release tag for owner/repo. */
const ghRelease = (repo, label) => ({
  id: `gh:${repo}`,
  label: label ?? repo,
  async fetchMarker() {
    const r = await fetchJson(`https://api.github.com/repos/${repo}/releases/latest`);
    return r?.tag_name ?? null;
  },
});

/** First changelog/heading marker scraped from a page (best-effort). */
const page = (id, label, url, regex) => ({
  id,
  label,
  async fetchMarker() {
    const text = await fetchText(url);
    return text ? (text.match(regex)?.[1]?.trim() ?? null) : null;
  },
});

const WATCHERS = [
  // Stack packages — latest vs pinned.
  npm('@angular/core'),
  npm('@angular/material'),
  npm('nx'),
  npm('typescript'),
  npm('@playwright/test'),
  npm('vitest'),
  npm('eslint'),
  npm('keycloak-angular'),
  npm('keycloak-js'),
  // External practice trackers — methodology + Copilot capabilities.
  ghRelease('github/spec-kit', 'spec-kit (SDD methodology)'),
  ghRelease('angular/angular', 'Angular releases'),
  ghRelease('nrwl/nx', 'Nx releases'),
  page(
    'copilot-changelog',
    'GitHub Copilot changelog',
    'https://github.blog/changelog/label/copilot/',
    /datetime="([^"]+)"/,
  ),
];

async function fetchJson(url) {
  const text = await fetchText(url, { Accept: 'application/json' });
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

async function fetchText(url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'angular22-watchdog', ...headers },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveState(state) {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
}

const state = loadState();
const rows = await Promise.all(
  WATCHERS.map(async (w) => {
    const marker = await w.fetchMarker();
    const previous = state[w.id]?.marker ?? null;
    const isNew = marker !== null && previous !== null && marker !== previous;
    const unreachable = marker === null;
    const upgrade = w.pinned && marker && w.pinned !== marker ? ` (pinned ${w.pinned})` : '';
    return { ...w, marker, previous, isNew, unreachable, upgrade };
  }),
);

let newCount = 0;
let unreachableCount = 0;
console.log('\n  angular22 watchdog — upstream changes\n');
for (const r of rows) {
  if (r.unreachable) {
    unreachableCount++;
    console.log(`  ?  ${r.label.padEnd(34)} unreachable (offline / rate-limited)`);
    continue;
  }
  const flag = r.isNew ? 'NEW' : r.previous === null ? '·' : 'ok';
  if (r.isNew) newCount++;
  const since = r.isNew ? `  (was ${r.previous})` : '';
  console.log(`  ${flag.padEnd(3)} ${r.label.padEnd(34)} ${r.marker}${r.upgrade}${since}`);
}

console.log(
  `\n  ${newCount} new · ${rows.length - newCount - unreachableCount} unchanged · ${unreachableCount} unreachable`,
);

if (!CHECK_ONLY) {
  for (const r of rows) {
    if (!r.unreachable) state[r.id] = { marker: r.marker, label: r.label };
  }
  saveState(state);
  console.log(`  snapshot updated → ${STATE_FILE.replace(ROOT, '.')}\n`);
} else {
  console.log('  --check: snapshot not updated\n');
  if (newCount > 0) process.exitCode = 1;
}
