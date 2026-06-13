---
agent: agent
description: Pre-spec ideation — diverge into distinct approaches, weigh trade-offs against repo conventions, converge on one recommendation, then hand off to pnpm workflow:specify. Read-only; writes no artifacts.
---

# /brainstorming — rozgrzewka przed drabiną SDD

Ustrukturyzowana ideacja **przed** `specify`. Z tematu/problemu robi 3–5 **odrębnych**
podejść, waży je względem twardych reguł repo i schodzi do **jednej** rekomendacji.
Read-only — żadnego kodu, specu ani plików w repo. Kanon:
[`docs/sdd/methodology.md`](../../docs/sdd/methodology.md).

## Wejście

`/brainstorming <temat/problem>` — luźny opis pomysłu, bólu albo „co gdyby". Bez argumentu:
poproś o jedno zdanie problemu, nie zgaduj.

## Procedura

1. **Rozbieżność** — wygeneruj **3–5 wyraźnie różnych** podejść (inna architektura / lib /
   granica, nie warianty jednego pomysłu). Każde jednym zdaniem: na czym polega.
2. **Ocena** — tabela `podejście | złożoność | ryzyko | zgodność z konwencjami repo |
koszt`. Oceniaj względem **twardych reguł**: Signal Forms (`form()`/`schema()`,
   zakaz `FormGroup`/`ngModel`), wrappery `@angular22/ui-material` (nie `@angular/material/*`
   poza `libs/ui/material`), komponenty tylko przez `pnpm nx g @nx/angular:component`,
   i18n `a22T` (PL = klucz), próg SDD. Podejście łamiące regułę → **niska zgodność**.
3. **Zbieżność** — rekomenduj **JEDNO** podejście z **jednym zdaniem** uzasadnienia;
   odrzucone wymień z powodem (jedno zdanie / podejście). Bez cichego wyboru — pokaż stół.
4. **Hand-off** — zaproponuj konkretny start drabiny:
   `pnpm workflow:specify -- --verb=<verb> --slug=<slug>` z dobranym verbem
   (`feature` / `component` / `fix` / `refactor` / `deps` / `chore` / `security`) i `slug`em
   (`[a-z0-9-]+`). Dalej: [`/clarify`](./clarify.prompt.md) → plan → `/analyze`.

## Format

Tabela opcji (krok 2) → rekomendacja + odrzucone z powodem → **następny krok** jako gotowa
komenda `specify`. Zwięźle: wynik ponad proces.

## NIE

**Nie pisz kodu ani specu**, niczego nie generuj w repo (read-only — `specify` to robi).
Nie decyduj po cichu — zawsze pokaż opcje i powód odrzucenia. Nie przeskakuj do
implementacji ani planu. Nie mnóż wariantów jednego pomysłu jako „różne podejścia" —
różne = inna granica/lib/architektura. Twarde reguły z
[`copilot-instructions`](../copilot-instructions.md) są aksjomatem, nie przedmiotem burzy.
