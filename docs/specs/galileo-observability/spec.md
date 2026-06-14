---
type: spec
id: 'spec.galileo-observability'
status: clarified
title: 'Galileo — observability/eval agentów (trace per krok, scoring wyboru narzędzi, koszt+latencja)'
created: '2026-06-13'
---

# Spec: Galileo — observability/eval agentów (trace per krok, scoring wyboru narzędzi, koszt+latencja)

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `docs/sdd/templates/spec.md`. Otwarte pytania domknięte w `/clarify` (sekcja „Decyzje").

## Kontekst

Orkiestracja multi-agent (orchestrator Opus 4.8 → ~30 ukrytych subagentów → 4 serwery MCP w
`.vscode/mcp.json`) **nie ma zautomatyzowanej obserwowalności**. Jedyna warstwa rozliczeniowa to
**ręczna** sekcja „Rozliczenie / Telemetria" w każdym run-logu (`docs/runs/...`, orchestrator
krok verify) — wpisywana z palca, bez trace per krok, bez scoringu jakości wyboru narzędzia,
bez kosztu/latencji per delegacja.

Co to odblokowuje **teraz**: od **VS Code 1.121** (baseline repo) Copilot agent mode (łącznie z
agentem Claude) emituje **trace OpenTelemetry** wg GenAI semantic conventions — root
`invoke_agent` z zagnieżdżonymi spanami `chat` / `execute_tool` / `execute_hook` (czyli nasze
delegacje do subagentów i wywołania MCP stają się spanami, z tokenami i latencją). Włączane przez
`github.copilot.chat.otel.enabled` + `github.copilot.chat.otel.otlpEndpoint`. **Galileo** przyjmuje
OTel/OpenInference bezpośrednio i dokłada warstwę **eval** (scoring jakości / wyboru narzędzia)
na modelach Luna-2. To dokładnie warstwa trace+scoring+koszt, której brakuje — wpinana **bez
kodu aplikacji** (zmiana dotyczy tooling/config + docs, nie kodu Angulara).

## User story

Jako **operator orchestratora** chcę **automatyczny trace per krok** (delegacja → subagent →
MCP) z **kosztem, latencją i scoringiem wyboru narzędzia**, aby sekcja „Telemetria" w run-logu
była zasilana **realnymi danymi**, a regresje jakości/kosztu były widoczne zamiast wpisywane ręcznie.

## Acceptance criteria

> Given / When / Then. Bądź konkretny — to jedyna **egzekwowana** sekcja (`sdd:check`).

- **AC1 (trace per krok):** Given VS Code ≥ 1.121 z `github.copilot.chat.otel.enabled: true`
  wskazującym kolektor, When przebiega drabina SDD (specify→…→verify), Then każdy request tworzy
  root span `invoke_agent` z zagnieżdżonymi `chat` / `execute_tool` widocznymi w backendzie.
- **AC2 (koszt + latencja):** Given trace z AC1, When otwieram span kroku, Then widzę tokeny
  (in/out) i latencję per delegacja/wywołanie MCP, agregowane per przebieg drabiny.
- **AC3 (scoring wyboru narzędzia):** Given przebieg w Galileo, When przeglądam run, Then każda
  delegacja ma score jakości / poprawności wyboru narzędzia (warstwa eval, nie surowy trace).
- **AC4 (kanon docs):** Given repo, Then istnieje strona `docs/observability.md` opisująca
  włączenie (ustawienia VS Code, endpoint OTLP, klucz przez **env**, nie w repo) + mapę spanów →
  kroki SDD; podlinkowana z `AGENTS.md` i `mcp-usage.instructions.md` (DRY: jeden kanon).
- **AC5 (zasilenie run-logu):** Given szablon run-logu, When zamykam zadanie, Then sekcja
  „Rozliczenie / Telemetria" wskazuje **źródło automatyczne** (dashboard/eksport Galileo) jako
  podstawę liczb, zamiast wyłącznie wpisu ręcznego.
- **AC6 (bramka + brak sekretów):** Given zmiana, Then `pnpm verify` (format + ai:validate +
  sdd:check + lint + typecheck + test + build) **zielone**, a w gicie **zero sekretów** (klucz
  Galileo / endpoint wrażliwy tylko przez env, nie commitowany).

## Success metrics

- **100%** kroków SDD w przebiegu próbnym produkuje span w backendzie (AC1).
- Zmiana **bez kodu aplikacji**: ≤ 1 plik konfiguracyjny + 1 strona docs + linki w istniejących
  kanonach (`AGENTS.md`, `mcp-usage`, szablon run-logu). **0** nowych zależności runtime apki.
- **0** sekretów w gicie (skan: `security` agent).
- Narzut latencji na inference: **0** (eval Galileo liczy się w platformie, nie w ścieżce wywołania).

## Non-goals

- **Brak** instrumentacji runtime samej apki Angular (nie ma w produkcie funkcji agentowej do
  obserwowania — to byłby osobny feature).
- **Brak** zmiany formatu sekcji „Telemetria" w szablonie (tylko wskazanie źródła danych).
- **Brak** Warp i **brak** `.github/workflows/` (repo Copilot-only, zero Actions — inwariant).
- **Brak** wyboru płatnego planu eval w tej rundzie, jeśli spike OTel-only wystarcza (→ open Q).

## Decyzje (clarify — domknięte)

> Domknięte w kroku `/clarify`. Instrumentacja = standardowy **OTel GenAI**, więc wszystkie
> poniższe są odwracalne (backend podmienny bez zmiany configu).

- **Backend:** **primary = Galileo cloud** (warstwa eval/scoring na Luna-2); **interim = spike
  OTel-only lokalnie** (kolektor → Arize Phoenix / Langfuse, free) na identycznym configu. Config
  commitowany w repo celuje w **lokalny kolektor** (`http://localhost:4318`); Galileo cloud
  wpinany **przez env** (poniżej) — bez zmian w repo.
- **Kolektor:** **lokalny dev per maszyna** (OTLP/HTTP `localhost:4318`). Współdzielony endpoint
  zespołowy = poza zakresem tej rundy.
- **Sekret / env (nie w repo):** endpoint → `OTEL_EXPORTER_OTLP_ENDPOINT`; klucz Galileo →
  `OTEL_EXPORTER_OTLP_HEADERS` (np. `Galileo-API-Key=...`). `captureContent` domyślnie **`false`**
  (treść promptów/odpowiedzi nie opuszcza maszyny, dopóki świadomie nie włączysz).
- **Zakres scoringu na start:** **tool-selection + koszt/latencja** (z trace). `quality` /
  `hallucination` eval **odłożone** (osobna runda — koszt eval).
