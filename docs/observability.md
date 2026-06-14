---
type: doc
id: 'doc.observability'
title: 'Observability — Galileo / OTel dla agentów'
---

# Observability — Galileo / OTel dla agentów

**Kanon obserwowalności** orkiestracji multi-agent (orchestrator → subagenci → MCP). Źródło
trace'ów: **Copilot agent mode** (VS Code ≥ 1.121) emituje **OpenTelemetry** wg GenAI semantic
conventions — root `invoke_agent` z zagnieżdżonymi `chat` / `execute_tool` / `execute_hook`. Backend
(trace + scoring + koszt/latencja): **Galileo** (eval na Luna-2) albo spike **OTel-only** (Arize
Phoenix / Langfuse). Zero kodu apki, zero GitHub Actions — repo jest **Copilot-only**. Decyzje →
[`docs/specs/galileo-observability/spec.md`](specs/galileo-observability/spec.md).

## Ustawienia (commitowane, domyślnie OFF)

`.vscode/settings.json` (opt-in — każdy włącza świadomie, bo trace może zawierać treść promptów):

| Setting                                   | Wartość w repo          | Po co                                                                      |
| ----------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `github.copilot.chat.otel.enabled`        | `false`                 | główny przełącznik; auto-`true` gdy ustawisz `OTEL_EXPORTER_OTLP_ENDPOINT` |
| `github.copilot.chat.otel.exporterType`   | `otlp-http`             | protokół eksportu (`otlp-http` \| `otlp-grpc`)                             |
| `github.copilot.chat.otel.otlpEndpoint`   | `http://localhost:4318` | lokalny kolektor OTLP/HTTP (spike)                                         |
| `github.copilot.chat.otel.captureContent` | `false`                 | treść promptów/odpowiedzi w spanach — **domyślnie nie wychodzi z maszyny** |

> Po zmianie ustawień: **Reload Window**.

## Włączenie — spike OTel-only (rekomendowany pierwszy krok)

Tani, free, backend-agnostyczny — potwierdza wartość trace'ów przed płatną warstwą eval.

```sh
# 1. Lokalny backend OTLP (przykład: Arize Phoenix — nasłuch OTLP/HTTP na 4318)
docker run -p 6006:6006 -p 4318:4318 arizephoenix/phoenix:latest

# 2. W .vscode/settings.json przełącz github.copilot.chat.otel.enabled → true (Reload Window)
# 3. Odpal dowolny krok drabiny SDD → spany pojawią się w UI backendu (http://localhost:6006)
```

## Włączenie — Galileo cloud (eval/scoring)

Endpoint i klucz **przez env** (nigdy w repo):

```sh
export OTEL_EXPORTER_OTLP_ENDPOINT="https://<twój-projekt>.galileo.ai/otel"   # ingest OTLP Galileo
export OTEL_EXPORTER_OTLP_HEADERS="Galileo-API-Key=<klucz>"                    # auth — z env, nie z settings.json
# enabled auto-włącza się, gdy OTEL_EXPORTER_OTLP_ENDPOINT jest ustawiony
```

Galileo dokłada nad surowym trace **scoring**: jakość/poprawność **wyboru narzędzia** + agregaty
kosztu/latencji per run. Zakres na start (decyzja clarify): **tool-selection + koszt/latencja**;
`quality`/`hallucination` eval odłożone (koszt).

## Mapa span → krok SDD

| Span (OTel GenAI) | Co to u nas                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| `invoke_agent`    | jeden request do orchestratora (root przebiegu drabiny)                                |
| `chat`            | delegacja do subagenta (`tool agent`)                                                  |
| `execute_tool`    | wywołanie serwera MCP (`context7` / `nx` / `angular-cli` / `playwright`) lub narzędzia |
| `execute_hook`    | hook (np. pre-commit `verify`)                                                         |

Atrybuty spanów (tokeny in/out, model, latencja) → zasilają sekcję **„Rozliczenie / Telemetria"**
run-logu ([`docs/sdd/templates/run.md`](sdd/templates/run.md)) automatem zamiast wpisu ręcznego.

## Bezpieczeństwo / granice

- **Zero sekretów w repo** — endpoint i klucz Galileo wyłącznie w env (`OTEL_EXPORTER_OTLP_*`).
- `captureContent: false` domyślnie — włącz tylko świadomie (treść promptów opuszcza maszynę).
- **Off-stack:** kolektor/backend (Phoenix/Galileo) to **zewnętrzne narzędzie dev** (jak sieć w
  [`watchdog`](watchdog.md)) — **nie** dodaje zależności do `package.json`, nie łamie kanonu
  [`tech-stack.md`](tech-stack.md).
- Standard **OTel** = backend podmienny bez zmiany configu (Galileo ↔ Phoenix ↔ Langfuse).
