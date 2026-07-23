<script lang="ts">
  import { game, buildDino, meltShards, buildHelper } from "../game/store";
  import { excavationBonusMultiplier, excavationFindChance } from "../game/formulas";
  import {
    DINOS,
    SPLITTER_PER_METAL,
    METAL_PER_HELPER,
    EXCAVATION_MAX_M,
    BONE_BONUS_PER,
    AMBER_BONUS_PER,
    METEOR_BONUS_PER,
    HELPER_CHANCE_PER,
  } from "../game/constants";
  import { formatDecimal, formatNumber } from "../game/format";
  import { Decimal } from "../game/decimal";

  $: meltable = Math.floor($game.meteorShards / SPLITTER_PER_METAL);
  $: buildableHelpers = Math.floor($game.metal / METAL_PER_HELPER);
  $: findChancePct = excavationFindChance($game.excavationHelpers) * 100;
  const pct = (n: number, d = 1) => n.toLocaleString("de-DE", { maximumFractionDigits: d });
</script>

<div class="panel">
  <div class="phead">
    <h3>⛏️ Ausgrabungen</h3>
    <span class="bonuschip">Sand-Bonus ×{formatDecimal(excavationBonusMultiplier($game), 3)}</span>
  </div>
  <p class="legend dim">
    Je vollständig gegrabenem Meter (1–{EXCAVATION_MAX_M} m) besteht eine Fundchance von
    <b>{pct(findChancePct, 2)} %</b>: Dino-Knochen (5 %), Bernstein (2,5 %) oder – sehr selten
    – ein Meteoritensplitter (0,05 %). Über 100 % sind mehrere Funde je Meter möglich.
    Funde bleiben über Prestige erhalten.
  </p>

  <div class="finds">
    <div class="find">
      <span class="ftop">🦴 {formatNumber($game.dinoBones)}</span>
      <span class="flabel dim">Dino-Knochen · +{pct(BONE_BONUS_PER * 100)} % Sand je Stück</span>
    </div>
    <div class="find">
      <span class="ftop">🟠 {formatNumber($game.amber)}</span>
      <span class="flabel dim">Bernstein · +{pct(AMBER_BONUS_PER * 100)} % Sand je Stück</span>
    </div>
    <div class="find">
      <span class="ftop">☄️ {formatNumber($game.meteorShards)}</span>
      <span class="flabel dim">Splitter · +{pct(METEOR_BONUS_PER * 100)} % Sand je Stück</span>
    </div>
    <div class="find">
      <span class="ftop">⚙️ {formatNumber($game.metal)}</span>
      <span class="flabel dim">Metall (für Ausgrabungshilfen)</span>
    </div>
    <div class="find">
      <span class="ftop">🛠️ {formatNumber($game.excavationHelpers)}</span>
      <span class="flabel dim">Ausgrabungshilfen · +{pct(HELPER_CHANCE_PER * 100, 1)} % Fundchance je Stück</span>
    </div>
  </div>

  <div class="sub">
    <h4>Dinos zusammensetzen (je einmal)</h4>
    <p class="legend dim">
      Knochen sind eine Währung: Zusammensetzen verbraucht sie, gibt dafür einen großen
      dauerhaften Sand-Bonus (+3 % je Knochen der Kosten).
    </p>
    <div class="dinos">
      {#each DINOS as d (d.id)}
        {@const built = !!$game.dinosBuilt[d.id]}
        {@const affordable = $game.dinoBones >= d.cost}
        <div class="dino" class:built>
          <div class="dinfo">
            <span class="dname">{d.name}</span>
            <span class="dmeta dim">{formatNumber(d.cost)} 🦴 · +{formatNumber(d.bonusPct)} % Sand</span>
          </div>
          {#if built}
            <span class="dbuilt">✓ zusammengesetzt</span>
          {:else}
            <button class="dbtn" disabled={!affordable} on:click={() => buildDino(d.id)}>
              Zusammensetzen
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <div class="sub">
    <h4>Meteoritensplitter einschmelzen</h4>
    <div class="meltrow">
      <span class="dim">{SPLITTER_PER_METAL} Splitter → 1 Metall · verfügbar: {formatNumber(meltable)}</span>
      <button class="dbtn" disabled={meltable <= 0} on:click={meltShards}>
        Einschmelzen ({formatNumber(meltable)})
      </button>
    </div>
  </div>

  <div class="sub">
    <h4>Ausgrabungshilfe bauen</h4>
    <p class="legend dim">
      Kostet {METAL_PER_HELPER} Metall je Hilfe und erhöht die Fundchance dauerhaft um
      +{pct(HELPER_CHANCE_PER * 100, 1)} %. Über 100 % findest du im Schnitt mehrere Objekte je Meter.
    </p>
    <div class="meltrow">
      <span class="dim">
        Aktuelle Fundchance: <b>{pct(findChancePct, 2)} %</b> · baubar: {formatNumber(buildableHelpers)}
      </span>
      <div class="btnrow">
        <button class="dbtn" disabled={buildableHelpers <= 0} on:click={() => buildHelper(1)}>
          +1 Hilfe
        </button>
        <button class="dbtn" disabled={buildableHelpers <= 0} on:click={() => buildHelper(buildableHelpers)}>
          Max ({formatNumber(buildableHelpers)})
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .phead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  h3 {
    margin: 0;
  }
  .bonuschip {
    background: #fff2c8;
    border: 1px solid #e8bf5e;
    color: #8a5a12;
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 700;
  }
  .legend {
    font-size: 13px;
    margin: 8px 0 14px;
  }
  .finds {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 8px;
  }
  .find {
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 11px 13px;
  }
  .ftop {
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .flabel {
    font-size: 12px;
  }
  .sub {
    margin-top: 18px;
  }
  h4 {
    margin: 0 0 6px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
  }
  .dinos {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .dino {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 10px 14px;
  }
  .dino.built {
    border-color: var(--accent);
    background: #fff6e2;
  }
  .dinfo {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .dname {
    font-size: 15px;
    font-weight: 700;
  }
  .dmeta {
    font-size: 12.5px;
  }
  .dbtn {
    background: var(--btn-primary);
    border: 1px solid #d3a53f;
    color: #4a3a16;
    font-weight: 600;
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 13px;
    white-space: nowrap;
  }
  .dbtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.4);
  }
  .dbuilt {
    font-size: 13px;
    font-weight: 700;
    color: var(--good);
    white-space: nowrap;
  }
  .meltrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 10px 14px;
  }
  .btnrow {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
</style>
