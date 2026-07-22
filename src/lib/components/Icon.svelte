<script lang="ts">
  export let id: string;
  export let size = 30;
</script>

<svg viewBox="0 0 44 44" width={size} height={size} class="ic" aria-hidden="true">
  {#if id === "hand"}
    <g fill="#eabf78" stroke="#c8933f" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
      <rect x="15" y="20" width="16" height="15" rx="6" />
      <rect x="16.6" y="11" width="3.3" height="12" rx="1.6" />
      <rect x="20.9" y="9" width="3.3" height="14" rx="1.6" />
      <rect x="25.2" y="10" width="3.3" height="13" rx="1.6" />
      <rect x="29.5" y="13" width="3.3" height="10" rx="1.6" />
      <rect x="8.5" y="21.5" width="9" height="3.6" rx="1.8" transform="rotate(-42 13 23)" />
    </g>
  {:else if id === "eimer"}
    <g stroke="#4d84bb" stroke-width="1.5" stroke-linejoin="round">
      <path d="M14 18 h16 l-2 16 a2 2 0 0 1 -2 1.8 h-8 a2 2 0 0 1 -2 -1.8 z" fill="#6aa8de" />
      <ellipse cx="22" cy="18" rx="8" ry="2.6" fill="#ecca7d" stroke="none" />
      <path d="M15 19 Q22 8 29 19" fill="none" stroke-linecap="round" />
    </g>
  {:else if id === "schaufel"}
    <g transform="rotate(18 22 22)">
      <path d="M18.5 6 h7 v3 a3.5 3.5 0 0 1 -7 0 z" fill="#a06a34" stroke="#7d5122" stroke-width="1.2" stroke-linejoin="round" />
      <rect x="20.6" y="9" width="2.8" height="18" rx="1.4" fill="#b07a3e" />
      <path d="M17.5 26 h9 l-1.3 7 a3 3 0 0 1 -2.6 2.4 h-1.2 a3 3 0 0 1 -2.6 -2.4 z" fill="#c2c6cc" stroke="#8f959d" stroke-width="1.2" stroke-linejoin="round" />
    </g>
  {:else if id === "sieb"}
    <g>
      <ellipse cx="22" cy="23" rx="13" ry="8.4" fill="#e4c07f" stroke="#c98a2e" stroke-width="1.6" />
      <ellipse cx="22" cy="22" rx="10" ry="5.8" fill="#f6edd6" />
      <g fill="#cdaa66">
        <circle cx="16" cy="22" r="1" /><circle cx="20" cy="20.6" r="1" /><circle cx="24" cy="20.6" r="1" />
        <circle cx="28" cy="22" r="1" /><circle cx="18" cy="23.4" r="1" /><circle cx="22" cy="23.8" r="1" />
        <circle cx="26" cy="23.4" r="1" />
      </g>
    </g>
  {:else if id === "arbeiter"}
    <g>
      <rect x="13.5" y="27" width="17" height="11" rx="4" fill="#5aa06a" stroke="#3f7d50" stroke-width="1.3" />
      <circle cx="22" cy="21" r="6.2" fill="#f0c58a" stroke="#d3a066" stroke-width="1.2" />
      <path d="M14.3 20.5 a7.7 7.7 0 0 1 15.4 0 z" fill="#f2c94c" stroke="#d9a93a" stroke-width="1.3" stroke-linejoin="round" />
      <rect x="20.4" y="10.5" width="3.2" height="3.4" rx="1.4" fill="#f2c94c" stroke="#d9a93a" stroke-width="1" />
    </g>
  {:else if id === "lasttiere"}
    <g fill="#a98b6a" stroke="#856a4f" stroke-width="1.3" stroke-linejoin="round">
      <ellipse cx="20.5" cy="25" rx="10.5" ry="6" />
      <rect x="13" y="29.5" width="3" height="8" rx="1.4" />
      <rect x="17.6" y="29.5" width="3" height="8" rx="1.4" />
      <rect x="23.5" y="29.5" width="3" height="8" rx="1.4" />
      <rect x="28" y="29.5" width="3" height="8" rx="1.4" />
      <path d="M29 22 q7 -1.5 6.4 5 q-0.8 3 -6.4 1.2 z" />
      <path d="M33.2 13.5 l2 6 -3.8 -1 z" />
    </g>
  {:else if id === "handkarren"}
    <g>
      <path d="M11 19 h18 l-3.2 10 h-8.6 z" fill="#cf9a3a" stroke="#a67f3c" stroke-width="1.4" stroke-linejoin="round" />
      <line x1="27" y1="24" x2="36.5" y2="30.5" stroke="#a67f3c" stroke-width="2.4" stroke-linecap="round" />
      <circle cx="18.6" cy="33.5" r="4.4" fill="#5b4a37" stroke="#3f3123" stroke-width="1.2" />
      <circle cx="18.6" cy="33.5" r="1.4" fill="#e0cfae" />
    </g>
  {:else if id === "ach-schaufel"}
    <g>
      <!-- Sandhaufen -->
      <path d="M6 35 q10 -13 16 0 z" fill="#e6c684" stroke="#cf9f45" stroke-width="1.4" stroke-linejoin="round" />
      <g fill="#cea94f" opacity="0.6"><circle cx="12" cy="31" r="0.9" /><circle cx="15" cy="33" r="0.9" /><circle cx="18" cy="31.5" r="0.9" /></g>
      <!-- Schaufel im Haufen -->
      <g transform="rotate(24 27 22)">
        <rect x="25.6" y="8" width="2.6" height="17" rx="1.3" fill="#b07a3e" />
        <circle cx="26.9" cy="8" r="2.6" fill="none" stroke="#b07a3e" stroke-width="2" />
        <path d="M23.4 24 h7 l-1 6.5 a2.6 2.6 0 0 1 -2.3 2 h-0.4 a2.6 2.6 0 0 1 -2.3 -2 z" fill="#c2c6cc" stroke="#8f959d" stroke-width="1.2" stroke-linejoin="round" />
      </g>
    </g>
  {:else if id === "ach-eimer"}
    <g stroke="#4d84bb" stroke-width="1.5" stroke-linejoin="round">
      <path d="M12 17 h20 l-2.4 18 a2.2 2.2 0 0 1 -2.2 2 h-11 a2.2 2.2 0 0 1 -2.2 -2 z" fill="#6aa8de" />
      <path d="M13 17 Q22 6 31 17" fill="none" stroke-linecap="round" />
      <!-- randvoller Sand -->
      <path d="M13.2 18.5 q8.8 6 17.6 0 q0 2.4 -8.8 2.4 q-8.8 0 -8.8 -2.4 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1" />
      <path d="M17 15 q5 -4 10 0 q-5 3 -10 0 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1" />
    </g>
  {:else if id === "ach-sandburg"}
    <g fill="#e6c684" stroke="#cf9f45" stroke-width="1.4" stroke-linejoin="round">
      <!-- Hauptkörper -->
      <rect x="9" y="20" width="26" height="15" rx="1.5" />
      <!-- Zinnen -->
      <path d="M9 20 v-4 h3 v4 M15.5 20 v-4 h3 v4 M22 20 v-4 h3 v4 M28.5 20 v-4 h3 v4" fill="#e6c684" stroke="none" />
      <path d="M9 16 h3 v4 M15.5 16 h3 v4 M22 16 h3 v4 M28.5 16 h3 v4 M9 20 h26" fill="none" />
      <!-- Türme -->
      <rect x="6" y="14" width="6" height="21" rx="1.5" />
      <rect x="32" y="14" width="6" height="21" rx="1.5" />
      <path d="M6 14 l3 -5 l3 5 z M32 14 l3 -5 l3 5 z" fill="#e0a838" stroke="#c8922f" />
      <!-- Tor -->
      <path d="M19 35 v-7 a3 3 0 0 1 6 0 v7 z" fill="#b98a3e" stroke="#9a6f2e" />
    </g>
  {:else if id === "ach-lkw"}
    <g>
      <!-- Fahrerhaus -->
      <path d="M6 20 h9 v13 h-11 v-8 a2 2 0 0 1 0.6 -1.4 z" fill="#4d84bb" stroke="#3a6591" stroke-width="1.3" stroke-linejoin="round" />
      <rect x="7.5" y="22" width="5.5" height="4.5" rx="1" fill="#bfe0f2" stroke="#3a6591" stroke-width="1" />
      <!-- Mulde mit Sand -->
      <path d="M15 22 h22 v11 h-22 z" fill="#d9a441" stroke="#b07f2c" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M16 22 q5.5 -4.5 11 0 q5.5 -4.5 10 0 q0 1.6 -5 1.6 q-5 0 -5 -1.6 q0 1.6 -5 1.6 q-6 0 -6 -1.6 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1" />
      <!-- Räder -->
      <circle cx="12" cy="35" r="3.4" fill="#3f3123" stroke="#2a2016" stroke-width="1.2" />
      <circle cx="30" cy="35" r="3.4" fill="#3f3123" stroke="#2a2016" stroke-width="1.2" />
      <circle cx="12" cy="35" r="1.1" fill="#c9b89a" /><circle cx="30" cy="35" r="1.1" fill="#c9b89a" />
    </g>
  {:else if id === "ach-duene"}
    <g>
      <path d="M3 34 q9 -15 19 -9 q7 4 19 9 z" fill="#e6c684" stroke="#cf9f45" stroke-width="1.4" stroke-linejoin="round" />
      <path d="M22 25 q10 4 19 9 h-19 z" fill="#d9b160" stroke="none" opacity="0.55" />
      <!-- Windrippel -->
      <g fill="none" stroke="#cf9f45" stroke-width="0.9" opacity="0.6" stroke-linecap="round">
        <path d="M9 31 q3 -1.6 6 0" /><path d="M17 29 q3 -1.6 6 0" /><path d="M26 31 q3 -1.6 6 0" />
      </g>
      <!-- Grasbüschel -->
      <g stroke="#7fa85a" stroke-width="1.2" stroke-linecap="round" fill="none">
        <path d="M14 24 v-5 M14 24 l-2.4 -4 M14 24 l2.4 -4.4" />
      </g>
    </g>
  {:else if id === "ach-strand"}
    <g>
      <!-- Meer -->
      <path d="M3 12 h38 v10 h-38 z" fill="#6cc3d4" />
      <g fill="none" stroke="#bfe9f0" stroke-width="1" opacity="0.8" stroke-linecap="round">
        <path d="M6 15 q3 -1.6 6 0 t6 0 t6 0 t6 0" /><path d="M6 19 q3 -1.6 6 0 t6 0 t6 0 t6 0" />
      </g>
      <!-- Wellensaum -->
      <path d="M3 22 q6 3 12 1 q7 -2 13 1 q6 2 13 -1 v0 h-38 z" fill="#eaf6f8" />
      <!-- Sand -->
      <path d="M3 24 q6 2.6 12 1 q7 -1.8 13 1 q6 1.8 13 -1 v11 h-38 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1.2" stroke-linejoin="round" />
      <!-- Sonnenschirm -->
      <line x1="30" y1="26" x2="30" y2="35" stroke="#9a6f2e" stroke-width="1.4" stroke-linecap="round" />
      <path d="M24 27 a6 6 0 0 1 12 0 z" fill="#e0654b" stroke="#b84d36" stroke-width="1" stroke-linejoin="round" />
    </g>
  {:else if id === "ach-sphinx"}
    <g fill="#e2bd76" stroke="#c8993f" stroke-width="1.3" stroke-linejoin="round">
      <!-- Körper (liegend) -->
      <path d="M6 34 h28 v-6 q-6 -2 -12 -2 q-10 0 -16 5 z" />
      <!-- Vorderpfoten -->
      <rect x="7" y="31" width="14" height="3.4" rx="1.2" />
      <!-- Kopf mit Nemes-Kopftuch -->
      <path d="M26 26 q-1 -10 6 -10 q7 0 6 10 z" />
      <path d="M26 26 q-1 -10 6 -10 q7 0 6 10 z" fill="none" stroke="#c8993f" />
      <!-- Gesicht -->
      <rect x="29" y="17.5" width="6" height="8.5" rx="2.4" fill="#eccf92" stroke="#c8993f" stroke-width="1" />
      <g fill="#7d5122" stroke="none"><circle cx="30.8" cy="20.5" r="0.8" /><circle cx="33.4" cy="20.5" r="0.8" /></g>
      <!-- Kopftuch-Streifen -->
      <g stroke="#b8862f" stroke-width="0.8" fill="none"><path d="M27 20 h2.2 M35 20 h2.2 M27 23 h1.8 M35.2 23 h1.8" /></g>
    </g>
  {:else if id === "ach-pyramide"}
    <g>
      <!-- Sonnenbeschienene Seite -->
      <path d="M22 7 L38 35 H22 z" fill="#e9c987" stroke="#c8993f" stroke-width="1.3" stroke-linejoin="round" />
      <!-- Schattenseite -->
      <path d="M22 7 L6 35 H22 z" fill="#d3a758" stroke="#c8993f" stroke-width="1.3" stroke-linejoin="round" />
      <!-- Steinlagen -->
      <g stroke="#c8993f" stroke-width="0.7" opacity="0.55" fill="none">
        <path d="M14 21 h16 M11 26.5 h22 M8.5 31 h27" />
      </g>
      <!-- Deckstein -->
      <path d="M22 7 l3 5 h-6 z" fill="#f4e3b8" stroke="#c8993f" stroke-width="0.8" stroke-linejoin="round" />
    </g>
  {:else if id === "ach-sanduhr"}
    <g>
      <!-- Rahmen oben/unten -->
      <rect x="12" y="6" width="20" height="3" rx="1.4" fill="#a06a34" stroke="#7d5122" stroke-width="1" />
      <rect x="12" y="35" width="20" height="3" rx="1.4" fill="#a06a34" stroke="#7d5122" stroke-width="1" />
      <!-- Glaskolben -->
      <path d="M15 9 h14 q0 7 -7 13 q-7 6 -7 13 h14" fill="none" stroke="#8fbcc7" stroke-width="1.6" stroke-linejoin="round" />
      <!-- oberer Sand -->
      <path d="M16.5 10 h11 q-0.4 4.6 -5.5 8 q-5.1 -3.4 -5.5 -8 z" fill="#ecca7d" />
      <!-- unterer Sandhaufen -->
      <path d="M16.5 34 q1.5 -6 5.5 -7.4 q4 1.4 5.5 7.4 z" fill="#e2bd76" />
      <!-- rieselnder Sand -->
      <line x1="22" y1="20" x2="22" y2="30" stroke="#d9a441" stroke-width="1.1" stroke-linecap="round" />
    </g>
  {:else if id === "ach-sandkuchen"}
    <g>
      <!-- Sandkuchen (Förmchen-Form) -->
      <path d="M9 22 h26 l-2.5 12 a3 3 0 0 1 -3 2.4 h-15 a3 3 0 0 1 -3 -2.4 z" fill="#e2bd76" stroke="#c8993f" stroke-width="1.3" stroke-linejoin="round" />
      <ellipse cx="22" cy="22" rx="13" ry="4" fill="#ecca7d" stroke="#c8993f" stroke-width="1.3" />
      <!-- Zacken/Riffelung oben -->
      <g fill="#d9b160" stroke="none">
        <circle cx="13" cy="21.5" r="1.3" /><circle cx="18" cy="20.6" r="1.3" /><circle cx="22" cy="20.3" r="1.3" />
        <circle cx="26" cy="20.6" r="1.3" /><circle cx="31" cy="21.5" r="1.3" />
      </g>
      <!-- kleines Schäufelchen -->
      <g transform="rotate(20 33 14)">
        <rect x="31.6" y="7" width="2" height="10" rx="1" fill="#4d84bb" />
        <path d="M29.6 16 h5 l-0.8 4 a2 2 0 0 1 -1.7 1.5 h-0 a2 2 0 0 1 -1.7 -1.5 z" fill="#6aa8de" stroke="#3a6591" stroke-width="0.9" stroke-linejoin="round" />
      </g>
    </g>
  {:else if id === "ach-koelnerdom"}
    <g fill="#cbb48f" stroke="#9c8965" stroke-width="1.1" stroke-linejoin="round">
      <!-- Mittelschiff -->
      <rect x="18" y="20" width="8" height="17" />
      <!-- zwei Türme -->
      <rect x="9" y="14" width="7" height="23" />
      <rect x="28" y="14" width="7" height="23" />
      <!-- Turmspitzen -->
      <path d="M9 14 l3.5 -8 l3.5 8 z" fill="#b7a074" />
      <path d="M28 14 l3.5 -8 l3.5 8 z" fill="#b7a074" />
      <path d="M18 20 l4 -5 l4 5 z" fill="#b7a074" />
      <!-- Fenster/Portal -->
      <g fill="#8a7454" stroke="none">
        <path d="M20.6 37 v-6 a1.4 1.4 0 0 1 2.8 0 v6 z" />
        <rect x="11" y="20" width="3" height="5" rx="1.5" />
        <rect x="30" y="20" width="3" height="5" rx="1.5" />
      </g>
    </g>
  {:else if id === "ach-sandkasten"}
    <g>
      <!-- Sandfläche -->
      <rect x="7" y="18" width="30" height="17" rx="2" fill="#ecca7d" stroke="#c8993f" stroke-width="1.3" />
      <!-- Holzrahmen-Ecken (Sitzbretter) -->
      <g fill="#a06a34" stroke="#7d5122" stroke-width="1" stroke-linejoin="round">
        <path d="M5 16 h13 v4 h-13 z" />
        <path d="M26 16 h13 v4 h-13 z" />
        <path d="M5 33 h13 v4 h-13 z" />
        <path d="M26 33 h13 v4 h-13 z" />
      </g>
      <!-- kleine Sandburg drin -->
      <path d="M18 30 h8 v-4 h-8 z M18 26 h1.6 v-2 h1.6 v2 h1.6 v-2 h1.6 v2 h1.6" fill="#e2bd76" stroke="#c8993f" stroke-width="0.9" stroke-linejoin="round" />
      <!-- Förmchen -->
      <path d="M29 31 h4 l-0.7 3 h-2.6 z" fill="#e0654b" stroke="#b84d36" stroke-width="0.9" stroke-linejoin="round" />
    </g>
  {/if}
</svg>

<style>
  .ic {
    display: block;
    flex: none;
  }
</style>
