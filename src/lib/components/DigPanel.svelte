<script lang="ts">
  import { game } from "../game/store";
  import {
    digDepthMeters,
    tonnesPerMeterAt,
    weightInTonnes,
    isMaxDepth,
    digMilestonesReached,
    digIncomeMultiplier,
    grainsForDepth,
    totalProductionPerSec,
    effectiveDigCompletions,
  } from "../game/formulas";
  import {
    DIG_MILESTONES,
    DIG_CENTER_M,
    DIG_START_TPM,
    EARTH_DIAMETER_M,
  } from "../game/constants";
  import {
    formatDepth,
    formatKm,
    formatDecimal,
    formatScientific,
    formatEta,
  } from "../game/format";
  import { Decimal } from "../game/decimal";

  $: prod = totalProductionPerSec($game);
  $: depth = digDepthMeters($game.runSandEver);
  $: tonnes = weightInTonnes($game.runSandEver);
  $: tPerM = tonnesPerMeterAt(depth);
  $: atMax = isMaxDepth(depth);
  $: pctToDiameter = new Decimal(depth).div(EARTH_DIAMETER_M).mul(100);
  $: barPct = Math.max(0, Math.min(100, (depth / EARTH_DIAMETER_M) * 100));
  $: reachedCount = digMilestonesReached(depth);
  $: incomeBonusPct = (digIncomeMultiplier($game).toNumber() - 1) * 100;
  // Nächster noch nicht erreichter Meilenstein.
  $: nextMs = DIG_MILESTONES.find((m) => depth < m.m);

  const pctLabel = (p: Decimal): string =>
    p.gte(0.01) ? `${formatDecimal(p, 4)} %` : `${formatScientific(p)} %`;
  const tpm = (n: number): string => `${formatDecimal(new Decimal(n))} t / m`;

  const REFS = DIG_MILESTONES;
</script>

