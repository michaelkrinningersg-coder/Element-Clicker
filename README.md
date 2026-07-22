# 🏜️ Sandkörner

Ein freundlicher Idle-/Incremental-Clicker: **Sand sammeln → Gebäude bauen → zu Glas schmelzen (Prestige).**

Frühphasen-Prototyp — bewusst minimal gehalten, alle Zahlen sind Playtesting-Startwerte.

## Spiel

- **Klick** = Sandkörner sammeln (Basis 1/Klick).
- **✋ Hand** (Klick-Gebäude): +1 Sand pro Klick je Hand. Startkosten 10.
- **🪣 Eimer** (Generator): +0,2 Sand/Sek. je Eimer. Startkosten 10.
- **🔷 Glas** (Prestige, ab 1·10⁹ Sand): schmilzt Sand zu Glas. Jedes Glas gibt +10 % auf Sand-Produktion & Klick. Prestige setzt Sand & Gebäude zurück, Glas bleibt.

## Stack

- **Svelte 5** + **TypeScript** + **Vite**
- [`break_infinity.js`](https://github.com/Patashu/break_infinity.js) für sehr große Zahlen
- Persistenz: `localStorage` (Autosave alle 30 s) + Offline-Fortschritt (12 h Cap)
- 20-Hz-Tick-Loop, entkoppelt vom Rendern

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server
npm run build     # Production-Build
npm run check     # svelte-check (Typprüfung)
npm test          # Vitest
```

## Struktur

- `src/lib/game/constants.ts` – Balancing-Werte
- `src/lib/game/buildings.ts` – die Gebäude (Hand, Eimer)
- `src/lib/game/formulas.ts` – reine Formeln (Klick, Produktion, Kostenkurve, Glas)
- `src/lib/game/state.ts` – Zustand & Resets
- `src/lib/game/store.ts` – Svelte-Store + Aktionen (Klick, Kauf, Prestige, Tick)
- `src/lib/game/save.ts` – Speichern/Laden/Offline
- `src/lib/components/` – UI (ResourceBar, ClickArea, BuildingsList, PrestigePanel)
