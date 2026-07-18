<script lang="ts">
  import { game } from "../game/store";
  import { GENERATORS } from "../game/generators";
  import {
    GENERATOR_ACHIEVEMENT_THRESHOLDS,
    CLICK_ACHIEVEMENT_THRESHOLDS,
    TOTAL_ACHIEVEMENTS,
  } from "../game/achievements";
  import { achievementMultiplier } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  $: earnedSet = new Set($game.achievements);
  $: earnedCount = $game.achievements.length;
  $: mult = achievementMultiplier($game);
  const fmtT = (t: number) => t.toLocaleString("de-DE");
</script>

<div class="panel">
  <div class="head">
    <h3>Achievements</h3>
    <span class="summary">
      {earnedCount}/{TOTAL_ACHIEVEMENTS} · <b>Auto &amp; Klick ×{formatDecimal(mult)}</b>
    </span>
  </div>

  {#each GENERATORS as g (g.id)}
    <div class="achrow">
      <span class="glabel">{g.icon} {g.name}</span>
      <span class="chips">
        {#each GENERATOR_ACHIEVEMENT_THRESHOLDS as t (t)}
          <span
            class="achip"
            class:earned={earnedSet.has(`gen_${g.id}_${t}`)}
            title={`Besitze ${t}× ${g.name}`}>{t}</span
          >
        {/each}
      </span>
    </div>
  {/each}

  <div class="achrow">
    <span class="glabel">👆 Klicks</span>
    <span class="chips">
      {#each CLICK_ACHIEVEMENT_THRESHOLDS as t (t)}
        <span
          class="achip"
          class:earned={earnedSet.has(`clicks_${t}`)}
          title={`${fmtT(t)} Klicks`}>{fmtT(t)}</span
        >
      {/each}
    </span>
  </div>
</div>

<style>
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }
  .head h3 {
    margin: 0 0 12px;
  }
  .summary {
    font-size: 13px;
    color: var(--text-dim);
  }
  .summary b {
    color: var(--good);
  }
  .achrow {
    display: grid;
    grid-template-columns: 190px 1fr;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    border-top: 1px solid var(--border-panel);
  }
  .glabel {
    font-size: 13px;
    font-weight: 600;
    min-width: 0;
  }
  .chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .achip {
    min-width: 30px;
    text-align: center;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    background: var(--glass-dim);
    border: 1px solid var(--border-panel);
    color: var(--text-locked);
  }
  .achip.earned {
    background: linear-gradient(180deg, #2a3a68, #1a2647);
    border-color: var(--good);
    color: var(--good);
  }
  @media (max-width: 620px) {
    .achrow {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
</style>
