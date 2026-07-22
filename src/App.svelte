<script lang="ts">
  import ResourceBar from "./lib/components/ResourceBar.svelte";
  import ClickArea from "./lib/components/ClickArea.svelte";
  import BuildingsList from "./lib/components/BuildingsList.svelte";
  import PrestigePanel from "./lib/components/PrestigePanel.svelte";
  import StatsPanel from "./lib/components/StatsPanel.svelte";
  import AchievementsPanel from "./lib/components/AchievementsPanel.svelte";
  import DigPanel from "./lib/components/DigPanel.svelte";
  import { offlineReport, game } from "./lib/game/store";
  import { formatDecimal } from "./lib/game/format";
  import { unlockedCount, ACHIEVEMENTS } from "./lib/game/achievements";

  let showOffline = offlineReport.seconds > 2 && offlineReport.gained.gt(0);

  type Tab = "spiel" | "graben" | "statistiken" | "bauwerke";
  let tab: Tab = "spiel";
  const TABS: { id: Tab; label: string }[] = [
    { id: "spiel", label: "Spiel" },
    { id: "graben", label: "Graben" },
    { id: "statistiken", label: "Statistiken" },
    { id: "bauwerke", label: "Bauwerke" },
  ];

  $: builtCount = unlockedCount($game);
</script>

{#if showOffline}
  <div class="offline" role="status">
    Willkommen zurück! In deiner Abwesenheit gesammelt:
    <b class="mono">+{formatDecimal(offlineReport.gained)} Sand</b>
    <button class="close" on:click={() => (showOffline = false)}>✕</button>
  </div>
{/if}

<ResourceBar />

<nav class="tabs">
  {#each TABS as t (t.id)}
    <button class="tab" class:active={tab === t.id} on:click={() => (tab = t.id)}>
      {t.label}
      {#if t.id === "bauwerke"}
        <span class="tabbadge">{builtCount}/{ACHIEVEMENTS.length}</span>
      {/if}
    </button>
  {/each}
</nav>

{#if tab === "spiel"}
  <div class="fullwidth">
    <BuildingsList />
  </div>

  <div class="layout">
    <div class="col">
      <ClickArea />
    </div>
    <div class="col">
      <PrestigePanel />
    </div>
  </div>
{:else if tab === "graben"}
  <DigPanel />
{:else if tab === "statistiken"}
  <StatsPanel />
{:else if tab === "bauwerke"}
  <AchievementsPanel />
{/if}

<footer class="dim">Sandkörner-Prototyp · Balancing-Werte sind Platzhalter.</footer>

<style>
  .offline {
    background: #fff4dc;
    border: 1px solid #e9cf95;
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
  .tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .tab {
    background: var(--panel-2);
    border: 1px solid var(--border-row);
    border-radius: 10px;
    padding: 9px 18px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dim);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .tab:hover {
    filter: brightness(0.98);
  }
  .tab.active {
    background: var(--btn-primary);
    border-color: #d3a53f;
    color: #4a3a16;
  }
  .tabbadge {
    font-size: 11px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 999px;
    padding: 1px 7px;
  }
  .fullwidth {
    margin-bottom: 18px;
  }
  .layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 18px;
    align-items: start;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }
  footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
  }
  @media (max-width: 700px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
