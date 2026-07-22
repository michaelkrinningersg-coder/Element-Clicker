<script lang="ts">
  import { game, prestige } from "../game/store";
  import { glasGain, glasMultiplier } from "../game/formulas";
  import { GLAS_UNLOCK, GLAS_BONUS_PER } from "../game/constants";
  import { formatDecimal, formatInt } from "../game/format";
  import { Decimal } from "../game/decimal";

  $: gain = glasGain($game);
  $: unlocked = $game.sand.gte(GLAS_UNLOCK);
  $: progressPct = Decimal.min($game.sand.div(GLAS_UNLOCK), new Decimal(1)).mul(100).toNumber();
  $: bonusPct = (glasMultiplier($game).toNumber() - 1) * 100;
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
