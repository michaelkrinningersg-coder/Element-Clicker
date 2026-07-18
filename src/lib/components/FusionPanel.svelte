<script lang="ts">
  import { game, fuse } from "../game/store";
  import { TWO_MOL_H } from "../game/constants";
  import { FUSION_ORDER, FUSION_RECIPES } from "../game/elements";
  import { formatMol } from "../game/format";

  function byproductText(sym: (typeof FUSION_ORDER)[number]): string {
    const bp = FUSION_RECIPES[sym].byproduct;
    const parts: string[] = [];
    if (bp.protons) parts.push(`${bp.protons} p⁺`);
    if (bp.neutrons) parts.push(`${bp.neutrons} n⁰`);
    if (bp.electrons) parts.push(`${bp.electrons} e⁻`);
    if (bp.positrons) parts.push(`${bp.positrons} e⁺`);
    return parts.length ? parts.join(" + ") : "—";
  }

  // "läuft gerade" = genug Ausgangsstoff für mindestens eine Fusion vorhanden
  function flowing(sym: (typeof FUSION_ORDER)[number], g: typeof $game): boolean {
    if (sym === "He") return g.h.gte(TWO_MOL_H);
    const from = FUSION_RECIPES[sym].from as "He" | "Li";
    return g.elements[from].gte(2);
  }

  $: canFirstFuse = $game.ignited && $game.h.gte(TWO_MOL_H);
</script>

<div class="panel">
  <div class="head">
    <h3>Fusion</h3>
    {#if $game.autoFusion}
      <span class="badge">⚙️ Auto-Fusion aktiv</span>
    {/if}
  </div>

  {#if !$game.ignited}
    <p class="dim">🔒 Erst zünden (10 Mio K), dann wird die Fusion H→He freigeschaltet.</p>
  {:else if !$game.autoFusion}
    <p class="dim small">
      Löse die erste Fusion manuell aus. Danach läuft die gesamte Kette
      <b>automatisch</b>: sobald genug Ausgangsstoff (je 2 mol) da ist, wird
      fusioniert – Wasserstoff wird von den Generatoren weiter nachproduziert.
    </p>
    <button class="btn primary full" disabled={!canFirstFuse} on:click={() => fuse("He")}>
      🔥 Erste Fusion: 2 mol H → He
    </button>
    {#if !canFirstFuse}
      <p class="dim small">Benötigt 2 mol H ({formatMol(TWO_MOL_H)}).</p>
    {/if}
  {:else}
    <div class="ladder">
      {#each FUSION_ORDER as sym (sym)}
        {@const recipe = FUSION_RECIPES[sym]}
        {@const isFlowing = flowing(sym, $game)}
        <div class="rung" class:flow={isFlowing}>
          <span class="rx"><b>{recipe.from} → {sym}</b></span>
          <span class="dim small">frei: {byproductText(sym)}</span>
          <span class="state" class:on={isFlowing}>{isFlowing ? "▶ läuft" : "wartet"}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .head h3 {
    margin: 0;
  }
  .badge {
    background: linear-gradient(90deg, #1f8a5f33, #4fd39a22);
    border: 1px solid var(--good);
    color: var(--good);
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 0.78rem;
  }
  .full {
    width: 100%;
    margin-top: 6px;
  }
  .ladder {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 6px;
  }
  .rung {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 10px 14px;
    opacity: 0.6;
  }
  .rung.flow {
    opacity: 1;
    border-color: var(--accent);
  }
  .small {
    font-size: 0.78rem;
  }
  .state {
    font-size: 0.78rem;
    color: var(--text-dim);
    white-space: nowrap;
  }
  .state.on {
    color: var(--good);
  }
</style>
