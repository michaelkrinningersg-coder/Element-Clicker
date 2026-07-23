<script lang="ts">
  import { game, prestige } from "../game/store";
  import {
    glasGain,
    glasMultiplier,
    sandForGlas,
    sandForNextGlas,
    totalProductionPerSec,
  } from "../game/formulas";
  import { GLAS_UNLOCK, GLAS_BONUS_PER } from "../game/constants";
  import { formatDecimal, formatInt, formatEta } from "../game/format";
  import { Decimal } from "../game/decimal";

  $: gain = glasGain($game);
  $: unlocked = $game.sand.gte(GLAS_UNLOCK);
  $: progressPct = Decimal.min($game.sand.div(GLAS_UNLOCK), new Decimal(1)).mul(100).toNumber();
  $: bonusPct = (glasMultiplier($game).toNumber() - 1) * 100;

  $: prod = totalProductionPerSec($game);
  $: gainNum = gain.toNumber();
  $: nextK = gainNum + 1;
  $: nextThreshold = sandForNextGlas($game);
  $: remaining = Decimal.max(nextThreshold.sub($game.sand), new Decimal(0));
  $: nextEta = formatEta(nextThreshold, $game.sand, prod);
  // Fortschritt innerhalb der aktuellen Glas-Stufe (von k² zu (k+1)²).
  $: stepFrom = sandForGlas(gainNum);
  $: stepPct = Decimal.min(
    Decimal.max($game.sand.sub(stepFrom), new Decimal(0)).div(nextThreshold.sub(stepFrom)),
    new Decimal(1),
  ).mul(100).toNumber();

  // log10 einer Decimal (über Exponent + Mantisse, für beliebige Größen).
  const log10D = (d: Decimal): number =>
    d.lte(0) ? 0 : d.exponent + Math.log10(d.mantissa);

  // Glas-Kurve: y = Glas = √(Sand/1e9), x = Sand (log-Skala).
  $: chart = (() => {
    const W = 320, H = 140, pad = 24;
    const plotW = W - pad * 2, plotH = H - pad * 2;
    const L0 = 9; // 1e9
    const Lcur = Math.max(L0, log10D($game.sand));
    const Lnext = log10D(nextThreshold);
    const L1 = Math.max(11, 9 + 2 * Math.log10(gainNum + 3), Lnext + 0.2, Lcur + 0.2);
    const yMax = Math.pow(10, (L1 - 9) / 2);
    const sx = (L: number) => pad + ((L - L0) / (L1 - L0)) * plotW;
    const sy = (y: number) => pad + plotH - (Math.min(y, yMax) / yMax) * plotH;
    let path = "";
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const L = L0 + ((L1 - L0) * i) / N;
      const glas = Math.pow(10, (L - 9) / 2);
      path += (i === 0 ? "M" : "L") + sx(L).toFixed(1) + " " + sy(glas).toFixed(1) + " ";
    }
    const curClamped = Math.min(L1, Lcur);
    return {
      W, H, pad, plotW, plotH, path, yMax,
      cur: { x: sx(curClamped), y: sy(Math.pow(10, (curClamped - 9) / 2)) },
      next: { x: sx(Lnext), y: sy(nextK) },
      xRight: new Decimal(10).pow(L1),
    };
  })();
</script>

