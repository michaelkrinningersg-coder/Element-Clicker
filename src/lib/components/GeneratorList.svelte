<script lang="ts">
  import { game, buyGenerator } from "../game/store";
  import { GENERATORS } from "../game/generators";
  import {
    effectiveGeneratorProduction,
    totalProductionPerSec,
    generatorOutputMultiplier,
    aeMultiplier,
    perkGlobalMultiplier,
    nextPerk,
  } from "../game/formulas";
  import { formatDecimal } from "../game/format";
  import { ZERO } from "../game/decimal";

  $: total = totalProductionPerSec($game);
</script>

<div class="genpanel">
  <h3>Generatoren</h3>
  <div class="thead">
    <span>Generator</span>
    <span class="r">Anzahl</span>
    <span class="r">Produktion</span>
    <span class="r">Nächste Kosten</span>
    <span class="r">Nächster Bonus</span>
    <span class="r">Anteil h/s</span>
  </div>

  {#each GENERATORS as def (def.id)}
    {@const gs = $game.generators[def.id]}
    {@const affordable = $game.h.gte(gs.nextCost)}
    {@const prod = effectiveGeneratorProduction($game, def.id)}
    {@const nextBonus = def.baseProd
      .mul(generatorOutputMultiplier($game, def.id))
      .mul(aeMultiplier($game))
      .mul(perkGlobalMultiplier($game))}
    {@const share = total.gt(0) && prod.gt(0) ? prod.div(total).mul(100) : ZERO}
    {@const np = nextPerk($game, def.id)}
    {@const locked = gs.owned === 0 && !affordable}
    <button
      class="trow"
      class:locked
      disabled={!affordable}
      title={np ? `Nächster Perk bei ${np.threshold} Stk.: ${np.label}` : "Alle Perks erreicht"}
      on:click={() => buyGenerator(def.id)}
    >
      <span class="gen">
        <span class="icon">{def.icon}</span>
        <span class="name">{def.name}</span>
      </span>
      <span class="r count">×{gs.owned}</span>
      <span class="r prod">{gs.owned > 0 ? `${formatDecimal(prod)} /s` : "—"}</span>
      <span class="r cost" class:ok={affordable}>{formatDecimal(gs.nextCost)} H</span>
      <span class="r bonus">+{formatDecimal(nextBonus)} /s</span>
      <span class="r share">{share.gt(0) ? `${formatDecimal(share, 1)} %` : "—"}</span>
    </button>
  {/each}
</div>

<style>
  .genpanel {
    background: var(--glass);
    border: 1px solid var(--border-panel);
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 20px;
  }
  .thead,
  .trow {
    display: grid;
    grid-template-columns: 2.4fr 0.8fr 1fr 1.1fr 1.2fr 0.9fr;
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
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 11px 14px;
    margin-bottom: 8px;
    font-variant-numeric: tabular-nums;
    color: var(--text);
  }
  .trow:hover:not(:disabled) {
    filter: brightness(1.15);
  }
  .trow.locked {
    background: var(--glass-dim);
    border-color: var(--border-panel);
    opacity: 0.5;
  }
  .trow:disabled {
    cursor: not-allowed;
  }
  .gen {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .icon {
    font-size: 20px;
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
  .bonus,
  .share {
    color: var(--text-dim);
  }
  @media (max-width: 760px) {
    .thead,
    .trow {
      grid-template-columns: 2fr 0.7fr 1fr 1.1fr;
    }
    .thead span:nth-child(5),
    .thead span:nth-child(6),
    .trow .bonus,
    .trow .share {
      display: none;
    }
  }
</style>
