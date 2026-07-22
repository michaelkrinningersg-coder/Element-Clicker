<script lang="ts">
  import { game } from "../game/store";
  import { ACHIEVEMENTS, isUnlocked, unlockedCount } from "../game/achievements";
  import { achievementProductionMult, costMultiplier } from "../game/formulas";
  import {
    formatDecimal,
    formatWeight,
    earthMassPercent,
    formatFixedPercent,
    formatScientific,
  } from "../game/format";
  import { Decimal } from "../game/decimal";
  import Icon from "./Icon.svelte";

  $: done = unlockedCount($game);
  // Aktive Boni: +2 % Produktion & −1 % Kosten je Bauwerk (multiplikativ).
  $: prodBonusPct = (achievementProductionMult($game).toNumber() - 1) * 100;
  $: costCutPct = (1 - costMultiplier($game).toNumber()) * 100;
  // Fortschritt zur Erdmasse (5,972·10^24 kg).
  $: earthPct = earthMassPercent($game.totalSandEver);

  const progressPct = (threshold: Decimal): number => {
    const p = $game.totalSandEver.div(threshold).toNumber() * 100;
    return Math.max(0, Math.min(100, p));
  };
  const pct1 = (n: number) => formatDecimal(new Decimal(n), 1);
</script>

<div class="panel">
  <div class="head">
    <h3>Bauwerke aus Sand</h3>
    <span class="counter">{done} / {ACHIEVEMENTS.length}</span>
  </div>
  <p class="legend dim">
    Meilensteine, die sich an den insgesamt gesammelten Sandkörnern freischalten.
    Jedes Bauwerk gibt <b>+2 % Produktion</b> und <b>−1 % Kosten</b> (multiplikativ).
  </p>

  <div class="totals">
    <div class="tot prod">
      <span class="tk">Produktion</span>
      <span class="tv">×{formatDecimal(achievementProductionMult($game), 3)}</span>
      <span class="ts dim">+{pct1(prodBonusPct)} %</span>
    </div>
    <div class="tot cost">
      <span class="tk">Kosten</span>
      <span class="tv">×{formatDecimal(costMultiplier($game), 3)}</span>
      <span class="ts dim">−{pct1(costCutPct)} %</span>
    </div>
  </div>

  <div class="earth">
    <div class="ehead">
      <span class="etitle">🌍 Fortschritt zur Erdmasse</span>
      <span class="esci dim">{formatScientific(earthPct)} %</span>
    </div>
    <div class="epct mono">{formatFixedPercent(earthPct, 15)} %</div>
    <p class="enote dim">
      Erdmasse ≈ 5,972·10<sup>24</sup> kg ≈ 5,972·10<sup>32</sup> Sandkörner ·
      gesammelt: {formatDecimal($game.totalSandEver)} Körner ({formatWeight($game.totalSandEver)})
    </p>
  </div>

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
          <div class="reward">
            <span class="rw">+2 % Produktion</span>
            <span class="rw">−1 % Kosten</span>
          </div>
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
    margin: 0 0 12px;
  }
  .totals {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .tot {
    flex: 1;
    min-width: 130px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 10px 14px;
  }
  .tot.prod {
    border-left: 3px solid var(--prod);
  }
  .tot.cost {
    border-left: 3px solid var(--accent);
  }
  .tk {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
  }
  .tv {
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .ts {
    font-size: 12px;
  }
  .reward {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .rw {
    font-size: 11px;
    font-weight: 600;
    color: var(--prod);
    background: var(--chip-grav-bg);
    border: 1px solid var(--chip-grav-bd);
    border-radius: 999px;
    padding: 2px 8px;
  }
  .earth {
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-left: 3px solid var(--accent-2);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 16px;
  }
  .ehead {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  .etitle {
    font-size: 14px;
    font-weight: 700;
  }
  .esci {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .epct {
    margin-top: 6px;
    font-size: 17px;
    font-weight: 700;
    color: var(--accent-2);
    word-break: break-all;
  }
  .enote {
    margin: 8px 0 0;
    font-size: 11px;
    line-height: 1.5;
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