<div class="panel">
  <h3>Prestige · Glas</h3>

  <p class="dim small">
    Aus vielen Sandkörnern wird Glas. Jedes Glas gibt <b>+{GLAS_BONUS_PER * 100} %</b>
    auf Sand-Produktion &amp; Klick (bleibt erhalten). Prestige setzt Sand &amp; Gebäude zurück.
  </p>

  <div class="stat">
    <span>🔷 Glas</span>
    <span class="mono"><b>{formatInt($game.glas)}</b> · Bonus +{bonusPct.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %</span>
  </div>

  <div class="glasbox">
    <div class="grow">
      <span class="glabel">Ertrag beim Prestige (dieser Run)</span>
      <span class="gval mono">{formatInt(gain)} 🔷</span>
    </div>
    <div class="grow">
      <span class="glabel">Nächstes Glas ({formatInt(new Decimal(nextK))}) bei</span>
      <span class="gval mono">{formatDecimal(nextThreshold)} Sand</span>
    </div>
    <div class="steprow">
      <div class="progress"><div class="fill" style="width:{stepPct}%"></div></div>
      <span class="dim small nowrap">
        noch {formatDecimal(remaining)} Sand · ⏱ {nextEta}
      </span>
    </div>
  </div>

  <div class="chart">
    <span class="ctitle dim small">Glas-Kurve · Glas = √(Sand / {formatDecimal(GLAS_UNLOCK)})</span>
    <svg viewBox="0 0 {chart.W} {chart.H}" class="csvg" role="img" aria-label="Glas-Gewinn-Kurve">
      <!-- Achsen -->
      <line x1={chart.pad} y1={chart.H - chart.pad} x2={chart.W - chart.pad} y2={chart.H - chart.pad} class="axis" />
      <line x1={chart.pad} y1={chart.pad} x2={chart.pad} y2={chart.H - chart.pad} class="axis" />
      <!-- Kurve -->
      <path d={chart.path} class="curve" />
      <!-- Nächstes Glas -->
      <line x1={chart.next.x} y1={chart.pad} x2={chart.next.x} y2={chart.H - chart.pad} class="nextline" />
      <circle cx={chart.next.x} cy={chart.next.y} r="3.5" class="nextdot" />
      <!-- Aktuelle Position -->
      <circle cx={chart.cur.x} cy={chart.cur.y} r="4" class="curdot" />
    </svg>
    <div class="clabels dim">
      <span>{formatDecimal(GLAS_UNLOCK)}</span>
      <span>Sand →</span>
      <span>{formatDecimal(chart.xRight)}</span>
    </div>
    <div class="clegend dim small">
      <span class="lg cur">● hier: {formatInt(gain)} 🔷</span>
      <span class="lg next">● nächstes: {formatInt(new Decimal(nextK))} 🔷</span>
    </div>
  </div>

  {#if unlocked}
    <button class="btn primary full" on:click={prestige}>
      Zu Glas schmelzen · +{formatInt(gain)} 🔷
    </button>
  {:else}
    <div class="lockrow">
      <span class="dim small">🔒 Glas ab {formatDecimal(GLAS_UNLOCK)} Sand</span>
      <span class="mono small">{formatDecimal($game.sand)} / {formatDecimal(GLAS_UNLOCK)}</span>
    </div>
    <div class="progress"><div class="fill" style="width:{progressPct}%"></div></div>
  {/if}
</div>

<style>
  .small {
    font-size: 12.5px;
    margin: 6px 0;
  }
  .stat {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 9px 12px;
    margin: 8px 0 12px;
    font-size: 14px;
  }
  .full {
    width: 100%;
  }
  .nowrap {
    white-space: nowrap;
  }
  .glasbox {
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-left: 3px solid var(--accent-2);
    border-radius: 10px;
    padding: 10px 13px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .grow {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
  }
  .glabel {
    font-size: 12.5px;
    color: var(--text-dim);
  }
  .gval {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .steprow {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2px;
  }
  .chart {
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 10px 12px 8px;
    margin-bottom: 12px;
  }
  .ctitle {
    display: block;
    margin-bottom: 4px;
  }
  .csvg {
    width: 100%;
    height: auto;
    display: block;
  }
  .axis {
    stroke: var(--border-panel);
    stroke-width: 1;
  }
  .curve {
    fill: none;
    stroke: var(--accent-2);
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  .nextline {
    stroke: var(--accent);
    stroke-width: 1;
    stroke-dasharray: 3 3;
    opacity: 0.7;
  }
  .nextdot {
    fill: #fff;
    stroke: var(--accent);
    stroke-width: 2;
  }
  .curdot {
    fill: var(--accent-2);
    stroke: #fff;
    stroke-width: 1.5;
  }
  .clabels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-top: 2px;
  }
  .clegend {
    display: flex;
    gap: 12px;
    margin-top: 4px;
  }
  .lg.cur {
    color: var(--accent-2);
  }
  .lg.next {
    color: var(--accent);
  }
  .lockrow {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    margin-top: 4px;
  }
  .progress {
    height: 12px;
    background: #efe6d3;
    border: 1px solid var(--border-row);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 6px;
  }
  .fill {
    height: 100%;
    background: var(--progress-fill);
    transition: width 0.2s ease;
  }
</style>
