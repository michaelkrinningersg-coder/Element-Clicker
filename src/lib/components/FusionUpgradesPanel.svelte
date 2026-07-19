<script lang="ts">
  import { game, buyFusionUpgrade } from "../game/store";
  import { FUSION_UPGRADES } from "../game/fusionUpgrades";
  import { formatDecimal } from "../game/format";
</script>

<div class="panel">
  <h3>Fusions-Physik</h3>
  <div class="list">
    {#each FUSION_UPGRADES as u (u.id)}
      {@const owned = $game.fusionUpgrades.includes(u.id)}
      {@const unlocked = $game.lifetimeH.gte(u.unlockH)}
      {@const affordable = $game.h.gte(u.cost)}
      <button
        class="fu"
        class:owned
        disabled={owned || !unlocked || !affordable}
        on:click={() => buyFusionUpgrade(u.id)}
      >
        <span class="info">
          <span class="name">{u.name}</span>
          <span class="desc dim">{u.description}</span>
        </span>
        <span class="right">
          {#if owned}
            <span class="tag">✓ besitzt</span>
          {:else if !unlocked}
            <span class="lock">🔒 ab {formatDecimal(u.unlockH)} H</span>
          {:else}
            <span class="cost mono" class:ok={affordable}>{formatDecimal(u.cost)} H</span>
          {/if}
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .fu {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    text-align: left;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 10px 12px;
    color: var(--text);
  }
  .fu:hover:not(:disabled) {
    filter: brightness(1.15);
  }
  .fu:disabled {
    cursor: not-allowed;
  }
  .fu.owned {
    opacity: 0.8;
    border-color: var(--good);
  }
  .fu:disabled:not(.owned) {
    opacity: 0.55;
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
  .desc {
    font-size: 12px;
  }
  .cost {
    font-size: 13px;
    color: var(--text-locked);
    white-space: nowrap;
  }
  .cost.ok {
    color: var(--good);
  }
  .tag {
    font-size: 12px;
    color: var(--good);
    white-space: nowrap;
  }
  .lock {
    font-size: 12px;
    color: var(--text-locked);
    white-space: nowrap;
  }
</style>
