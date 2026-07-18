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
  <div class="dim mono">+{formatDecimal(perClick)} H / Klick</div>
</div>

<style>
  .clickpanel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .orb {
    width: 190px;
    height: 190px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    background: radial-gradient(circle at 40% 35%, #3a4a80, #0e1530 72%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: 0 0 40px rgba(110, 168, 255, 0.25);
    transition: transform 0.06s ease, box-shadow 0.1s ease;
  }
  .orb:hover {
    box-shadow: 0 0 55px rgba(110, 168, 255, 0.4);
  }
  .orb.pulse {
    transform: scale(0.96);
  }
  .glyph {
    font-size: 3.4rem;
  }
  .hint {
    letter-spacing: 3px;
    font-size: 0.8rem;
    color: var(--text-dim);
  }
</style>
