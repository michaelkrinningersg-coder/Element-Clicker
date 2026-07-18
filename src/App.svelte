<script lang="ts">
  import ResourceBar from "./lib/components/ResourceBar.svelte";
  import ClickArea from "./lib/components/ClickArea.svelte";
  import GeneratorList from "./lib/components/GeneratorList.svelte";
  import PeriodicTable from "./lib/components/PeriodicTable.svelte";
  import PrestigePanel from "./lib/components/PrestigePanel.svelte";
  import FusionPanel from "./lib/components/FusionPanel.svelte";
  import { offlineReport, hardReset } from "./lib/game/store";
  import { formatDecimal } from "./lib/game/format";

  let showOffline = offlineReport.seconds > 2 && offlineReport.gained.gt(0);

  function resetConfirm() {
    if (confirm("Wirklich komplett zurücksetzen? Aller Fortschritt geht verloren.")) {
      hardReset();
    }
  }
</script>

<header class="topbar">
  <h1>⚛️ Element Clicker</h1>
  <button class="btn small" on:click={resetConfirm}>Reset</button>
</header>

{#if showOffline}
  <div class="offline" role="status">
    Willkommen zurück! In deiner Abwesenheit gesammelt:
    <b class="mono">+{formatDecimal(offlineReport.gained)} H</b>
    <button class="close" on:click={() => (showOffline = false)}>✕</button>
  </div>
{/if}

<ResourceBar />

<div class="layout">
  <div class="col">
    <ClickArea />
    <PeriodicTable />
    <FusionPanel />
  </div>
  <div class="col">
    <GeneratorList />
    <PrestigePanel />
  </div>
</div>

<footer class="dim">
  Frühphasen-Prototyp · Balancing-Werte sind Platzhalter.
</footer>

<style>
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .topbar h1 {
    font-size: 1.4rem;
    margin: 0;
  }
  .btn.small {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
  .offline {
    background: linear-gradient(90deg, #1d2a52, #241b3a);
    border: 1px solid var(--accent);
    border-radius: 10px;
    padding: 10px 14px;
    margin: 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .close {
    margin-left: auto;
    background: none;
    border: none;
    color: var(--text-dim);
    font-size: 1rem;
  }
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 14px;
    align-items: start;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
  }
  footer {
    margin-top: 20px;
    text-align: center;
    font-size: 0.8rem;
  }
  @media (max-width: 760px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
