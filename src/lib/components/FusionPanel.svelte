<script lang="ts">
  import { game, fuse } from "../game/store";
  import { TWO_MOL_H } from "../game/constants";
  import { FUSION_ORDER, FUSION_RECIPES } from "../game/elements";
  import { formatDecimal, formatInt, formatMol } from "../game/format";
  import { Decimal } from "../game/decimal";

  function byproductText(sym: (typeof FUSION_ORDER)[number]): string {
    const bp = FUSION_RECIPES[sym].byproduct;
    const parts: string[] = [];
    if (bp.protons) parts.push(`${bp.protons} p⁺`);
    if (bp.neutrons) parts.push(`${bp.neutrons} n⁰`);
    if (bp.electrons) parts.push(`${bp.electrons} e⁻`);
    if (bp.positrons) parts.push(`${bp.positrons} e⁺`);
    return parts.length ? parts.join(" + ") : "—";
  }

  // Verfügbarkeit je Fusion
  function canFuse(sym: (typeof FUSION_ORDER)[number], g: typeof $game): boolean {
    if (sym === "He") return g.ignited && g.h.gte(TWO_MOL_H);
    const from = FUSION_RECIPES[sym].from as "He" | "Li";
    return g.elements[from].gte(2);
  }

  function costText(sym: (typeof FUSION_ORDER)[number]): string {
    if (sym === "He") return `2 mol H (${formatMol(TWO_MOL_H)})`;
    const from = FUSION_RECIPES[sym].from;
    return `2 mol ${from}`;
  }
</script>

<div class="panel">
  <h3>Fusion</h3>
  {#if !$game.ignited}
    <p class="dim">🔒 Erst zünden (10 Mio K), dann wird H→He freigeschaltet.</p>
  {/if}
  <div class="list">
    {#each FUSION_ORDER as sym (sym)}
      {@const recipe = FUSION_RECIPES[sym]}
      {@const ok = canFuse(sym, $game)}
      {@const locked = sym !== "He" && !$game.unlocked[recipe.from as "He" | "Li"] && recipe.from !== "H"}
      <div class="row" class:locked>
        <div class="rx">
          <b>{recipe.from} → {sym}</b>
          <span class="dim small">Kosten: {costText(sym)}</span>
          <span class="dim small">frei: {byproductText(sym)}</span>
        </div>
        <button class="btn primary" disabled={!ok} on:click={() => fuse(sym)}>
          Fusionieren
        </button>
      </div>
    {/each}
  </div>

  <div class="particles">
    <span class="chip">⚡ Protonen: <b class="mono">{formatInt($game.particles.protons)}</b></span>
    <span class="chip">🔵 Elektronen: <b class="mono">{formatInt($game.particles.electrons)}</b></span>
    <span class="chip">⚪ Neutronen: <b class="mono">{formatInt($game.particles.neutrons)}</b></span>
    <span class="chip">✨ Positronen: <b class="mono">{formatInt($game.particles.positrons)}</b></span>
  </div>
  <p class="dim small">Teilchen werden vorerst nur gesammelt – Boni folgen später.</p>
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: var(--bg-panel-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
  }
  .row.locked {
    opacity: 0.5;
  }
  .rx {
    display: flex;
    flex-direction: column;
  }
  .small {
    font-size: 0.78rem;
  }
  .particles {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .chip {
    background: var(--bg-panel-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 5px 10px;
    font-size: 0.82rem;
  }
</style>
