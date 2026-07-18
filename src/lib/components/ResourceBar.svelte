<script lang="ts">
  import { game } from "../game/store";
  import { totalProductionPerSec } from "../game/formulas";
  import { formatDecimal, formatMol, formatInt } from "../game/format";

  $: production = totalProductionPerSec($game);
</script>

<div class="panel bar">
  <div class="hcol">
    <div class="atoms mono">{formatDecimal($game.h)} <span class="dim">Atome</span></div>
    <div class="mol mono">{formatMol($game.h)}</div>
    <div class="rate mono dim">+{formatDecimal(production)} /s</div>
  </div>
  <div class="chips">
    <span class="chip">🔥 AE: <b class="mono">{formatInt($game.ae)}</b></span>
    <span class="chip">🌡️ {formatDecimal($game.kelvin)} K</span>
    {#if $game.ignited}
      <span class="chip">🌀 Gravitonen: <b class="mono">{formatInt($game.gravitons)}</b></span>
    {/if}
  </div>
</div>

<style>
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .atoms {
    font-size: 1.9rem;
    font-weight: 700;
  }
  .mol {
    font-size: 1.15rem;
    color: var(--gold);
  }
  .rate {
    font-size: 0.95rem;
  }
  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .chip {
    background: var(--bg-panel-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 0.9rem;
  }
</style>
