<script lang="ts">
  import { game } from "../game/store";
  import { totalGeneratorsOwned } from "../game/formulas";
  import { TOTAL_ACHIEVEMENTS } from "../game/achievements";
  import { formatDecimal, formatInt, formatNumber, formatDuration } from "../game/format";

  $: g = $game;
</script>

<div class="panel">
  <h3>Statistik</h3>

  <div class="grid">
    <div class="stat"><span class="k">Spielzeit</span><span class="v mono">{formatDuration(g.playtimeSeconds)}</span></div>
    <div class="stat"><span class="k">Klicks gesamt</span><span class="v mono">{formatNumber(g.totalClicks)}</span></div>
    <div class="stat"><span class="k">Gebäude gekauft</span><span class="v mono">{formatNumber(g.totalGeneratorsBought)}</span></div>
    <div class="stat"><span class="k">Generatoren aktuell</span><span class="v mono">{formatNumber(totalGeneratorsOwned(g))}</span></div>
    <div class="stat"><span class="k">Wolke-Kollapse</span><span class="v mono">{formatNumber(g.collapseCount)}</span></div>
    <div class="stat"><span class="k">Nebel-Kollapse</span><span class="v mono">{formatNumber(g.nebulaCount)}</span></div>
    <div class="stat"><span class="k">Zündungen</span><span class="v mono">{formatNumber(g.igniteCount)}</span></div>
    <div class="stat"><span class="k">Achievements</span><span class="v mono">{g.achievements.length}/{TOTAL_ACHIEVEMENTS}</span></div>
  </div>

  <h4>Währungen</h4>
  <div class="grid">
    <div class="stat"><span class="k">Wasserstoff</span><span class="v mono">{formatDecimal(g.h)}</span></div>
    <div class="stat"><span class="k">H gesamt erzeugt</span><span class="v mono">{formatDecimal(g.lifetimeH)}</span></div>
    <div class="stat"><span class="k">🔥 Aktivierungsenergie</span><span class="v mono">{formatInt(g.ae)}</span></div>
    <div class="stat"><span class="k">🌡 Kelvin</span><span class="v mono">{formatDecimal(g.kelvin)}</span></div>
    <div class="stat"><span class="k">🌀 Gravitonen</span><span class="v mono">{formatInt(g.gravitons)}</span></div>
    <div class="stat"><span class="k">He / Li / Be</span><span class="v mono">{formatInt(g.elements.He)} / {formatInt(g.elements.Li)} / {formatInt(g.elements.Be)}</span></div>
    <div class="stat"><span class="k">⚡ Protonen</span><span class="v mono">{formatInt(g.particles.protons)}</span></div>
    <div class="stat"><span class="k">🔵 Elektronen</span><span class="v mono">{formatInt(g.particles.electrons)}</span></div>
    <div class="stat"><span class="k">⚪ Neutronen</span><span class="v mono">{formatInt(g.particles.neutrons)}</span></div>
    <div class="stat"><span class="k">✨ Positronen</span><span class="v mono">{formatInt(g.particles.positrons)}</span></div>
  </div>
</div>

<style>
  h4 {
    margin: 16px 0 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-head);
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 16px;
  }
  .stat {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    padding: 6px 10px;
    background: var(--glass-2);
    border: 1px solid var(--border-row);
    border-radius: 8px;
    font-size: 13px;
  }
  .k {
    color: var(--text-dim);
    min-width: 0;
  }
  .v {
    font-weight: 600;
    white-space: nowrap;
  }
  @media (max-width: 620px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
