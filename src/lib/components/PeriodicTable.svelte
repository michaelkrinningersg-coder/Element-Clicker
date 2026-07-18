<script lang="ts">
  import { game } from "../game/store";
  import { formatInt } from "../game/format";
  import { Decimal } from "../game/decimal";

  // Erste zwei Perioden im klassischen Layout (18-Spalten-Raster).
  // Nur H..Be sind in der Frühphase relevant, der Rest ist Ausblick.
  interface Cell {
    sym: string;
    z: number;
    col: number;
    row: number;
  }
  const cells: Cell[] = [
    { sym: "H", z: 1, col: 1, row: 1 },
    { sym: "He", z: 2, col: 18, row: 1 },
    { sym: "Li", z: 3, col: 1, row: 2 },
    { sym: "Be", z: 4, col: 2, row: 2 },
    { sym: "B", z: 5, col: 13, row: 2 },
    { sym: "C", z: 6, col: 14, row: 2 },
    { sym: "N", z: 7, col: 15, row: 2 },
    { sym: "O", z: 8, col: 16, row: 2 },
    { sym: "F", z: 9, col: 17, row: 2 },
    { sym: "Ne", z: 10, col: 18, row: 2 },
  ];

  function isUnlocked(sym: string, g: typeof $game): boolean {
    if (sym === "H") return true;
    if (sym === "He") return g.unlocked.He;
    if (sym === "Li") return g.unlocked.Li;
    if (sym === "Be") return g.unlocked.Be;
    return false;
  }

  function amount(sym: string, g: typeof $game): Decimal | null {
    if (sym === "He") return g.elements.He;
    if (sym === "Li") return g.elements.Li;
    if (sym === "Be") return g.elements.Be;
    return null;
  }
</script>

<div class="panel">
  <h3>Periodensystem</h3>
  <div class="grid">
    {#each cells as c (c.sym)}
      {@const unlocked = isUnlocked(c.sym, $game)}
      {@const amt = amount(c.sym, $game)}
      <div
        class="cell"
        class:on={unlocked}
        style="grid-column:{c.col}; grid-row:{c.row};"
        title={c.sym}
      >
        <span class="z">{c.z}</span>
        <span class="sym">{c.sym}</span>
        {#if unlocked && amt}
          <span class="amt mono">{formatInt(amt)}</span>
        {/if}
      </div>
    {/each}
  </div>
  <p class="dim legend">Erreichte Elemente leuchten auf · Mengen in mol</p>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(18, 1fr);
    grid-auto-rows: 1fr;
    gap: 4px;
  }
  .cell {
    aspect-ratio: 1;
    border: 1px solid var(--border-panel);
    border-radius: 6px;
    background: #0d1326;
    color: var(--text-locked-2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 0;
  }
  .cell.on {
    background: linear-gradient(180deg, #2e4079, #1a2647);
    border-color: var(--accent);
    color: var(--text);
    box-shadow: 0 0 12px rgba(110, 168, 255, 0.4);
  }
  .z {
    position: absolute;
    top: 2px;
    left: 4px;
    font-size: 8px;
    opacity: 0.7;
  }
  .sym {
    font-weight: 700;
    font-size: 15px;
  }
  .amt {
    font-size: 8px;
    color: var(--gold);
  }
  .legend {
    font-size: 12px;
    margin: 10px 0 0;
  }
</style>
