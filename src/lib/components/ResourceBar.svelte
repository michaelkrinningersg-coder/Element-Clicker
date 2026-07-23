<script lang="ts">
  import { game, hardReset } from "../game/store";
  import { totalProductionPerSec } from "../game/formulas";
  import { formatDecimal, formatInt } from "../game/format";
  import { EVENT_NAME, EVENT_PROD_MULT } from "../game/constants";

  $: production = totalProductionPerSec($game);

  function resetConfirm() {
    if (confirm("Wirklich komplett zurücksetzen? Aller Fortschritt geht verloren.")) {
      hardReset();
    }
  }
</script>

<div class="bar">
  <div class="line1">
    <div class="title">🏜️ Sandkörner</div>
    <div class="cluster">
      <span class="sand mono">{formatDecimal($game.sand)}</span>
      <span class="unit">Sandkörner</span>
      <span class="rate mono">· +{formatDecimal(production)}/s</span>
    </div>
  </div>

  <div class="line2">
    {#if $game.glas.gt(0)}
      <span class="chip glas">🔷 Glas {formatInt($game.glas)}</span>
    {/if}
    {#if $game.eventRemaining > 0}
      <span class="chip event" title="{EVENT_NAME}: ×{EVENT_PROD_MULT} Produktion">
        ✨ {EVENT_NAME} · ×{EVENT_PROD_MULT} · {Math.ceil($game.eventRemaining)} s
      </span>
    {/if}
    <button class="reset" on:click={resetConfirm}>Reset</button>
  </div>
</div>

<style>
  .bar {
    background: var(--glass-bar);
    border: 1px solid var(--border-panel);
    border-radius: 16px;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(150, 120, 60, 0.07);
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
  .sand {
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    color: var(--gold);
  }
  .unit {
    font-size: 14px;
    color: var(--text-dim);
  }
  .rate {
    font-size: 14px;
    color: var(--prod);
  }
  .line2 {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 12px;
    border-top: 1px solid var(--border-row);
  }
  .chip {
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 13px;
    white-space: nowrap;
  }
  .chip.glas {
    background: var(--chip-grav-bg);
    border: 1px solid var(--chip-grav-bd);
    color: #2b7f8b;
  }
  .chip.event {
    background: linear-gradient(180deg, #fff2c8, #ffe39a);
    border: 1px solid #e8bf5e;
    color: #8a5a12;
    font-weight: 700;
    animation: eventpulse 1.2s ease-in-out infinite;
  }
  @keyframes eventpulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(224, 168, 56, 0.5);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(224, 168, 56, 0);
    }
  }
  .reset {
    margin-left: auto;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    color: var(--text-dim);
    border-radius: 8px;
    padding: 6px 13px;
    font-size: 13px;
  }
  .reset:hover {
    filter: brightness(0.97);
  }
</style>
