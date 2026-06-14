---
type: doc
id: 'doc.observability'
title: 'Observability — Galileo / OTel for agents'
---

# Observability — Galileo / OTel for agents

**Observability canon** for multi-agent orchestration (orchestrator → subagents → MCP). Trace
source: **Copilot agent mode** (VS Code ≥ 1.121) emits **OpenTelemetry** per GenAI semantic
conventions — root `invoke_agent` with nested `chat` / `execute_tool` / `execute_hook`. Backend
(trace + scoring + cost/latency): **Galileo** (eval on Luna-2) or an **OTel-only** spike (Arize
Phoenix / Langfuse). Zero app code, zero GitHub Actions — the repo is **Copilot-only**. Decisions →
[`docs/specs/galileo-observability/spec.md`](specs/galileo-observability/spec.md).

## Settings (committed, OFF by default)

`.vscode/settings.json` (opt-in — each person enables it deliberately, since a trace may contain prompt content):

| Setting                                   | Repo value              | Why                                                                     |
| ----------------------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `github.copilot.chat.otel.enabled`        | `false`                 | main switch; auto-`true` when you set `OTEL_EXPORTER_OTLP_ENDPOINT`     |
| `github.copilot.chat.otel.exporterType`   | `otlp-http`             | export protocol (`otlp-http` \| `otlp-grpc`)                            |
| `github.copilot.chat.otel.otlpEndpoint`   | `http://localhost:4318` | local OTLP/HTTP collector (spike)                                       |
| `github.copilot.chat.otel.captureContent` | `false`                 | prompt/response content in spans — **stays on your machine by default** |

> After changing settings: **Reload Window**.

## Enabling — OTel-only spike (recommended first step)

Cheap, free, backend-agnostic — confirms the value of traces before the paid eval layer.

```sh
# 1. Local OTLP backend (example: Arize Phoenix — listens for OTLP/HTTP on 4318)
docker run -p 6006:6006 -p 4318:4318 arizephoenix/phoenix:latest

# 2. In .vscode/settings.json flip github.copilot.chat.otel.enabled → true (Reload Window)
# 3. Run any step of the SDD ladder → spans appear in the backend UI (http://localhost:6006)
```

## Enabling — Galileo cloud (eval/scoring)

Endpoint and key **via env** (never in the repo):

```sh
export OTEL_EXPORTER_OTLP_ENDPOINT="https://<your-project>.galileo.ai/otel"   # Galileo OTLP ingest
export OTEL_EXPORTER_OTLP_HEADERS="Galileo-API-Key=<key>"                      # auth — from env, not settings.json
# enabled turns on automatically when OTEL_EXPORTER_OTLP_ENDPOINT is set
```

On top of the raw trace, Galileo adds **scoring**: quality/correctness of **tool selection** +
cost/latency aggregates per run. Initial scope (clarify decision): **tool-selection + cost/latency**;
`quality`/`hallucination` eval deferred (cost).

## Span → SDD step map

| Span (OTel GenAI) | What it maps to here                                                               |
| ----------------- | ---------------------------------------------------------------------------------- |
| `invoke_agent`    | one request to the orchestrator (root of a ladder run)                             |
| `chat`            | delegation to a subagent (`tool agent`)                                            |
| `execute_tool`    | call to an MCP server (`context7` / `nx` / `angular-cli` / `playwright`) or a tool |
| `execute_hook`    | hook (e.g. pre-commit `verify`)                                                    |

Span attributes (tokens in/out, model, latency) → feed the **"Accounting / Telemetry"** section of the
run-log ([`docs/sdd/templates/run.md`](sdd/templates/run.md)) automatically instead of a manual entry.

## Security / boundaries

- **Zero secrets in the repo** — Galileo endpoint and key only in env (`OTEL_EXPORTER_OTLP_*`).
- `captureContent: false` by default — enable only deliberately (prompt content leaves the machine).
- **Off-stack:** the collector/backend (Phoenix/Galileo) is an **external dev tool** (like the network in
  [`watchdog`](watchdog.md)) — it does **not** add a dependency to `package.json` and does not break the
  [`tech-stack.md`](tech-stack.md) canon.
- The **OTel** standard = swappable backend without config changes (Galileo ↔ Phoenix ↔ Langfuse).
