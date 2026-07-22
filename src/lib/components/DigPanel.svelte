<script lang="ts">
  import { game } from "../game/store";
  import {
    digDepthMeters,
    tonnesPerMeterAt,
    weightInTonnes,
    isMaxDepth,
  } from "../game/formulas";
  import { DIG_TIERS, EARTH_DIAMETER_M } from "../game/constants";
  import { formatDepth, formatKm, formatDecimal, formatScientific } from "../game/format";
  import { Decimal } from "../game/decimal";

  $: depth = digDepthMeters($game.totalSandEver);
  $: tonnes = weightInTonnes($game.totalSandEver);
  $: tPerM = tonnesPerMeterAt(depth);
  $: atMax = isMaxDepth(depth);
  $: pctToDiameter = new Decimal(depth).div(EARTH_DIAMETER_M).mul(100);
  $: barPct = Math.max(0, Math.min(100, (depth / EARTH_DIAMETER_M) * 100));

  const pctLabel = (p: Decimal): string =>
    p.gte(0.01) ? `${formatDecimal(p, 4)} %` : `${formatScientific(p)} %`;

  // Reale Vergleichstiefen (motivierende Meilensteine).
  const REFS = [
    { name: "Tiefster Punkt im Meer (Marianengraben)", m: 10_994 },
    { name: "Tiefste Bohrung (Kola, Russland)", m: 12_262 },
    { name: "Untergrenze der Erdkruste", m: 35_000 },
    { name: "Oberer Erdmantel", m: 410_000 },
    { name: "Äußerer Erdkern", m: 2_890_000 },
    { name: "Erdmittelpunkt", m: EARTH_DIAMETER_M / 2 },
  ];

  // Tonnage-Regeln als Bereiche für die Tabelle.
  const RANGES = DIG_TIERS.map((t, i) => {
    const to = DIG_TIERS[i + 1]?.fromM;
    return { fromM: t.fromM, toM: to, tPerM: t.tPerM };
  });
  const rangeLabel = (r: { fromM: number; toM?: number }): string =>
    r.toM == null
      ? `ab ${r.fromM.toLocaleString("de-DE")} m`
      : `${r.fromM.toLocaleString("de-DE")}–${r.toM.toLocaleString("de-DE")} m`;
</script>

<div class="panel">
  <div class="head">
    <h3>⛏️ Graben</h3>
    {#if atMax}
      <span class="maxchip">Erddurchmesser erreicht</span>
    {/if}
  </div>
  <p class="legend dim">
    Dein gesammelter Sand bemisst, wie tief du gräbst. Tiefer wird das Gestein schwerer –
    tiefer als der Erddurchmesser geht es nicht.
  </p>

  <div class="depthbox">
    <span class="dlabel">Gegrabene Tiefe</span>
    <span class="dval mono">{formatDepth(depth)}</span>
    <span class="dkm dim">{formatKm(depth)} · aktuell {tPerM} t je Meter</span>
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

  <div class="grp">
    <h4>Gestein je Meter</h4>
    <div class="rules">
      {#each RANGES as r (r.fromM)}
        {@const active = depth >= r.fromM && (r.toM == null || depth < r.toM)}
        <div class="rule" class:active>
          <span class="range">{rangeLabel(r)}</span>
          <span class="tpm">{r.tPerM} t / m</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="grp">
    <h4>Vergleichstiefen</h4>
    <div class="refs">
      {#each REFS as r (r.name)}
        {@const reached = depth >= r.m}
        <div class="ref" class:reached>
          <span class="rmark">{reached ? "✓" : "○"}</span>
          <span class="rname">{r.name}</span>
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
    margin-bottom: 18px;
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
  .ref {
    display: grid;
    grid-template-columns: 22px 1fr auto;
    align-items: center;
    gap: 10px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 9px;
    padding: 8px 13px;
    font-size: 13px;
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
