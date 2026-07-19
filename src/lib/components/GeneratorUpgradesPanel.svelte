<script lang="ts">
  import { game, buyGeneratorUpgrade } from "../game/store";
  import { GENERATOR_UPGRADES } from "../game/generatorUpgrades";
  import { GENERATOR_BY_ID } from "../game/generators";
  import { effectiveUpgradeFactor } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  const fmt = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 2 });
</script>

<div class="panel">
  <h3>Generator-Upgrades</h3>
  <div class="list">
    {#each GENERATOR_UPGRADES as u (u.id)}
      {@const owned = $game.generatorUpgrades.includes(u.id)}
      {@const unlockGen = GENERATOR_BY_ID[u.unlock.generatorId]}
      {@const unlocked = $game.generators[u.unlock.generatorId].owned >= u.unlock.amount}
      {@const affordable = $game.h.gte(u.cost)}
      {@const perCount = $game.generators[u.effect.perGeneratorId].owned}
      <button
        class="gu"
        class:owned
        disabled={owned || !unlocked || !affordable}
        on:click={() => buyGeneratorUpgrade(u.id)}
      >
        <span class="info">
          <span class="name">{u.name}</span>
          <span class="desc dim">{u.description}</span>
          {#if owned && u.effect.kind === "outputPerGenerator"}
            <span class="curr">aktuell +{fmt(effectiveUpgradeFactor($game, u) * 100 * perCount)} %</span>
          {:else if owned}
            <span class="curr">aktuell +{fmt(u.effect.factorPerUnit * 100 * perCount)} Pp.</span>
          {/if}
        </span>
        <span class="right">
          {#if owned}
            <span class="tag">✓ besitzt</span>
          {:else if !unlocked}
            <span class="lock">🔒 ab {u.unlock.amount} {unlockGen.name}</span>
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
  .gu {
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
  .gu:hover:not(:disabled) {
    filter: brightness(1.15);
  }
  .gu:disabled {
    cursor: not-allowed;
  }
  .gu.owned {
    opacity: 0.8;
    border-color: var(--good);
  }
  .gu:disabled:not(.owned) {
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
  .curr {
    font-size: 12px;
    color: var(--gold);
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
