<script lang="ts">
  import { game, buyGenerator } from "../game/store";
  import { GENERATORS } from "../game/generators";
  import { generatorProduction, globalMultiplier } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  $: gmult = globalMultiplier($game);
</script>

<div class="panel">
  <h3>Generatoren</h3>
  <div class="list">
    {#each GENERATORS as def (def.id)}
      {@const gs = $game.generators[def.id]}
      {@const affordable = $game.h.gte(gs.nextCost)}
      {@const prod = generatorProduction(def.id, gs.owned).mul(gmult)}
      <button class="row" disabled={!affordable} on:click={() => buyGenerator(def.id)}>
        <span class="icon">{def.icon}</span>
        <span class="info">
          <span class="name">{def.name}</span>
          <span class="sub dim mono">
            {#if gs.owned > 0}{formatDecimal(prod)} /s{:else}—{/if}
          </span>
        </span>
        <span class="right">
          <span class="count mono">{gs.owned}</span>
          <span class="cost mono" class:ok={affordable}>{formatDecimal(gs.nextCost)} H</span>
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
  .row {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    align-items: center;
    gap: 10px;
    text-align: left;
    background: var(--bg-panel-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
  }
  .row:hover:not(:disabled) {
    filter: brightness(1.15);
  }
  .row:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .icon {
    font-size: 1.5rem;
  }
  .info {
    display: flex;
    flex-direction: column;
  }
  .name {
    font-weight: 600;
  }
  .sub {
    font-size: 0.82rem;
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .count {
    font-size: 1.1rem;
    font-weight: 700;
  }
  .cost {
    font-size: 0.82rem;
    color: var(--text-dim);
  }
  .cost.ok {
    color: var(--good);
  }
</style>
