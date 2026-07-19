<script lang="ts">
  import {
    game,
    collapseCloud,
    convertAllAEtoKelvin,
    ignite,
    collapseNebula,
  } from "../game/store";
  import { potentialAE, aeThreshold, runTimeMultiplier, aeGainMultiplier } from "../game/formulas";
  import { formatDuration } from "../game/format";
  import {
    IGNITION_KELVIN,
    KELVIN_PER_AE,
    GRAVITON_AE_COST,
    GRAVITON_H_COST,
  } from "../game/constants";
  import { formatDecimal, formatInt } from "../game/format";
  import { Decimal, ZERO } from "../game/decimal";

  $: aeGain = potentialAE($game.runEarnedH, $game.gravitons)
    .mul(aeGainMultiplier($game))
    .floor();
  $: canCollapse = aeGain.gt(0);
  $: runBonusPct = (runTimeMultiplier($game).toNumber() - 1) * 100;

  // Fortschritt bis zur nächsten AE-Einheit.
  $: aeTier = aeGain.toNumber();
  $: aePrevThreshold = aeTier >= 1 ? aeThreshold(aeTier, $game.gravitons) : ZERO;
  $: aeNextThreshold = aeThreshold(aeTier + 1, $game.gravitons);
  $: aeNextPct = (() => {
    const span = aeNextThreshold.sub(aePrevThreshold);
    if (span.lte(0)) return 0;
    const p = $game.runEarnedH.sub(aePrevThreshold).div(span).mul(100).toNumber();
    return Math.max(0, Math.min(100, p));
  })();
  $: kelvinPct = Decimal.min($game.kelvin.div(IGNITION_KELVIN), new Decimal(1))
    .mul(100)
    .toNumber();
  $: canIgnite = !$game.ignited && $game.kelvin.gte(IGNITION_KELVIN);
  $: canNebula =
    $game.ignited && $game.ae.gte(GRAVITON_AE_COST) && $game.h.gte(GRAVITON_H_COST);
</script>

<div class="panel">
  <h3>Kollaps &amp; Zündung</h3>

  <!-- Ebene 0: Wolke kollabieren -> AE -->
  <div class="block">
    <div class="head">
      <span>🌀 Wolke kollabieren</span>
      <span class="dim">+{formatInt(aeGain)} 🔥 AE</span>
    </div>
    <p class="dim small">
      Setzt H, Elemente und Generatoren zurück. Jede AE gibt +2 % globale
      H-Produktion (bleibt erhalten).
    </p>
    <div class="runbonus">
      ⏱ Run-Bonus: <b>+{runBonusPct.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %</b>
      Auto &amp; Klick
      <span class="dim">· {formatDuration($game.runSeconds)} · 0,01 %/s · Reset bei Kollaps</span>
    </div>
    <div class="nextae">
      <div class="nextae-row">
        <span class="dim small">Nächste AE bei</span>
        <span class="mono small">{formatDecimal(aeNextThreshold)} H</span>
      </div>
      <div class="mini-progress">
        <div class="mini-fill" style="width:{aeNextPct}%"></div>
      </div>
    </div>
    <button class="btn primary full" disabled={!canCollapse} on:click={collapseCloud}>
      Kollabieren
    </button>
  </div>

  <!-- AE -> Kelvin + Zündung -->
  <div class="block">
    <div class="head">
      <span>🌡️ Zündung</span>
      <span class="dim mono">{formatDecimal($game.kelvin)} / {formatDecimal(IGNITION_KELVIN)} K</span>
    </div>
    <div class="progress">
      <div class="fill" style="width:{kelvinPct}%"></div>
    </div>
    {#if !$game.ignited}
      <div class="btnrow">
        <button class="btn" disabled={$game.ae.lte(0)} on:click={convertAllAEtoKelvin}>
          AE → Kelvin (1 AE = {formatDecimal(KELVIN_PER_AE)} K)
        </button>
        <button class="btn hot" disabled={!canIgnite} on:click={ignite}>🔥 Zünden</button>
      </div>
      <p class="dim small">
        AE in Kelvin umwandeln (einweg – umgewandelte AE geben keinen Boost mehr).
        Bei {formatDecimal(IGNITION_KELVIN)} K kannst du zünden und schaltest die
        Fusion H→He frei.
      </p>
    {:else}
      <p class="good small">✓ Gezündet – Fusion H→He freigeschaltet.</p>
    {/if}
  </div>

  <!-- Ebene 2: Nebel kollabieren -> Gravitonen (nach Zündung) -->
  {#if $game.ignited}
    <div class="block">
      <div class="head">
        <span>🌌 Nebel kollabieren</span>
        <span class="dim">+1 🌀 Graviton</span>
      </div>
      <p class="dim small">
        Kostet {formatInt(GRAVITON_AE_COST)} AE + {formatDecimal(GRAVITON_H_COST)} H.
        Jedes Graviton senkt die AE-Schwellen dauerhaft (×0,95).
      </p>
      <button class="btn full" disabled={!canNebula} on:click={collapseNebula}>
        Nebel kollabieren
      </button>
    </div>
  {/if}
</div>

<style>
  .block {
    border-top: 1px solid var(--border);
    padding-top: 12px;
    margin-top: 12px;
  }
  .block:first-of-type {
    border-top: none;
    padding-top: 0;
    margin-top: 8px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .small {
    font-size: 0.8rem;
    margin: 6px 0;
  }
  .full {
    width: 100%;
  }
  .btnrow {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .btnrow .btn {
    flex: 1;
  }
  .progress {
    height: 14px;
    background: #0d1326;
    border: 1px solid var(--border);
    border-radius: 999px;
    overflow: hidden;
    margin: 6px 0;
  }
  .fill {
    height: 100%;
    background: linear-gradient(90deg, var(--hot), var(--gold));
    transition: width 0.2s ease;
  }
  .good {
    color: var(--good);
  }
  .runbonus {
    font-size: 12px;
    color: var(--text-dim);
    margin: 6px 0;
  }
  .runbonus b {
    color: var(--accent);
  }
  .nextae {
    margin: 8px 0;
  }
  .nextae-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .mini-progress {
    height: 6px;
    background: #0d1326;
    border: 1px solid var(--border);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 5px;
  }
  .mini-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--hot), var(--accent-2));
    transition: width 0.2s ease;
  }
</style>
