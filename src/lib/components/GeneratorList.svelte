<script lang="ts">
  import { game, buyGenerators, buyMaxAll } from "../game/store";
  import { GENERATORS } from "../game/generators";
  import {
    effectiveGeneratorProduction,
    totalProductionPerSec,
    generatorOutputMultiplier,
    aeMultiplier,
    perkGlobalMultiplier,
    milestoneProductionMultiplier,
    nextPerk,
    totalGeneratorsOwned,
    effectiveOutputBonusPerGenerator,
    generatorCostMultiplier,
    molekulwolkeElementBonus,
    bulkCost,
    maxAffordable,
  } from "../game/formulas";
  import { GENERATOR_MILESTONES } from "../game/milestones";
  import { formatDecimal } from "../game/format";
  import { ZERO } from "../game/decimal";

  $: total = totalProductionPerSec($game);
  $: ownedTotal = totalGeneratorsOwned($game);
  $: costMult = generatorCostMultiplier($game);

  const fmt = (n: number) => n.toLocaleString("de-DE");

  // Kauf-Menge
  type BuyMode = number | "max" | "next";
  const BUY_MODES: BuyMode[] = [1, 10, 25, 50, 100, "max", "next"];
  let buyMode: BuyMode = 1;
  const modeLabel = (m: BuyMode) => (m === "max" ? "Max" : m === "next" ? "Next" : String(m));

  // Ziel-Stückzahl je Modus (vor Leistbarkeit)
  function targetCount(genId: string, owned: number): number {
    if (buyMode === "max") return 1_000_000;
    if (buyMode === "next") {
      const np = nextPerk($game, genId);
      return np ? Math.max(1, np.threshold - owned) : 1_000_000;
    }
    return buyMode;
  }

  // Aufgeklappte Perk-Detailzeile (Akkordeon).
  let openId: string | null = null;
  function toggle(id: string) {
    openId = openId === id ? null : id;
  }
</script>