<div class="panel">
  <div class="head">
    <h3>⛏️ Graben</h3>
    {#if atMax}
      <span class="maxchip">Erddurchmesser erreicht</span>
    {/if}
  </div>
  <p class="legend dim">
    Der <b>in diesem Run</b> gesammelte Sand bemisst, wie tief du gräbst (Reset bei
    Prestige). Tiefer wird das Gestein schwerer – tiefer als der Erddurchmesser geht es
    nicht. Jede erreichte Vergleichstiefe gibt <b>+1 % auf alle Einkünfte</b>
    (Klick &amp; Produktion).
  </p>

  <div class="depthbox">
    <span class="dlabel">Gegrabene Tiefe</span>
    <span class="dval mono">{formatDepth(depth)}</span>
    <span class="dkm dim">{formatKm(depth)} · aktuell {tpm(tPerM)}</span>
  </div>

  <div class="prog">
    <div class="progtop">
      <span class="dim">Fortschritt zum Erddurchmesser</span>
      <span class="mono">{pctLabel(pctToDiameter)}</span>
    </div>
    <div class="bar" aria-hidden="true">
      <div class="fill" style="width:{barPct}%"></div>
    </div>
    <span class="dim small">
      {formatDepth(depth)} von {EARTH_DIAMETER_M.toLocaleString("de-DE")} m ·
      gesammelt {formatDecimal(tonnes)} t Sand
    </span>
  </div>

  <div class="bonusbox">
    <div class="bcol">
      <span class="blabel">Erreichte Meilensteine</span>
      <span class="bval">{reachedCount} / {DIG_MILESTONES.length}</span>
    </div>
    <div class="bcol">
      <span class="blabel">Bonus auf alle Einkünfte</span>
      <span class="bval accent">+{formatDecimal(new Decimal(incomeBonusPct), 0)} %</span>
    </div>
    {#if nextMs}
      <div class="bcol next">
        <span class="blabel">Nächster Meilenstein</span>
        <span class="bnext">{nextMs.name} · {formatDepth(nextMs.m)}</span>
      </div>
    {/if}
  </div>

  <div class="grp">
    <h4>Gestein je Meter (wird exponentiell schwerer)</h4>
    <div class="rules">
      <div class="rule">
        <span class="range">Oberfläche (0 m)</span>
        <span class="tpm">{tpm(DIG_START_TPM)}</span>
      </div>
      <div class="rule active">
        <span class="range">Aktuelle Tiefe ({formatDepth(depth)})</span>
        <span class="tpm">{tpm(tPerM)}</span>
      </div>
      <div class="rule">
        <span class="range">Erdmittelpunkt ({formatKm(DIG_CENTER_M)})</span>
        <span class="tpm">{tpm(tonnesPerMeterAt(DIG_CENTER_M))}</span>
      </div>
    </div>
    <p class="note dim">
      An der Oberfläche unverändert {DIG_START_TPM} t/m – im Erdmittelpunkt das
      1·10<sup>30</sup>-fache. Du sammelst gleich viel Sand, aber jeder Meter dauert
      immer länger.
    </p>
  </div>

  <div class="grp">
    <h4>Vergleichstiefen &amp; Meilensteine</h4>
    <div class="refs">
      {#each REFS as r (r.id)}
        {@const reached = depth >= r.m}
        {@const done = effectiveDigCompletions($game, r.id)}
        <div class="ref" class:reached>
          <span class="rmark">{reached ? "✓" : "○"}</span>
          <div class="rinfo">
            <span class="rnameline">
              <span class="rname">{r.name}</span>
              {#if done > 0}<span class="cbadge">×{done}</span>{/if}
            </span>
            <span class="rbonustext dim">
              +1 % Einkünfte · +0,1 % Produktion je Abschluss{#if r.id === "mensch"} · +0,1 % je Arbeiter je Abschluss{/if}
            </span>
            {#if !reached}
              <span class="reta dim">⏱ {formatEta(grainsForDepth(r.m), $game.runSandEver, prod)}</span>
            {/if}
          </div>
          <span class="rbonus" class:on={reached}>+1 %</span>
          <span class="rm mono">{formatDepth(r.m)}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }
  h3 {
    margin: 0;
  }
  .maxchip {
    background: #e7f4ec;
    border: 1px solid #bfe2cc;
    color: var(--good);
    border-radius: 999px;
    padding: 3px 11px;
    font-size: 12px;
    font-weight: 700;
  }
  .legend {
    font-size: 13px;
    margin: 0 0 14px;
  }
  .depthbox {
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-left: 3px solid var(--accent);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 14px;
  }
  .dlabel {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
  }
  .dval {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.05;
    color: var(--gold);
  }
  .dkm {
    font-size: 13px;
  }
  .prog {
    margin-bottom: 14px;
  }
  .bonusbox {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-left: 3px solid var(--accent-2);
    border-radius: 10px;
    padding: 11px 14px;
    margin-bottom: 18px;
  }
  .bcol {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 120px;
  }
  .bcol.next {
    flex: 1;
    min-width: 160px;
  }
  .blabel {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
  }
  .bval {
    font-size: 18px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .bval.accent {
    color: var(--accent-2);
  }
  .bnext {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }
  .progtop {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
    margin-bottom: 6px;
  }
  .bar {
    height: 10px;
    border-radius: 999px;
    background: var(--panel-dim);
    border: 1px solid var(--border-row);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--progress-fill);
  }
  .small {
    font-size: 12px;
    display: inline-block;
    margin-top: 6px;
  }
  .grp {
    margin-bottom: 16px;
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
  .rules,
  .refs {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .rule {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 9px;
    padding: 9px 13px;
    font-size: 14px;
    font-variant-numeric: tabular-nums;
  }
  .rule.active {
    border-color: var(--accent);
    background: #fff6e2;
    font-weight: 600;
  }
  .tpm {
    color: var(--gold);
    font-weight: 700;
  }
  .note {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.5;
  }
  .ref {
    display: grid;
    grid-template-columns: 22px 1fr auto auto;
    align-items: center;
    gap: 10px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 9px;
    padding: 8px 13px;
    font-size: 13px;
  }
  .rinfo {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .rnameline {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .cbadge {
    font-size: 10px;
    font-weight: 700;
    color: #8a5a12;
    background: #fff2c8;
    border: 1px solid #e8bf5e;
    border-radius: 999px;
    padding: 1px 7px;
  }
  .rbonustext {
    font-size: 11px;
    line-height: 1.35;
  }
  .reta {
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  .rbonus {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-locked);
    background: var(--panel-dim);
    border: 1px solid var(--border-row);
    border-radius: 999px;
    padding: 1px 7px;
  }
  .rbonus.on {
    color: var(--prod);
    background: var(--chip-grav-bg);
    border-color: var(--chip-grav-bd);
  }
  .ref.reached {
    border-color: var(--accent-2);
    background: #eef7f8;
  }
  .rmark {
    text-align: center;
    font-weight: 700;
    color: var(--text-locked);
  }
  .ref.reached .rmark {
    color: var(--good);
  }
  .rm {
    color: var(--text-dim);
    font-variant-numeric: tabular-nums;
  }
</style>
