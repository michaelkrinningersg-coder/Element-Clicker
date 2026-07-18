<script lang="ts">
  import ResourceBar from "./lib/components/ResourceBar.svelte";
  import ClickArea from "./lib/components/ClickArea.svelte";
  import ClickUpgradesPanel from "./lib/components/ClickUpgradesPanel.svelte";
  import GeneratorUpgradesPanel from "./lib/components/GeneratorUpgradesPanel.svelte";
  import GeneratorList from "./lib/components/GeneratorList.svelte";
  import PeriodicTable from "./lib/components/PeriodicTable.svelte";
  import PrestigePanel from "./lib/components/PrestigePanel.svelte";
  import AchievementsPanel from "./lib/components/AchievementsPanel.svelte";
  import StatisticsPanel from "./lib/components/StatisticsPanel.svelte";
  import { offlineReport } from "./lib/game/store";
  import { formatDecimal } from "./lib/game/format";

  let showOffline = offlineReport.seconds > 2 && offlineReport.gained.gt(0);
</script>

{#if showOffline}
  <div class="offline" role="status">
    Willkommen zurück! In deiner Abwesenheit gesammelt:
    <b class="mono">+{formatDecimal(offlineReport.gained)} H</b>
    <button class="close" on:click={() => (showOffline = false)}>✕</button>
  </div>
{/if}

<ResourceBar />

<GeneratorList />

<div class="layout">
  <div class="col">
    <ClickArea />
    <PeriodicTable />
  </div>
  <div class="col">
    <PrestigePanel />
  </div>
  <div class="col">
    <ClickUpgradesPanel />
    <GeneratorUpgradesPanel />
  </div>
</div>

<div class="bottom">
  <AchievementsPanel />
  <StatisticsPanel />
</div>

<footer class="dim">Frühphasen-Prototyp · Balancing-Werte sind Platzhalter.</footer>

<style>
  .offline {
    background: linear-gradient(90deg, #1d2a52, #241b3a);
    border: 1px solid var(--accent);
    border-radius: 12px;
    padding: 10px 14px;
    margin-bottom: 16px;
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
    grid-template-columns: 1.1fr 1fr 1fr;
    gap: 18px;
    align-items: start;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }
  .bottom {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 18px;
    margin-top: 18px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .bottom {
      grid-template-columns: 1fr;
    }
  }
  footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
  }
  @media (max-width: 980px) {
    .layout {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 620px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
