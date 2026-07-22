<script lang="ts">
  import { game } from "../game/store";
  import { ACHIEVEMENTS, isUnlocked, unlockedCount } from "../game/achievements";
  import { formatDecimal, formatWeight } from "../game/format";
  import { Decimal } from "../game/decimal";
  import Icon from "./Icon.svelte";

  $: done = unlockedCount($game);

  const progressPct = (threshold: Decimal): number => {
    const p = $game.totalSandEver.div(threshold).toNumber() * 100;
    return Math.max(0, Math.min(100, p));
  };
</script>

<div class="panel">
  <div class="head">
    <h3>Bauwerke aus Sand</h3>
    <span class="counter">{done} / {ACHIEVEMENTS.length}</span>
  </div>
  <p class="legend dim">
    Meilensteine, die sich an den insgesamt gesammelten Sandkörnern freischalten.
  </p>

  <div class="list">
    {#each ACHIEVEMENTS as a (a.id)}
      {@const unlocked = isUnlocked($game, a)}
      <div class="ach" class:unlocked class:locked={!unlocked}>
        <div class="ic" class:gray={!unlocked}>
          <Icon id={a.icon} size={46} />
        </div>
        <div class="body">
          <div class="titleline">
            <span class="name">{a.name}</span>
            {#if unlocked}
              <span class="badge">✓ gebaut</span>
            {/if}
          </div>
          <p class="desc dim">{a.desc}</p>
          <div class="meta">
            <span class="req mono">{formatDecimal(a.threshold)} Körner</span>
            <span class="dot">·</span>
            <span class="req mono">{formatWeight(a.threshold)}</span>
          </div>
          {#if !unlocked}
            <div class="bar" aria-hidden="true">
              <div class="fill" style="width:{progressPct(a.threshold)}%"></div>
            </div>
            <span class="pct dim">{formatDecimal(new Decimal(progressPct(a.threshold)), 1)} %</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 4px;
  }
  h3 {
    margin: 0;
  }
  .counter {
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 700;
    color: var(--gold);
  }
  .legend {
    font-size: 13px;
    margin: 0 0 14px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ach {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 12px;
    padding: 14px;
  }
  .ach.unlocked {
    border-color: var(--accent);
    background: #fff6e2;
    box-shadow: 0 0 0 2px rgba(217, 164, 65, 0.18);
  }
  .ach.locked {
    opacity: 0.92;
  }
  .ic {
    flex: none;
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 12px;
    background: #fffdf6;
    border: 1px solid var(--border-row);
  }
  .ic.gray {
    filter: grayscale(1);
    opacity: 0.5;
  }
  .body {
    min-width: 0;
    flex: 1;
  }
  .titleline {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .name {
    font-size: 16px;
    font-weight: 700;
  }
  .badge {
    font-size: 12px;
    font-weight: 700;
    color: var(--good);
    background: #e7f4ec;
    border: 1px solid #bfe2cc;
    border-radius: 999px;
    padding: 2px 9px;
  }
  .desc {
    margin: 4px 0 8px;
    font-size: 13px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-dim);
  }
  .dot {
    opacity: 0.6;
  }
  .bar {
    margin-top: 10px;
    height: 8px;
    border-radius: 999px;
    background: var(--panel-dim);
    border: 1px solid var(--border-row);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--progress-fill);
  }
  .pct {
    display: inline-block;
    margin-top: 4px;
    font-size: 12px;
  }
</style>
