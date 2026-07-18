<script lang="ts">
  import { game, hardReset } from "../game/store";
  import { totalProductionPerSec } from "../game/formulas";
  import { formatDecimal, formatMol, formatInt } from "../game/format";

  $: production = totalProductionPerSec($game);

  function resetConfirm() {
    if (confirm("Wirklich komplett zurücksetzen? Aller Fortschritt geht verloren.")) {
      hardReset();
    }
  }
</script>

<div class="bar">
  <!-- Zeile 1: Titel + große H-Zahl -->
  <div class="line1">
    <div class="title">⚛ Element Clicker</div>
    <div class="cluster">
      <span class="h mono">{formatDecimal($game.h)}</span>
      <span class="unit">Atome</span>
      <span class="mol mono">· {formatMol($game.h)}</span>
      <span class="rate mono">· +{formatDecimal(production)}/s</span>
    </div>
  </div>

  <!-- Zeile 2: Ressourcen-Chips + Teilchen + Reset -->
  <div class="line2">
    <span class="chip ae">🔥 AE {formatInt($game.ae)}</span>
    <span class="chip k">🌡 {formatDecimal($game.kelvin)} K</span>
    {#if $game.ignited}
      <span class="chip grav">🌀 Grav {formatInt($game.gravitons)}</span>
    {/if}

    <span class="divider"></span>

    <span class="chip p">⚡ p⁺ {formatInt($game.particles.protons)}</span>
    <span class="chip p">🔵 e⁻ {formatInt($game.particles.electrons)}</span>
    <span class="chip p">⚪ n⁰ {formatInt($game.particles.neutrons)}</span>
    <span class="chip p">✨ e⁺ {formatInt($game.particles.positrons)}</span>

    <button class="reset" on:click={resetConfirm}>Reset</button>
  </div>
</div>

<style>
  .bar {
    background: var(--glass-bar);
    border: 1px solid var(--border-row);
    border-radius: 16px;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }
  .line1 {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.3px;
    white-space: nowrap;
  }
  .cluster {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-left: 24px;
    border-left: 1px solid var(--border-row);
    flex-wrap: wrap;
  }
  .h {
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
  }
  .unit {
    font-size: 14px;
    color: var(--text-dim);
  }
  .mol {
    font-size: 14px;
    color: var(--gold);
  }
  .rate {
    font-size: 14px;
    color: var(--prod);
  }
  .line2 {
    display: flex;
    gap: 7px;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px solid var(--border-row);
  }
  .chip {
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 12px;
    white-space: nowrap;
  }
  .chip.ae {
    background: var(--chip-ae-bg);
    border: 1px solid var(--chip-ae-bd);
  }
  .chip.k {
    background: var(--chip-k-bg);
    border: 1px solid var(--chip-k-bd);
  }
  .chip.grav {
    background: var(--chip-grav-bg);
    border: 1px solid var(--chip-grav-bd);
  }
  .chip.p {
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    color: var(--text-particle);
    padding: 5px 11px;
  }
  .divider {
    width: 1px;
    height: 20px;
    background: var(--border-row);
    margin: 0 2px;
  }
  .reset {
    margin-left: auto;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    color: var(--text-dim);
    border-radius: 8px;
    padding: 6px 13px;
    font-size: 13px;
  }
  .reset:hover {
    filter: brightness(1.25);
  }
</style>
