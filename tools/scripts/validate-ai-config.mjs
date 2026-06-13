#!/usr/bin/env node
/**
 * Validates the GitHub Copilot configuration surface for angular22.
 * Repo-local gate for the GitHub Copilot config (agents/skills/prompts/instructions + mcp.json).
 *
 *   - .vscode/mcp.json conforms to the expected shape (servers with command + args)
 *   - .github/copilot-instructions.md exists
 *   - every .github/instructions/*.instructions.md has frontmatter `applyTo` + `description`
 *   - every .github/prompts/*.prompt.md has frontmatter `agent` + `description`
 *   - every .github/agents/*.agent.md has frontmatter `description` + `model`
 *   - every .github/skills/<dir>/SKILL.md has frontmatter `name` + `description`
 *   - **exactly one user-invocable agent** (the orchestrator) — the rest are
 *     subagents with `user-invocable: false`, so the VS Code picker shows only one.
 *   - **model policy** (token economy): every agent pins a `model:`, and the visible
 *     orchestrator must lead with an Opus-class model.
 *
 * Exits 0 on success, 1 on any failure. Used by `pnpm ai:validate`.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

const errors = [];
const must = (cond, msg) => {
  if (!cond) errors.push(msg);
};

async function listMd(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => resolve(dir, e.name));
}

async function listSkillFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && existsSync(resolve(dir, e.name, 'SKILL.md')))
    .map((e) => resolve(dir, e.name, 'SKILL.md'));
}

async function frontmatter(file) {
  const txt = await readFile(file, 'utf8');
  const fm = txt.match(/^---\n([\s\S]+?)\n---/);
  return fm ? fm[1] : null;
}

async function checkKeyedFrontmatter(file, requiredKeys) {
  const fm = await frontmatter(file);
  must(fm, `${file}: missing YAML frontmatter`);
  if (!fm) return;
  for (const key of requiredKeys) {
    must(new RegExp(`^${key}:\\s*\\S+`, 'm').test(fm), `${file}: frontmatter missing "${key}"`);
  }
}

async function main() {
  // ── 1. MCP registry sanity (VS Code native: .vscode/mcp.json) ──
  const mcpPath = '.vscode/mcp.json';
  must(existsSync(mcpPath), `${mcpPath} is missing`);
  if (existsSync(mcpPath)) {
    const mcp = JSON.parse(await readFile(mcpPath, 'utf8'));
    const servers = mcp.servers ?? mcp.mcpServers;
    must(servers && typeof servers === 'object', `${mcpPath}: missing "servers" map`);
    for (const [name, srv] of Object.entries(servers ?? {})) {
      must(srv.command, `${mcpPath}: server "${name}" missing "command"`);
      must(Array.isArray(srv.args), `${mcpPath}: server "${name}" missing "args" array`);
    }
  }

  // ── 2. Copilot entrypoint exists ──
  must(existsSync('.github/copilot-instructions.md'), '.github/copilot-instructions.md is missing');

  // ── 3. instructions frontmatter ──
  const instructions = await listMd('.github/instructions');
  for (const f of instructions) {
    if (!f.endsWith('.instructions.md')) continue;
    await checkKeyedFrontmatter(f, ['applyTo', 'description']);
  }

  // ── 4. prompts frontmatter (`agent` replaces deprecated `mode`) ──
  const prompts = await listMd('.github/prompts');
  for (const f of prompts) {
    if (!f.endsWith('.prompt.md')) continue;
    await checkKeyedFrontmatter(f, ['agent', 'description']);
  }

  // ── 5. agents frontmatter (description + pinned model) ──
  const agents = await listMd('.github/agents');
  for (const f of agents) {
    if (!f.endsWith('.agent.md')) continue;
    await checkKeyedFrontmatter(f, ['description', 'model']);
  }

  // ── 6. skills frontmatter ──
  const skills = await listSkillFiles('.github/skills');
  for (const f of skills) {
    await checkKeyedFrontmatter(f, ['name', 'description']);
  }

  // ── 7. exactly one user-invocable agent (the orchestrator) + model policy ──
  const leadModel = (fm) => {
    const line = fm.match(/^model:[ \t]*(.+?)[ \t]*$/m)?.[1] ?? '';
    return (
      line
        .replace(/^\[\s*/, '')
        .replace(/^['"]/, '')
        .match(/^[^'"\],]+/)?.[0]
        ?.trim() ?? ''
    );
  };
  const visibleAgents = [];
  for (const f of agents) {
    if (!f.endsWith('.agent.md')) continue;
    const name = f.split(/[/\\]/).pop();
    const fm = await frontmatter(f);
    if (!fm) continue;
    const visible = !/^user-invocable:\s*false\b/m.test(fm);
    if (visible) {
      visibleAgents.push(name);
      const lead = leadModel(fm);
      must(
        /opus/i.test(lead),
        `${name}: visible orchestrator must lead with an Opus-class model (got "${lead || 'none'}")`,
      );
    }
  }
  must(
    visibleAgents.length === 1,
    `expected exactly 1 user-invocable agent (orchestrator); found ${visibleAgents.length}: ${visibleAgents.join(', ')}`,
  );

  if (errors.length === 0) {
    console.log(
      `✓ angular22 Copilot configuration is valid — ` +
        `${instructions.length} instructions · ${prompts.length} prompts · ${agents.length} agents · ` +
        `${skills.length} skills · 1 visible (${visibleAgents[0]})`,
    );
    process.exit(0);
  }
  console.error('✗ Copilot configuration has errors:\n');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
