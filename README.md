# ⚛️ Element Clicker

Idle/Incremental-Clicker: **Wasserstoff sammeln → Elemente fusionieren → das Periodensystem hochklettern.**

Aktueller Stand: **Frühphase bis Beryllium** (vertikaler Slice) — alle Zahlen sind Playtesting-Startwerte, keine finale Balance.

## Kern-Loop

1. **Klick** oder **Generatoren** erzeugen Wasserstoff (H).
2. **Wolke kollabieren** → **Aktivierungsenergie (AE)** sammeln (+2 % globale H-Produktion je AE). Setzt H, Elemente & Generatoren zurück.
3. **AE → Kelvin** umwandeln (einweg). Bei **10 Mio K zünden** → schaltet die Fusion frei.
4. **Fusion** `2 mol X → 1 mol (X+1)` + freiwerdende Teilchen:
   - H→He: 2 Positronen (Sonderfall)
   - He→Li: 1 Proton + 1 Elektron
   - Li→Be: 2 Protonen + 3 Neutronen + 2 Elektronen
5. Nach der Zündung: **Nebel kollabieren** → **Gravitonen** (senken die AE-Schwellen).

Teilchen (p⁺/n⁰/e⁻/e⁺) werden vorerst nur gesammelt — Boni folgen später.

## Stack

- **Svelte 5** + **TypeScript** + **Vite**
- [`break_infinity.js`](https://github.com/Patashu/break_infinity.js) für sehr große Zahlen (2 mol = 1,2·10²⁴ und weit darüber hinaus)
- Persistenz: `localStorage` (Autosave alle 30 s) + Offline-Fortschritt (gedeckelt auf 12 h)
- 20-Hz-Tick-Loop, entkoppelt vom Rendern

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server
npm run build     # Production-Build
npm run check     # svelte-check (Typprüfung)
npm test          # Vitest (Formeln, Fusions-Bilanz)
```

## Struktur

- `src/lib/game/constants.ts` – alle Balancing-Werte zentral
- `src/lib/game/formulas.ts` – reine Formeln (Kostenkurve, Produktion, AE)
- `src/lib/game/elements.ts` – Periodensystem-Daten & Fusions-Rezepte
- `src/lib/game/generators.ts` – die 5 Generatoren
- `src/lib/game/state.ts` – Zustandsdefinition & Resets
- `src/lib/game/store.ts` – Svelte-Store + alle Spieleraktionen
- `src/lib/game/loop.ts` – Tick-Engine
- `src/lib/game/save.ts` – Speichern/Laden/Offline
- `src/lib/components/` – UI-Komponenten
