<script lang="ts">
  import { game, buyGenerator } from "../game/store";
  import { GENERATORS } from "../game/generators";
  import { effectiveGeneratorProduction, nextPerk } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  // Aufgeklappter Generator (Akkordeon) – zeigt dessen Perk-Leiter.
  let openId: string | null = null;
  function toggle(id: string) {
    openId = openId === id ? null : id;
  }
</script>

<div class="panel">
  <h3>Generatoren</h3>
  <p class="dim hint">Klick auf einen Generator zeigt seine Perks.</p>
  <div class="list">
    {#each GENERATORS as def (def.id)}
      {@const gs = $game.generators[def.id]}
      {@const affordable = $game.h.gte(gs.nextCost)}
      {@const prod = effectiveGeneratorProduction($game, def.id)}
      {@const np = nextPerk($game, def.id)}
      {@const open = openId === def.id}
      <div class="card" class:open>
        <div class="row" role="button" tabindex="0" on:click={() => toggle(def.id)} on:keydown={(e) => e.key === "Enter" && toggle(def.id)}>
          <span class="icon">{def.icon}</span>
          <span class="info">
            <span class="name">{def.name}</span>
            <span class="sub dim mono">
              {#if gs.owned > 0}{formatDecimal(prod)} /s{:else}—{/if}
              {#if np}<span class="nextperk"> · nächster Perk: {np.threshold} Stk.</span>{/if}
            </span>
          </span>
          <span class="count mono">{gs.owned}</span>
          <button
            class="buy"
            class:ok={affordable}
            disabled={!affordable}
            on:click|stopPropagation={() => buyGenerator(def.id)}
          >
            {formatDecimal(gs.nextCost)} H
          </button>
        </div>

        {#if open}
          <div class="perks">
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
  </div>
</div>

<style>
  .hint {
    font-size: 0.78rem;
    margin: 0 0 10px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .card {
    background: var(--bg-panel-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .card.open {
    border-color: var(--accent);
  }
  .row {
    display: grid;
    grid-template-columns: 36px 1fr auto auto;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    cursor: pointer;
  }
  .row:hover {
    filter: brightness(1.12);
  }
  .icon {
    font-size: 1.5rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .name {
    font-weight: 600;
  }
  .sub {
    font-size: 0.8rem;
  }
  .nextperk {
    color: var(--accent-2);
  }
  .count {
    font-size: 1.1rem;
    font-weight: 700;
    min-width: 2ch;
    text-align: right;
  }
  .buy {
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 7px 10px;
    font-size: 0.82rem;
    color: var(--text-dim);
    white-space: nowrap;
  }
  .buy.ok {
    color: var(--good);
    border-color: var(--good);
  }
  .buy:hover:not(:disabled) {
    filter: brightness(1.2);
  }
  .buy:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .perks {
    border-top: 1px solid var(--border);
    padding: 8px 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: #0d1326;
  }
  .perk {
    display: grid;
    grid-template-columns: 68px 1fr auto;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    opacity: 0.55;
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
  .perk.reached .ps {
    color: var(--good);
  }
  .small {
    font-size: 0.8rem;
    margin: 2px 0;
  }
</style>
