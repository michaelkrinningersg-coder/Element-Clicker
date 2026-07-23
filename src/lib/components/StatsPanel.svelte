<script lang="ts">
  import { game } from "../game/store";
  import {
    totalProductionPerSec,
    clickValue,
    achievementProductionMult,
    costMultiplier,
    generatorBoostMultiplier,
    generatorCount,
    arbeiterBoostMultiplier,
    timeBoostMultiplier,
    runTimeBoostMultiplier,
  } from "../game/formulas";
  import { unlockedCount } from "../game/achievements";
  import {
    formatDecimal,
    formatInt,
    formatWeight,
    formatNumber,
    formatDuration,
  } from "../game/format";

  $: production = totalProductionPerSec($game);
  $: perClick = clickValue($game);
  $: built = unlockedCount($game);
  $: genCount = generatorCount($game);
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
        <span class="k">Gesamtgewicht des Sandes (gesamt)</span>
        <span class="v mono weight">{formatWeight($game.totalSandEver)}</span>
      </div>
      <div class="stat hi">
        <span class="k">Gewicht dieses Prestige (Run)</span>
        <span class="v mono weight">{formatWeight($game.runSandEver)}</span>
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
        <span class="k">Spielzeit (gesamt)</span>
        <span class="v mono">{formatDuration($game.playtimeSeconds)}</span>
      </div>
      <div class="stat">
        <span class="k">Spielzeit (dieses Prestige)</span>
        <span class="v mono">{formatDuration($game.runPlaytimeSeconds)}</span>
      </div>
    </div>
  </div>

  <div class="grp">
    <h4>Bauwerk-Boni</h4>
    <div class="rows">
      <div class="stat">
        <span class="k">Gebaute Bauwerke</span>
        <span class="v mono">{built}</span>
      </div>
      <div class="stat">
        <span class="k">Produktions-Multiplikator</span>
        <span class="v mono">×{formatDecimal(achievementProductionMult($game), 3)}</span>
      </div>
      <div class="stat">
        <span class="k">Kosten-Multiplikator</span>
        <span class="v mono">×{formatDecimal(costMultiplier($game), 3)}</span>
      </div>
    </div>
  </div>

  <div class="grp">
    <h4>Generator-Synergie</h4>
    <div class="rows">
      <div class="stat">
        <span class="k">Generatoren insgesamt</span>
        <span class="v mono">{formatNumber(genCount)}</span>
      </div>
      <div class="stat">
        <span class="k">Produktions-Multiplikator (+0,1 % je Generator)</span>
        <span class="v mono">×{formatDecimal(generatorBoostMultiplier($game), 3)}</span>
      </div>
      <div class="stat">
        <span class="k">Arbeiter ({formatNumber($game.buildings.arbeiter.owned)}) · +1 % je Arbeiter</span>
        <span class="v mono">×{formatDecimal(arbeiterBoostMultiplier($game), 3)}</span>
      </div>
      <div class="stat">
        <span class="k">Zeit-Bonus gesamt (+0,01 % je Spielsekunde)</span>
        <span class="v mono">×{formatDecimal(timeBoostMultiplier($game), 3)}</span>
      </div>
      <div class="stat">
        <span class="k">Zeit-Bonus dieses Prestige (+0,01 % je Run-Sekunde)</span>
        <span class="v mono">×{formatDecimal(runTimeBoostMultiplier($game), 3)}</span>
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
