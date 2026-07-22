<script lang="ts">
  import { game } from "../game/store";
  import { totalProductionPerSec, clickValue } from "../game/formulas";
  import {
    formatDecimal,
    formatInt,
    formatWeight,
    formatNumber,
    formatDuration,
  } from "../game/format";

  $: production = totalProductionPerSec($game);
  $: perClick = clickValue($game);
</script>

<div class="panel">
  <h3>Statistiken</h3>

  <div class="grp">
    <h4>Sand</h4>
    <div class="rows">
      <div class="stat">
        <span class="k">Sandkörner (aktuell)</span>
        <span class="v mono">{formatDecimal($game.sand)}</span>
      </div>
      <div class="stat hi">
        <span class="k">Insgesamt gesammelte Sandkörner</span>
        <span class="v mono">{formatDecimal($game.totalSandEver)}</span>
      </div>
      <div class="stat hi">
        <span class="k">Gesamtgewicht des Sandes</span>
        <span class="v mono weight">{formatWeight($game.totalSandEver)}</span>
      </div>
      <div class="stat">
        <span class="k">Produktion</span>
        <span class="v mono">+{formatDecimal(production)} /s</span>
      </div>
      <div class="stat">
        <span class="k">Pro Klick</span>
        <span class="v mono">+{formatDecimal(perClick)}</span>
      </div>
    </div>
    <p class="note dim">100 Sandkörner wiegen 1 mg.</p>
  </div>

  <div class="grp">
    <h4>Fortschritt</h4>
    <div class="rows">
      <div class="stat">
        <span class="k">Klicks insgesamt</span>
        <span class="v mono">{formatNumber($game.totalClicks)}</span>
      </div>
      <div class="stat">
        <span class="k">Glas</span>
        <span class="v mono">{formatInt($game.glas)}</span>
      </div>
      <div class="stat">
        <span class="k">Prestiges (zu Glas geschmolzen)</span>
        <span class="v mono">{formatNumber($game.prestigeCount)}</span>
      </div>
      <div class="stat">
        <span class="k">Spielzeit</span>
        <span class="v mono">{formatDuration($game.playtimeSeconds)}</span>
      </div>
    </div>
  </div>
</div>

<style>
  h3 {
    margin: 0 0 14px;
  }
  .grp {
    margin-bottom: 18px;
  }
  .grp:last-child {
    margin-bottom: 0;
  }
  h4 {
    margin: 0 0 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
  }
  .rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .stat {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 9px;
    padding: 9px 13px;
    font-variant-numeric: tabular-nums;
  }
  .stat.hi {
    border-color: var(--accent);
    background: #fff6e2;
  }
  .k {
    color: var(--text-dim);
    font-size: 14px;
  }
  .v {
    font-weight: 700;
    color: var(--text);
  }
  .v.weight {
    color: var(--gold);
    font-size: 16px;
  }
  .note {
    margin: 8px 0 0;
    font-size: 12px;
  }
</style>
