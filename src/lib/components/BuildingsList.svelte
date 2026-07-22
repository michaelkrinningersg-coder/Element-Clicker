<script lang="ts">
  import { game, buyBuildings } from "../game/store";
  import { BUILDINGS } from "../game/buildings";
  import { buildingProduction, bulkCost, maxAffordable } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  type BuyMode = number | "max";
  const BUY_MODES: BuyMode[] = [1, 10, 100, "max"];
  let buyMode: BuyMode = 1;
  const modeLabel = (m: BuyMode) => (m === "max" ? "Max" : String(m));
  const targetCount = (m: BuyMode) => (m === "max" ? 1_000_000 : m);

  // Effekt-Text je Gebäude
  function effectText(id: string, g: typeof $game): string {
    const def = BUILDINGS.find((b) => b.id === id)!;
    if (def.kind === "click") {
      return `+${def.clickPerUnit} Sand / Klick`;
    }
    const prod = buildingProduction(g, id);
    return g.buildings[id].owned > 0 ? `${formatDecimal(prod)} /s` : `+${def.prodPerUnit} /s`;
  }
</script>

<div class="panel">
  <div class="phead">
    <h3>Gebäude</h3>
    <div class="buymodes">
      <span class="ml">Kaufen:</span>
      {#each BUY_MODES as m (m)}
        <button class="modebtn" class:active={buyMode === m} on:click={() => (buyMode = m)}>
          {modeLabel(m)}
        </button>
      {/each}
    </div>
  </div>

  <div class="list">
    {#each BUILDINGS as def (def.id)}
      {@const bs = $game.buildings[def.id]}
      {@const buyCount = maxAffordable(bs.nextCost, bs.owned, $game.sand, targetCount(buyMode))}
      {@const buyCostTotal = bulkCost(bs.nextCost, bs.owned, buyCount)}
      {@const affordable = buyCount > 0}
      <button
        class="row"
        disabled={!affordable}
        on:click={() => buyBuildings(def.id, buyCount)}
      >
        <span class="icon">{def.icon}</span>
        <span class="info">
          <span class="name">{def.name}</span>
          <span class="sub dim">{effectText(def.id, $game)}</span>
        </span>
        <span class="count mono">×{bs.owned}</span>
        <span class="cost mono" class:ok={affordable}>
          {#if buyCount > 1}×{buyCount} · {/if}{formatDecimal(affordable ? buyCostTotal : bs.nextCost)} Sand
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .phead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .phead h3 {
    margin: 0;
  }
  .buymodes {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }
  .ml {
    font-size: 12px;
    color: var(--text-dim);
  }
  .modebtn {
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 12px;
    color: var(--text-dim);
  }
  .modebtn:hover {
    filter: brightness(0.97);
  }
  .modebtn.active {
    background: var(--btn-primary);
    border-color: #d3a53f;
    color: #4a3a16;
    font-weight: 600;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .row {
    display: grid;
    grid-template-columns: 40px 1fr auto auto;
    align-items: center;
    gap: 12px;
    text-align: left;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 11px 14px;
    font-variant-numeric: tabular-nums;
    color: var(--text);
  }
  .row:hover:not(:disabled) {
    filter: brightness(0.98);
  }
  .row:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .icon {
    font-size: 24px;
  }
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .name {
    font-size: 15px;
    font-weight: 600;
  }
  .sub {
    font-size: 12px;
  }
  .count {
    font-size: 1.1rem;
    font-weight: 700;
  }
  .cost {
    font-size: 13px;
    color: var(--text-locked);
    text-align: right;
    white-space: nowrap;
  }
  .cost.ok {
    color: var(--good);
  }
</style>
