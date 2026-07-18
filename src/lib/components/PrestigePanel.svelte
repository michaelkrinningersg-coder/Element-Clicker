<script lang="ts">
  import {
    game,
    collapseCloud,
    convertAllAEtoKelvin,
    ignite,
    collapseNebula,
  } from "../game/store";
  import { potentialAE } from "../game/formulas";
  import {
    IGNITION_KELVIN,
    KELVIN_PER_AE,
    GRAVITON_AE_COST,
    GRAVITON_H_COST,
  } from "../game/constants";
  import { formatDecimal, formatInt } from "../game/format";
  import { Decimal } from "../game/decimal";

  $: aeGain = potentialAE($game.h, $game.gravitons);
  $: canCollapse = aeGain.gt(0);
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
</style>
