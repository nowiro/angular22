---
agent: agent
description: Resolve open [?] placeholders in a docs/specs spec via structured Q&A, then re-validate. Clarify step of SDD (specify → clarify → plan → analyze → implement). Writes only the target spec.md, never fabricates — unanswered stay draft.
---

# /clarify — domknij spec przed planem

Zamienia `[?]` w `docs/specs/<slug>/spec.md` w konkrety przez **ustrukturyzowane Q&A**.
`validate-sdd` traktuje `[?]` w nie-draft specie jako błąd — ten prompt je domyka. Pisze
**tylko** do docelowego `spec.md`. Kanon: `docs/sdd/methodology.md`.

## Wejście

`/clarify <slug>` — konkretny spec; bez argumentu — przeskanuj `docs/specs/*/spec.md` po
`[?]`, pokaż kandydatów, zapytaj który.

## Procedura

1. **Zbierz luki** — każda linia `[?]` z nagłówkiem sekcji; dołóż luki implicytne (AC nie
   w formie Given/When/Then, metryki bez liczb, nieostry zakres).
2. **Pytaj pojedynczo** — jedno pytanie naraz, najpierw `Acceptance criteria` i zakres; do
   każdego **proponuj default / opcje**. Limit ~5–7 pytań / przebieg, resztę zostaw `[?]`.
3. **Zapisz** — podmień `[?]` in-place; dopisz `## Clarifications` (log `data — pytanie →
odpowiedź`); gdy **nie został żaden `[?]`** → frontmatter `status: clarified`.
4. **Re-waliduj** — `pnpm sdd:check`. Raportuj green / red.
5. **Hand-off** — zaproponuj `/analyze` → implementacja (delegacja przez orchestratora).

## Format

W trakcie: pojedyncze pytania z proponowanym defaultem. Na koniec: lista domkniętych `[?]`
(sekcja → wartość), status (`draft` / `clarified`), wynik `sdd:check`, następny krok.

## NIE

**Nie zmyślaj** — „nie wiem / pomiń" → zostaw `[?]`, trzymaj `status: draft`. Nie dotykaj
kodu ani planu. Nie pytaj 15 naraz — sekwencyjnie, priorytet na to, co blokuje plan.
