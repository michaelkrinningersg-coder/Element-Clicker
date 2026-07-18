<script lang="ts">
  import { game, click } from "../game/store";
  import { clickValue } from "../game/formulas";
  import { CLICK_BASE } from "../game/constants";
  import { formatDecimal } from "../game/format";

  let pulsing = false;
  function onClick() {
    click();
    pulsing = true;
    setTimeout(() => (pulsing = false), 90);
  }

  $: perClick = clickValue($game, CLICK_BASE);
</script>

<div class="panel clickpanel">
  <button class="orb" class:pulse={pulsing} on:click={onClick} aria-label="Wasserstoff sammeln">
    <span class="glyph">🌫️</span>
    <span class="hint">KLICK</span>
  </button>
  <div class="perclick mono">+{formatDecimal(perClick)} H / Klick</div>
</div>

<style>
  .clickpanel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 22px;
  }
  .orb {
    width: 190px;
    height: 190px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    background: var(--orb-fill);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    animation: coreGlow 3.4s ease-in-out infinite;
    transition: transform 0.06s ease;
  }
  .orb.pulse {
    transform: scale(0.96);
  }
  .glyph {
    font-size: 58px;
  }
  .hint {
    letter-spacing: 4px;
    font-size: 12px;
    color: var(--text-dim);
  }
  .perclick {
    font-size: 14px;
    color: var(--text-dim);
  }

  @keyframes coreGlow {
    0%,
    100% {
      box-shadow: 0 0 42px rgba(110, 168, 255, 0.32);
    }
    50% {
      box-shadow: 0 0 70px rgba(150, 120, 255, 0.5);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .orb {
      animation: none;
      box-shadow: 0 0 42px rgba(110, 168, 255, 0.32);
    }
  }
</style>
