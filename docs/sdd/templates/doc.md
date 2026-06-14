---
type: template
for: docs
description: Kształt strony kanonu w docs/ — DRY (wskazuje źródło prawdy, nie kopiuje reguł)
---

# Szablon: strona dokumentacji (`docs/<temat>.md`)

> Kanon kształtu strony produkowanej przez [`docs`](../../../.github/agents/docs.agent.md).
> **DRY nadrzędne:** strona **wskazuje** kanon ([`copilot-instructions`](../../../.github/copilot-instructions.md),
> [`AGENTS.md`](../../../AGENTS.md), [`../methodology.md`](../methodology.md)) — **nie kopiuje** reguł.
> Token economy: gęsto, link zamiast kopii. Fakty muszą zgadzać się z kodem (`apps/*`, `libs/*`,
> `package.json`, `*.agent.md`).

---

# <Tytuł tematu>

> [?] Jednozdaniowy cel strony + (jeśli to derywat) **wskaźnik do źródła prawdy**: „Kanon X żyje
> w `<plik>` — ta strona tylko <rola>".

## Po co (kontekst)

[?] Jaki problem / decyzję strona dokumentuje i kiedy po nią sięgnąć.

## Treść

[?] Sedno — mapa / kroki / tabela. Linkuj kanon zamiast przepisywać reguły. Nazwy (selektor /
API / port / skrypt / ścieżka) **dokładnie** jak w kodzie (rozjazd nazw → glosariusz `doc-verifier`).

## Granica / czego tu nie ma

[?] Co świadomie żyje gdzie indziej (link), żeby nie powielać.

## Linki

[?] Powiązane strony kanonu i pliki kodu.
