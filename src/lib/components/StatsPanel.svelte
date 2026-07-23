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
    runTimeBoostMultiplier,
    runTimeBoostRate,
    effectiveDigCompletions,
    totalDigCompletions,
    digCompletionMultiplier,
    completionBuildingMult,
    eventMultiplier,
  } from "../game/formulas";
  import { unlockedCount, effectiveCompletions } from "../game/achievements";
  import { ACHIEVEMENTS } from "../game/achievements";
  import { BUILDINGS } from "../game/buildings";
  import {
    DIG_MILESTONES,
    ARBEITER_BOOST_PER,
    MENSCH_ARBEITER_PER,
    EVENT_NAME,
    EXCAVATION_UNLOCK_PRESTIGE,
    DINO_MAX_M,
  } from "../game/constants";
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
  // Graben-Abschlüsse nur anzeigen, wenn > 0 (Liste sonst sehr lang).
  $: digDone = DIG_MILESTONES.map((m) => ({ m, n: effectiveDigCompletions($game, m.id) })).filter(
    (x) => x.n > 0,
  );
  $: digTotal = totalDigCompletions($game);
  // Effektive Raten inkl. Abschluss-Boni.
  $: timeRatePct = runTimeBoostRate($game) * 100; // % je Sekunde (inkl. Sanduhr)
  $: arbeiterPct =
    (ARBEITER_BOOST_PER + MENSCH_ARBEITER_PER * effectiveDigCompletions($game, "mensch")) * 100;
  // Pro-Gebäude-Boni aus Bauwerk-Abschlüssen (nur > 1).
  $: genBonuses = BUILDINGS.filter((b) => b.kind === "generator")
    .map((b) => ({ name: b.name, mult: completionBuildingMult($game, b.id) }))
    .filter((x) => x.mult.gt(1));
  const pctStr = (n: number, digits = 3) =>
    n.toLocaleString("de-DE", { maximumFractionDigits: digits });

  const PRESTIGE_UNLOCKS = [
    { at: 5, label: "Generator Radlader" },
    { at: 10, label: "Ausgrabungen (Dino-Knochen)" },
    { at: 15, label: "Generator Muldenkipper" },
  ];
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
        <span class="k">Insgesamt gesammelte Sandkörner (gesamt)</span>
        <span class="v mono">{formatDecimal($game.totalSandEver)}</span>
      </div>
      <div class="stat hi">
        <span class="k">Sandkörner gesammelt (dieses Prestige)</span>
        <span class="v mono">{formatDecimal($game.runSandEver)}</span>
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
      <div class="stat hi">
        <span class="k">Prestiges (zu Glas geschmolzen)</span>
        <span class="v mono">{formatNumber($game.prestigeCount)}</span>
      </div>
      {#each PRESTIGE_UNLOCKS as u (u.at)}
        <div class="stat">
          <span class="k">{u.label}</span>
          <span class="v mono">
            {#if $game.prestigeCount >= u.at}✓ frei{:else}🔒 ab {u.at} Prestiges{/if}
          </span>
        </div>
      {/each}
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
        <span class="k">Arbeiter ({formatNumber($game.buildings.arbeiter.owned)}) · +{pctStr(arbeiterPct)} % je Arbeiter (inkl. Mensch)</span>
        <span class="v mono">×{formatDecimal(arbeiterBoostMultiplier($game), 3)}</span>
      </div>
      <div class="stat">
        <span class="k">Zeit-Bonus (+{pctStr(timeRatePct, 4)} % je Sekunde, inkl. Sanduhr)</span>
        <span class="v mono">×{formatDecimal(runTimeBoostMultiplier($game), 3)}</span>
      </div>
      <div class="stat">
        <span class="k">Graben-Abschluss-Bonus (+0,1 % je Abschluss)</span>
        <span class="v mono">×{formatDecimal(digCompletionMultiplier($game), 3)}</span>
      </div>
      <div class="stat" class:hi={$game.eventRemaining > 0}>
        <span class="k">
          Event „{EVENT_NAME}"
          {#if $game.eventRemaining > 0}· aktiv, noch {Math.ceil($game.eventRemaining)} s{/if}
        </span>
        <span class="v mono">×{formatDecimal(eventMultiplier($game), 0)}</span>
      </div>
    </div>
  </div>

  {#if genBonuses.length > 0}
    <div class="grp">
      <h4>Gebäude-Boni aus Bauwerk-Abschlüssen</h4>
      <div class="rows">
        {#each genBonuses as g (g.name)}
          <div class="stat">
            <span class="k">{g.name}</span>
            <span class="v mono">×{formatDecimal(g.mult, 3)}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if $game.prestigeCount >= EXCAVATION_UNLOCK_PRESTIGE || $game.dinoBones > 0}
    <div class="grp">
      <h4>Ausgrabungen</h4>
      <div class="rows">
        <div class="stat hi">
          <span class="k">🦴 Dino-Knochen gefunden</span>
          <span class="v mono">{formatNumber($game.dinoBones)}</span>
        </div>
        <div class="stat">
          <span class="k">Ausgewertete Meter (dieser Run, 1–{DINO_MAX_M} m)</span>
          <span class="v mono">{formatNumber($game.excavatedMeter)}</span>
        </div>
      </div>
      <p class="note dim">Je vollständig gegrabenem Meter (1–{DINO_MAX_M} m) 5 % Chance auf einen Dino-Knochen.</p>
    </div>
  {/if}

  <div class="grp">
    <h4>Bauwerk-Abschlüsse (mit aktuellem Run)</h4>
    <div class="rows">
      {#each ACHIEVEMENTS as a (a.id)}
        <div class="stat">
          <span class="k">{a.name}</span>
          <span class="v mono">×{formatNumber(effectiveCompletions($game, a.id))}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="grp">
    <h4>Graben-Abschlüsse (gesamt {formatNumber(digTotal)})</h4>
    <div class="rows">
      {#if digDone.length === 0}
        <p class="note dim">Noch keine Tiefe erreicht.</p>
      {:else}
        {#each digDone as d (d.m.id)}
          <div class="stat">
            <span class="k">{d.m.name}</span>
            <span class="v mono">×{formatNumber(d.n)}</span>
          </div>
        {/each}
      {/if}
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
