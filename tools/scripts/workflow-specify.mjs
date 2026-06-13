#!/usr/bin/env node
/**
 * workflow-specify.mjs — generic SDD "specify" scaffolder (verb-agnostic).
 *
 * Reads the canonical templates in docs/sdd/templates/ and emits:
 *   - docs/specs/<slug>/spec.md                       (status: draft, [?] for /clarify)
 *   - docs/plans/<YYYY-MM-DD_HH-MM>_<verb>-<slug>.md  (folded plan + task table)
 *   - docs/runs/<YYYY-MM-DD_HH-MM>_<slug>.md          (step-by-step iteration log)
 *
 * Each task is stamped YYYY-MM-DD_HH-MM_<name> (project convention). All three dirs are
 * tracked in git — every change is recorded in docs/. Templates are the single source of the
 * artifact shape — see docs/sdd/methodology.md.
 *
 * Usage:
 *   pnpm workflow:specify -- --verb=feature --slug=orders-list --title="Orders list screen"
 *   pnpm workflow:specify -- --verb=init --slug=shop-web --title="New Angular shop app"
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const NOW = new Date();
const pad = (n) => String(n).padStart(2, '0');
const TODAY = `${NOW.getFullYear()}-${pad(NOW.getMonth() + 1)}-${pad(NOW.getDate())}`;
// Task stamp: YYYY-MM-DD_HH-MM (local time) — the project naming convention for plans/runs.
const STAMP = `${TODAY}_${pad(NOW.getHours())}-${pad(NOW.getMinutes())}`;
const ARGS = parseArgs(process.argv.slice(2));
const USAGE = 'Usage: pnpm workflow:specify -- --verb=<kebab> --slug=<kebab> [--title="..."]';

for (const key of ['verb', 'slug']) {
  if (!ARGS[key]) fail(`Missing required arg: --${key}\n${USAGE}`);
}
const verb = String(ARGS.verb);
const slug = String(ARGS.slug);
const title = ARGS.title ? String(ARGS.title) : slug;

for (const [k, v] of [
  ['verb', verb],
  ['slug', slug],
]) {
  if (!/^[a-z][a-z0-9-]*$/.test(v)) fail(`--${k} must be kebab-case (got "${v}")`);
}

const specTpl = readTemplate('docs/sdd/templates/spec.md');
const planTpl = readTemplate('docs/sdd/templates/plan.md');
const runTpl = readTemplate('docs/sdd/templates/run.md');

const fill = (s) =>
  s
    .replaceAll('{{slug}}', slug)
    .replaceAll('{{verb}}', verb)
    .replaceAll('{{title}}', title)
    .replaceAll('{{date}}', TODAY)
    .replaceAll('{{stamp}}', STAMP);

writeNew(`docs/specs/${slug}/spec.md`, fill(specTpl));
writeNew(`docs/plans/${STAMP}_${verb}-${slug}.md`, fill(planTpl));
writeNew(`docs/runs/${STAMP}_${slug}.md`, fill(runTpl));

process.stdout.write(
  `\nTask: ${STAMP}_${slug}\n` +
    `Next: /clarify ${slug}  →  /analyze  →  implement (delegate)  →  orchestrator verify (Opus)  →  pnpm verify\n` +
    `Log every step (agent + model + outcome) into docs/runs/${STAMP}_${slug}.md\n`,
);
process.exit(0);

// ── helpers ──────────────────────────────────────────────────────────────────

function readTemplate(rel) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) fail(`canonical template missing: ${rel}`);
  return readFileSync(abs, 'utf8');
}

function writeNew(rel, content) {
  const abs = resolve(ROOT, rel);
  if (existsSync(abs)) {
    process.stdout.write(`  ⚠ exists: ${rel} (skip)\n`);
    return;
  }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, 'utf8');
  process.stdout.write(`  ✓ wrote ${rel}\n`);
}

function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    const kv = /^--([\w-]+)(?:=(.*))?$/.exec(a);
    if (kv) out[kv[1]] = kv[2] ?? true;
  }
  return out;
}

function fail(msg) {
  process.stderr.write(msg + '\n');
  process.exit(1);
}
