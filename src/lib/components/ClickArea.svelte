<script lang="ts">
  import { game, click } from "../game/store";
  import { clickValue } from "../game/formulas";
  import { formatDecimal } from "../game/format";

  let pulsing = false;
  function onClick() {
    click();
    pulsing = true;
    setTimeout(() => (pulsing = false), 90);
  }

  $: perClick = clickValue($game);
</script>

<div class="panel clickpanel">
  <button class="orb" class:pulse={pulsing} on:click={onClick} aria-label="Sand sammeln">
    <span class="glyph">🏖️</span>
    <span class="hint">SAMMELN</span>
  </button>
  <div class="perclick mono">+{formatDecimal(perClick)} Sand / Klick</div>
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
    border: 3px solid #e0b968;
    background: var(--orb-fill);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: 0 6px 22px rgba(216, 164, 65, 0.32);
    transition: transform 0.06s ease, box-shadow 0.1s ease;
  }
  .orb:hover {
    box-shadow: 0 8px 26px rgba(216, 164, 65, 0.45);
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
    color: #7a5f2a;
    font-weight: 600;
  }
  .perclick {
    font-size: 14px;
    color: var(--text-dim);
  }
</style>
