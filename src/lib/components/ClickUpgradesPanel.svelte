<script lang="ts">
  import { game, buyClickUpgrade } from "../game/store";
  import { CLICK_UPGRADES } from "../game/clickUpgrades";
  import { clickUpgradeMultiplier } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  $: totalMult = clickUpgradeMultiplier($game);

  function fmtMult(n: number): string {
    return n.toLocaleString("de-DE");
  }
</script>

<div class="panel">
  <div class="head">
    <h3>Klick-Upgrades</h3>
    <span class="dim total">Klick ×{formatDecimal(totalMult)}</span>
  </div>
  <div class="list">
    {#each CLICK_UPGRADES as u (u.id)}
      {@const owned = $game.clickUpgrades.includes(u.id)}
      {@const affordable = $game.h.gte(u.cost)}
      <button
        class="cu"
        class:owned
        disabled={owned || !affordable}
        on:click={() => buyClickUpgrade(u.id)}
      >
        <span class="icon">{u.icon}</span>
        <span class="info">
          <span class="name">{u.name}</span>
          <span class="eff dim">×{fmtMult(u.clickMult)} Klick-Power</span>
        </span>
        <span class="right">
          {#if owned}
            <span class="tag">✓ besitzt</span>
          {:else}
            <span class="cost mono" class:ok={affordable}>{formatDecimal(u.cost)} H</span>
          {/if}
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }
  .head h3 {
    margin: 0 0 12px;
  }
  .total {
    font-size: 13px;
    color: var(--accent);
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cu {
    display: grid;
    grid-template-columns: 30px 1fr auto;
    align-items: center;
    gap: 10px;
    text-align: left;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 9px 12px;
    color: var(--text);
  }
  .cu:hover:not(:disabled) {
    filter: brightness(1.15);
  }
  .cu:disabled {
    cursor: not-allowed;
  }
  .cu.owned {
    opacity: 0.75;
    border-color: var(--good);
  }
  .cu:disabled:not(.owned) {
    opacity: 0.5;
  }
  .icon {
    font-size: 18px;
  }
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .name {
    font-size: 14px;
    font-weight: 600;
  }
  .eff {
    font-size: 12px;
  }
  .cost {
    font-size: 13px;
    color: var(--text-locked);
  }
  .cost.ok {
    color: var(--good);
  }
  .tag {
    font-size: 12px;
    color: var(--good);
  }
</style>
