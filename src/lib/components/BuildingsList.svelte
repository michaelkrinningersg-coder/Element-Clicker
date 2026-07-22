<script lang="ts">
  import { game, buyBuildings } from "../game/store";
  import { BUILDINGS, BUILDING_BY_ID } from "../game/buildings";
  import {
    buildingProduction,
    totalProductionPerSec,
    glasMultiplier,
    bulkCost,
    maxAffordable,
  } from "../game/formulas";
  import { formatDecimal } from "../game/format";
  import { Decimal, ZERO } from "../game/decimal";

  type BuyMode = number | "max";
  const BUY_MODES: BuyMode[] = [1, 10, 100, "max"];
  let buyMode: BuyMode = 1;
  const modeLabel = (m: BuyMode) => (m === "max" ? "Max" : String(m));
  const targetCount = (m: BuyMode) => (m === "max" ? 1_000_000 : m);

  $: total = totalProductionPerSec($game);
  $: glasMult = glasMultiplier($game);

  // Grundwert je Einheit (Basis) als Decimal
  function baseUnit(id: string): Decimal {
    const def = BUILDING_BY_ID[id];
    if (def.kind === "generator" && def.prodPerUnit) return def.prodPerUnit;
    return new Decimal(def.clickPerUnit ?? 0);
  }
  const unitSuffix = (id: string) =>
    BUILDING_BY_ID[id].kind === "generator" ? "/s" : "/Klick";
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

  <div class="thead">
    <span>Gebäude</span>
    <span class="r">Anzahl</span>
    <span class="r">Produktion</span>
    <span class="r">Nächste Kosten</span>
    <span class="r">Bonus (Basis)</span>
    <span class="r">Bonus (+Boni)</span>
    <span class="r">Anteil /s</span>
  </div>

  {#each BUILDINGS as def (def.id)}
    {@const bs = $game.buildings[def.id]}
    {@const isGen = def.kind === "generator"}
    {@const buyCount = maxAffordable(bs.nextCost, bs.owned, $game.sand, targetCount(buyMode))}
    {@const buyCostTotal = bulkCost(bs.nextCost, bs.owned, buyCount)}
    {@const affordable = buyCount > 0}
    {@const prod = isGen ? buildingProduction($game, def.id) : ZERO}
    {@const base = baseUnit(def.id)}
    {@const boni = base.mul(glasMult)}
    {@const share = isGen && total.gt(0) && prod.gt(0) ? prod.div(total).mul(100) : ZERO}
    <button
      class="trow"
      disabled={!affordable}
      on:click={() => buyBuildings(def.id, buyCount)}
    >
      <span class="gen">
        <span class="icon">{def.icon}</span>
        <span class="name">{def.name}</span>
      </span>
      <span class="r count">×{bs.owned}</span>
      <span class="r prod">{isGen ? (bs.owned > 0 ? `${formatDecimal(prod)} /s` : "—") : "—"}</span>
      <span class="r cost" class:ok={affordable}>
        {#if buyCount > 1}×{buyCount} · {/if}{formatDecimal(affordable ? buyCostTotal : bs.nextCost)}
      </span>
      <span class="r basebonus">+{formatDecimal(base)} {unitSuffix(def.id)}</span>
      <span class="r bonus">+{formatDecimal(boni)} {unitSuffix(def.id)}</span>
      <span class="r share">{isGen && share.gt(0) ? `${formatDecimal(share, 1)} %` : "—"}</span>
    </button>
  {/each}
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
  .thead,
  .trow {
    display: grid;
    grid-template-columns: 2.1fr 0.7fr 1fr 1.1fr 1fr 1fr 0.9fr;
    gap: 12px;
    align-items: center;
  }
  .thead {
    padding: 0 14px 8px;
    border-bottom: 1px solid var(--border-panel);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
    margin-bottom: 8px;
  }
  .r {
    text-align: right;
  }
  .trow {
    width: 100%;
    text-align: left;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 11px 14px;
    margin-bottom: 8px;
    font-variant-numeric: tabular-nums;
    color: var(--text);
  }
  .trow:hover:not(:disabled) {
    filter: brightness(0.98);
  }
  .trow:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .gen {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .icon {
    font-size: 22px;
  }
  .name {
    font-size: 15px;
    font-weight: 600;
  }
  .count {
    font-weight: 700;
  }
  .prod {
    color: var(--prod);
  }
  .cost {
    color: var(--text-locked);
  }
  .cost.ok {
    color: var(--good);
  }
  .basebonus,
  .share {
    color: var(--text-dim);
  }
  .bonus {
    color: var(--prod);
  }
  @media (max-width: 760px) {
    .thead,
    .trow {
      grid-template-columns: 2fr 0.7fr 1fr 1.1fr;
    }
    .thead span:nth-child(5),
    .thead span:nth-child(6),
    .thead span:nth-child(7),
    .trow .basebonus,
    .trow .bonus,
    .trow .share {
      display: none;
    }
  }
</style>