<div class="genpanel">
  <div class="phead">
    <h3>Generatoren</h3>
    <div class="buymodes">
      <span class="ml">Kaufen:</span>
      {#each BUY_MODES as m (m)}
        <button class="modebtn" class:active={buyMode === m} on:click={() => (buyMode = m)}>
          {modeLabel(m)}
        </button>
      {/each}
      <button class="modebtn maxall" on:click={buyMaxAll}>⚡ Max alle</button>
    </div>
  </div>
  <div class="rowline">
    <div class="thead">
      <span>Generator</span>
      <span class="r">Anzahl</span>
      <span class="r">Produktion</span>
      <span class="r">Nächste Kosten</span>
      <span class="r">Bonus (Basis)</span>
      <span class="r">Bonus (+Boni)</span>
      <span class="r">Anteil h/s</span>
    </div>
    <div class="caret-spacer"></div>
  </div>

  {#each GENERATORS as def (def.id)}
    {@const gs = $game.generators[def.id]}
    {@const tgt = targetCount(def.id, gs.owned)}
    {@const buyCount = maxAffordable(gs.nextCost, gs.owned, $game.h.div(costMult), tgt, def.costGrowth)}
    {@const buyCostTotal = bulkCost(gs.nextCost, gs.owned, buyCount, def.costGrowth).mul(costMult)}
    {@const affordable = buyCount > 0}
    {@const prod = effectiveGeneratorProduction($game, def.id)}
    {@const nextBonus = def.baseProd
      .mul(generatorOutputMultiplier($game, def.id))
      .mul(aeMultiplier($game))
      .mul(perkGlobalMultiplier($game))
      .mul(milestoneProductionMultiplier($game))}
    {@const share = total.gt(0) && prod.gt(0) ? prod.div(total).mul(100) : ZERO}
    {@const np = nextPerk($game, def.id)}
    {@const locked = gs.owned === 0 && !affordable}
    {@const open = openId === def.id}
    <div class="genitem">
      <div class="rowline">
        <button
          class="trow"
          class:locked
          disabled={!affordable}
          title={np ? `Nächster Perk bei ${np.threshold} Stk.: ${np.label}` : "Alle Perks erreicht"}
          on:click={() => buyGenerators(def.id, buyCount)}
        >
          <span class="gen">
            <span class="icon">{def.icon}</span>
            <span class="name">{def.name}</span>
          </span>
          <span class="r count">×{gs.owned}</span>
          <span class="r prod">{gs.owned > 0 ? `${formatDecimal(prod)} /s` : "—"}</span>
          <span class="r cost" class:ok={affordable}>
            {#if buyCount > 1}×{buyCount} · {/if}{formatDecimal(affordable ? buyCostTotal : gs.nextCost.mul(costMult))} H
          </span>
          <span class="r basebonus">+{formatDecimal(def.baseProd)} /s</span>
          <span class="r bonus">+{formatDecimal(nextBonus)} /s</span>
          <span class="r share">{share.gt(0) ? `${formatDecimal(share, 1)} %` : "—"}</span>
        </button>
        <button
          class="caret"
          class:open
          aria-label="Perks anzeigen"
          aria-expanded={open}
          on:click={() => toggle(def.id)}
        >
          ▸
        </button>
      </div>

      {#if open}
        <div class="perkdetail">
          {#if def.clickBonusPerUnit}
            <div class="clickbonus">
              ⚡ Je Einheit: +{fmt(def.clickBonusPerUnit * 100)} % Klick-Einkommen
              <span class="dim">(aktuell +{fmt(def.clickBonusPerUnit * 100 * gs.owned)} %)</span>
            </div>
          {/if}
          {#if def.outputBonusPerGenerator || def.outputBonusPerGeneratorBoost}
            {@const rate = effectiveOutputBonusPerGenerator($game, def)}
            <div class="clickbonus">
              🌐 +{fmt(rate * 100)} % Output je Generator
              <span class="dim">(aktuell +{fmt(rate * 100 * ownedTotal)} %)</span>
            </div>
          {/if}
          {#if def.id === "g1"}
            <div class="clickbonus">
              🧪 Element-Bonus: ×{formatDecimal(molekulwolkeElementBonus($game))}
              <span class="dim">(je Atom: Massenzahl × 100 %)</span>
            </div>
          {/if}
          {#if def.perks.length === 0}
            <p class="dim small">Perks für diesen Generator folgen noch.</p>
          {:else}
            {#each def.perks as perk (perk.threshold)}
              {@const reached = gs.owned >= perk.threshold}
              <div class="perk" class:reached>
                <span class="pt mono">{perk.threshold} Stk.</span>
                <span class="pl">{perk.label}</span>
                <span class="ps">{reached ? "✓" : "🔒"}</span>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {/each}

  <div class="milestones">
    {#each GENERATOR_MILESTONES as ms (ms.id)}
      {@const done = ownedTotal >= ms.threshold}
      <div class="ms" class:done>
        <span class="mslabel">{done ? "✓" : "🔒"} {ms.label}</span>
        <span class="mseff">Auto ×{fmt(ms.productionMult)} · Klick ×{fmt(ms.clickMult)}</span>
        <span class="msnum mono">{ownedTotal}/{ms.threshold}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .genpanel {
    background: var(--glass);
    border: 1px solid var(--border-panel);
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 20px;
  }
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
    margin-right: 2px;
  }
  .modebtn {
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 12px;
    color: var(--text-dim);
  }
  .modebtn:hover {
    filter: brightness(1.2);
  }
  .modebtn.active {
    background: var(--btn-primary);
    border-color: var(--accent);
    color: var(--text);
  }
  .modebtn.maxall {
    border-color: var(--good);
    color: var(--good);
  }
  .rowline {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }
  .thead {
    flex: 1;
    display: grid;
    grid-template-columns: 2.1fr 0.7fr 1fr 1.1fr 1fr 1fr 0.9fr;
    gap: 12px;
    align-items: center;
    padding: 0 14px 8px;
    border-bottom: 1px solid var(--border-panel);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
    margin-bottom: 8px;
  }
  .caret-spacer {
    width: 36px;
    flex: 0 0 36px;
  }
  .r {
    text-align: right;
  }
  .genitem {
    margin-bottom: 8px;
  }
  .trow {
    flex: 1;
    display: grid;
    grid-template-columns: 2.1fr 0.7fr 1fr 1.1fr 1fr 1fr 0.9fr;
    gap: 12px;
    align-items: center;
    text-align: left;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 11px 14px;
    font-variant-numeric: tabular-nums;
    color: var(--text);
    min-width: 0;
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
  .caret {
    flex: 0 0 36px;
    width: 36px;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    color: var(--text-dim);
    font-size: 12px;
    transition: transform 0.12s ease, filter 0.1s ease;
  }
  .caret:hover {
    filter: brightness(1.25);
  }
  .caret.open {
    transform: rotate(90deg);
    color: var(--accent);
    border-color: var(--accent);
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
  .basebonus,
  .share {
    color: var(--text-dim);
  }
  .bonus {
    color: var(--prod);
  }

  /* Perk-Detail */
  .perkdetail {
    margin: 6px 44px 2px 14px;
    padding: 10px 14px;
    background: #0d1326;
    border: 1px solid var(--border-panel);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .perk {
    display: grid;
    grid-template-columns: 72px 1fr auto;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    opacity: 0.5;
  }
  .perk.reached {
    opacity: 1;
  }
  .pt {
    color: var(--text-dim);
  }
  .perk.reached .pt {
    color: var(--gold);
  }
  .ps {
    color: var(--text-dim);
  }
  .perk.reached .ps {
    color: var(--good);
  }
  .small {
    font-size: 13px;
    margin: 2px 0;
  }
  .clickbonus {
    font-size: 13px;
    color: var(--gold);
    padding-bottom: 6px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--border-panel);
  }

  .milestones {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-panel);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ms {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 13px;
    opacity: 0.6;
  }
  .ms.done {
    opacity: 1;
    border-color: var(--good);
  }
  .mslabel {
    font-weight: 600;
  }
  .ms.done .mslabel {
    color: var(--good);
  }
  .mseff {
    color: var(--accent-2);
  }
  .msnum {
    margin-left: auto;
    color: var(--text-dim);
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
