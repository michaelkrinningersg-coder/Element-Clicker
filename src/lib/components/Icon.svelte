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
  {:else if id === "radlader"}
    <g>
      <!-- Schaufelarm + Ladeschaufel -->
      <path d="M4 26 l7 -3 v4 l-6 3 z" fill="#c9922f" stroke="#a67f3c" stroke-width="1.2" stroke-linejoin="round" />
      <line x1="10" y1="24" x2="20" y2="26" stroke="#a67f3c" stroke-width="2" stroke-linecap="round" />
      <!-- Karosserie -->
      <path d="M18 20 h14 a2 2 0 0 1 2 2 v9 h-18 v-9 a2 2 0 0 1 2 -2 z" fill="#f2c94c" stroke="#d9a93a" stroke-width="1.3" stroke-linejoin="round" />
      <rect x="21" y="22" width="6" height="5" rx="1" fill="#bfe0f2" stroke="#d9a93a" stroke-width="1" />
      <!-- große Räder -->
      <circle cx="20" cy="33" r="4.6" fill="#3f3123" stroke="#2a2016" stroke-width="1.3" />
      <circle cx="31" cy="33" r="4.6" fill="#3f3123" stroke="#2a2016" stroke-width="1.3" />
      <circle cx="20" cy="33" r="1.6" fill="#c9b89a" /><circle cx="31" cy="33" r="1.6" fill="#c9b89a" />
    </g>
  {:else if id === "muldenkipper"}
    <g>
      <!-- Kippmulde mit Sand -->
      <path d="M15 15 h22 l-2 12 h-20 z" fill="#cf9a3a" stroke="#a67f3c" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M16.5 16 q9 5 18 0 q0 2 -9 2 q-9 0 -9 -2 z" fill="#ecca7d" stroke="none" />
      <!-- Fahrerhaus -->
      <path d="M6 24 h9 v7 h-11 v-4 a3 3 0 0 1 2 -3 z" fill="#4d84bb" stroke="#3a6591" stroke-width="1.2" stroke-linejoin="round" />
      <rect x="7" y="25.5" width="5" height="3.5" rx="1" fill="#bfe0f2" stroke="#3a6591" stroke-width="0.9" />
      <!-- Räder -->
      <circle cx="12" cy="34" r="4" fill="#3f3123" stroke="#2a2016" stroke-width="1.2" />
      <circle cx="24" cy="34" r="4" fill="#3f3123" stroke="#2a2016" stroke-width="1.2" />
      <circle cx="32" cy="34" r="4" fill="#3f3123" stroke="#2a2016" stroke-width="1.2" />
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
  {:else if id === "ach-eierbecher"}
    <g>
      <path d="M16 20 h12 l-2 9 a6 6 0 0 1 -8 0 z" fill="#f2efe6" stroke="#cbb48f" stroke-width="1.3" stroke-linejoin="round" />
      <rect x="17" y="30" width="10" height="2.4" rx="1" fill="#f2efe6" stroke="#cbb48f" stroke-width="1" />
      <path d="M18 33 h8 v3 h-8 z" fill="#e8e2d2" stroke="#cbb48f" stroke-width="1" stroke-linejoin="round" />
      <path d="M16.5 20.5 q5.5 3 11 0 q0 2 -5.5 2 q-5.5 0 -5.5 -2 z" fill="#ecca7d" />
      <path d="M18.5 18 q3.5 -3 7 0 q-3.5 2 -7 0 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="0.8" />
    </g>
  {:else if id === "ach-vogelsand"}
    <g>
      <path d="M14 16 h16 v20 a2 2 0 0 1 -2 2 h-12 a2 2 0 0 1 -2 -2 z" fill="#d9c7a0" stroke="#b39b6a" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M14 16 l3 -3 h10 l3 3 z" fill="#e6d6b3" stroke="#b39b6a" stroke-width="1.1" stroke-linejoin="round" />
      <circle cx="22" cy="27" r="4" fill="#6aa8de" />
      <circle cx="20.5" cy="26" r="0.8" fill="#123" />
      <path d="M25.5 26 l3 -1 -3 -1 z" fill="#e0a838" />
      <path d="M18 29 q-3 1 -4 3" stroke="#4d84bb" stroke-width="1.4" fill="none" stroke-linecap="round" />
    </g>
  {:else if id === "ach-sandsack"}
    <g>
      <path d="M12 22 q10 -6 20 0 q3 12 -2 15 h-16 q-5 -3 -2 -15 z" fill="#c9b283" stroke="#a3895a" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M17 18 q5 -3 10 0 l-2 5 q-3 -2 -6 0 z" fill="#b39b6a" stroke="#8f7548" stroke-width="1.2" stroke-linejoin="round" />
      <line x1="16" y1="20" x2="28" y2="20" stroke="#8f7548" stroke-width="1.2" />
      <g stroke="#a3895a" stroke-width="0.8" opacity="0.6"><path d="M15 28 h14 M14 32 h16" /></g>
    </g>
  {:else if id === "ach-schubkarre"}
    <g>
      <path d="M10 20 h20 l-4 9 h-12 z" fill="#8a939c" stroke="#5f676e" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M11 21 q9 5 18 0 q0 2 -9 2 q-9 0 -9 -2 z" fill="#ecca7d" />
      <path d="M14 20 q6 -4 12 0 q-6 2 -12 0 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="0.8" />
      <line x1="26" y1="27" x2="35" y2="31" stroke="#7d5122" stroke-width="2" stroke-linecap="round" />
      <line x1="14" y1="29" x2="9" y2="34" stroke="#5f676e" stroke-width="1.6" stroke-linecap="round" />
      <circle cx="16" cy="33" r="3.6" fill="#3f3123" stroke="#2a2016" stroke-width="1.2" />
      <circle cx="16" cy="33" r="1.2" fill="#c9b89a" />
    </g>
  {:else if id === "ach-sandsteinblock"}
    <g>
      <path d="M10 18 l12 -4 l12 4 v14 l-12 4 l-12 -4 z" fill="#e0c58a" stroke="#c8993f" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M10 18 l12 4 l12 -4 M22 22 v14" fill="none" stroke="#c8993f" stroke-width="1.1" />
      <g stroke="#c8993f" stroke-width="0.6" opacity="0.4"><path d="M11 24 l11 3.6 M33 24 l-11 3.6" /></g>
    </g>
  {:else if id === "ach-elefant"}
    <g fill="#9aa3ab" stroke="#6f767d" stroke-width="1.3" stroke-linejoin="round">
      <ellipse cx="23" cy="24" rx="11" ry="8" />
      <circle cx="13" cy="22" r="6" />
      <path d="M10 24 q-3 4 -1 9 q1 2 2 0 q0 -3 2 -5 z" />
      <rect x="17" y="30" width="3" height="6" rx="1.2" />
      <rect x="27" y="30" width="3" height="6" rx="1.2" />
      <path d="M12 17 q5 -3 8 1 z" />
      <circle cx="12" cy="21" r="0.9" fill="#3a3f44" stroke="none" />
    </g>
  {:else if id === "ach-blauwal"}
    <g>
      <path d="M6 24 q10 -8 24 -3 q6 2 8 -1 q-2 5 -6 5 q1 3 -1 5 q-3 -2 -4 -4 q-12 4 -21 -1 q-3 -2 0 -6 z" fill="#4d84bb" stroke="#3a6591" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M8 24 q8 3 18 1" fill="none" stroke="#bfe0f2" stroke-width="1" opacity="0.7" />
      <circle cx="12" cy="23" r="1" fill="#0d1b2a" />
    </g>
  {:else if id === "ach-beachvolleyball"}
    <g>
      <path d="M6 32 q10 -4 20 0 q6 2 12 0 v6 h-32 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1.2" stroke-linejoin="round" />
      <circle cx="20" cy="19" r="9" fill="#fbf5e9" stroke="#4d84bb" stroke-width="1.3" />
      <path d="M20 10 q4 9 0 18 M12 15 q8 4 16 0 M12 23 q8 -4 16 0" fill="none" stroke="#4d84bb" stroke-width="1.1" />
    </g>
  {:else if id === "ach-glasscheibe"}
    <g>
      <rect x="12" y="8" width="20" height="28" rx="1.5" fill="#cfeef2" stroke="#7fbcc7" stroke-width="1.4" opacity="0.85" />
      <path d="M16 11 h6 l-10 14 v-6 z" fill="#ffffff" opacity="0.55" />
      <path d="M26 11 h3 l-14 22 h-3 z" fill="#ffffff" opacity="0.4" />
    </g>
  {:else if id === "ach-eiffelturm"}
    <g stroke="#8a6d3b" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="7" x2="22" y2="12" />
      <path d="M22 12 C 19 20 16 30 13 37" />
      <path d="M22 12 C 25 20 28 30 31 37" />
      <path d="M18 24 H 26" />
      <path d="M15 32 H 29" />
      <path d="M16 37 Q 22 30 28 37" />
      <circle cx="22" cy="6.5" r="1.2" fill="#8a6d3b" stroke="none" />
    </g>
  {:else if id === "ach-saturnv"}
    <g>
      <path d="M22 6 q5 6 5 16 v10 h-10 v-10 q0 -10 5 -16 z" fill="#f2efe6" stroke="#b9b2a3" stroke-width="1.3" stroke-linejoin="round" />
      <rect x="17" y="22" width="10" height="2" fill="#c94f3a" />
      <circle cx="22" cy="16" r="2.4" fill="#6aa8de" stroke="#3a6591" stroke-width="1" />
      <path d="M17 26 l-4 6 4 0 z M27 26 l4 6 -4 0 z" fill="#e0654b" stroke="#b84d36" stroke-width="1" stroke-linejoin="round" />
      <rect x="19" y="32" width="6" height="3" fill="#8a939c" />
      <path d="M20 35 q2 5 4 0 q-2 3 -4 0 z" fill="#f2a54c" />
    </g>
  {:else if id === "ach-sandbank"}
    <g>
      <rect x="3" y="10" width="38" height="26" fill="#6cc3d4" />
      <g fill="none" stroke="#bfe9f0" stroke-width="1" opacity="0.7"><path d="M6 15 q3 -1.5 6 0 t6 0 t6 0 t6 0" /></g>
      <path d="M8 30 q14 -8 28 0 q-4 5 -14 5 q-10 0 -14 -5 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1.2" stroke-linejoin="round" />
      <g fill="#cf9f45" opacity="0.5"><circle cx="20" cy="30" r="0.8" /><circle cx="24" cy="31" r="0.8" /><circle cx="17" cy="31.5" r="0.8" /></g>
    </g>
  {:else if id === "ach-wueste"}
    <g>
      <circle cx="33" cy="12" r="4" fill="#f2c94c" />
      <path d="M3 30 q8 -8 15 -3 q6 4 11 -1 q5 -4 8 1 v9 h-34 z" fill="#e6c684" stroke="#cf9f45" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M3 34 q10 -4 18 -1 q9 3 16 -2 v6 h-34 z" fill="#d9b160" opacity="0.7" stroke="none" />
    </g>
  {:else if id === "ach-goldengate"}
    <g stroke="#c0392b" stroke-width="1.5" fill="none" stroke-linecap="round">
      <line x1="13" y1="10" x2="13" y2="30" />
      <line x1="31" y1="10" x2="31" y2="30" />
      <path d="M4 28 Q 13 14 22 22 Q 31 30 40 16" />
      <line x1="4" y1="30" x2="40" y2="30" />
      <g stroke-width="0.9"><line x1="9" y1="24" x2="9" y2="30" /><line x1="17" y1="23" x2="17" y2="30" /><line x1="26" y1="23" x2="26" y2="30" /><line x1="35" y1="22" x2="35" y2="30" /></g>
      <line x1="11" y1="14" x2="15" y2="14" /><line x1="29" y1="14" x2="33" y2="14" />
    </g>
  {:else if id === "ach-berg"}
    <g>
      <path d="M4 36 L18 12 L26 26 L31 19 L40 36 z" fill="#8a939c" stroke="#5f676e" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M18 12 l4 7 -3 2 -3 -3 -2 3 z" fill="#f2efe6" stroke="none" />
      <path d="M31 19 l3 5 -2 1 -2 -2 z" fill="#f2efe6" stroke="none" />
    </g>
  {:else if id === "ach-sahara"}
    <g>
      <circle cx="32" cy="13" r="5" fill="#f2a54c" />
      <path d="M3 28 q9 -9 17 -3 q7 5 12 -2 q4 -4 8 0 v13 h-37 z" fill="#e8b866" stroke="#cf9f45" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M3 33 q11 -5 20 -1 q9 4 15 -2 v8 h-35 z" fill="#d9a24e" opacity="0.7" stroke="none" />
      <line x1="12" y1="30" x2="11" y2="22" stroke="#7d5122" stroke-width="1.6" stroke-linecap="round" />
      <g stroke="#5aa06a" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M11 22 q-4 -2 -6 0 M11 22 q4 -2 6 0 M11 22 q-2 -4 -1 -6 M11 22 q3 -3 5 -3" /></g>
    </g>
  {:else if id === "ach-reagenzglas"}
    <g transform="rotate(12 22 22)">
      <path d="M19 8 h6 v20 a3 3 0 0 1 -6 0 z" fill="none" stroke="#8fbcc7" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M19.2 20 h5.6 v8 a2.8 2.8 0 0 1 -5.6 0 z" fill="#ecca7d" />
      <rect x="18" y="6.5" width="8" height="2.6" rx="1" fill="#cbb48f" stroke="#a3895a" stroke-width="0.8" />
    </g>
  {:else if id === "ach-gueterwaggon"}
    <g>
      <rect x="8" y="18" width="28" height="12" rx="1.5" fill="#8a5a3a" stroke="#5f3d27" stroke-width="1.3" />
      <path d="M9 18 q13 5 26 0 q0 2 -13 2 q-13 0 -13 -2 z" fill="#ecca7d" />
      <g stroke="#5f3d27" stroke-width="0.8" opacity="0.5"><path d="M15 20 v10 M22 20 v10 M29 20 v10" /></g>
      <circle cx="14" cy="33" r="3" fill="#3f3123" stroke="#2a2016" stroke-width="1.1" />
      <circle cx="30" cy="33" r="3" fill="#3f3123" stroke="#2a2016" stroke-width="1.1" />
    </g>
  {:else if id === "ach-sandfrachter"}
    <g>
      <path d="M6 28 h30 l-3 6 h-24 z" fill="#4d84bb" stroke="#3a6591" stroke-width="1.3" stroke-linejoin="round" />
      <rect x="10" y="20" width="18" height="8" fill="#c9b283" stroke="#a3895a" stroke-width="1.1" />
      <path d="M11 20 q8 3 16 0 q0 1.5 -8 1.5 q-8 0 -8 -1.5 z" fill="#ecca7d" stroke="none" />
      <rect x="28" y="16" width="6" height="12" fill="#f2efe6" stroke="#b9b2a3" stroke-width="1" />
      <g stroke="#bfe0f2" stroke-width="1" opacity="0.6" fill="none"><path d="M6 35 q4 1.5 8 0 t8 0 t8 0" /></g>
    </g>
  {:else if id === "ach-silizium"}
    <g>
      <rect x="13" y="13" width="18" height="18" rx="2" fill="#3a3f44" stroke="#22262a" stroke-width="1.3" />
      <rect x="17" y="17" width="10" height="10" rx="1" fill="#6aa8de" stroke="#3a6591" stroke-width="1" />
      <g stroke="#c9b89a" stroke-width="1.4" stroke-linecap="round"><path d="M16 13 v-3 M20 13 v-3 M24 13 v-3 M28 13 v-3 M16 31 v3 M20 31 v3 M24 31 v3 M28 31 v3 M13 16 h-3 M13 20 h-3 M13 24 h-3 M13 28 h-3 M31 16 h3 M31 20 h3 M31 24 h3 M31 28 h3" /></g>
    </g>
  {:else if id === "ach-straende"}
    <g>
      <rect x="3" y="8" width="38" height="14" fill="#6cc3d4" />
      <g fill="none" stroke="#bfe9f0" stroke-width="1" opacity="0.7"><path d="M5 13 q4 -2 8 0 t8 0 t8 0 t8 0" /><path d="M5 18 q4 -2 8 0 t8 0 t8 0 t8 0" /></g>
      <path d="M3 22 q19 8 38 0 v14 h-38 z" fill="#ecca7d" stroke="#cf9f45" stroke-width="1.2" stroke-linejoin="round" />
      <line x1="31" y1="24" x2="31" y2="31" stroke="#9a6f2e" stroke-width="1.2" stroke-linecap="round" />
      <path d="M27 25 a4 4 0 0 1 8 0 z" fill="#e0654b" stroke="#b84d36" stroke-width="0.8" stroke-linejoin="round" />
    </g>
  {:else if id === "ach-insel"}
    <g>
      <rect x="3" y="10" width="38" height="26" fill="#6cc3d4" />
      <ellipse cx="22" cy="30" rx="14" ry="6" fill="#ecca7d" stroke="#cf9f45" stroke-width="1.2" />
      <line x1="22" y1="28" x2="20" y2="16" stroke="#7d5122" stroke-width="1.8" stroke-linecap="round" />
      <g stroke="#5aa06a" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M20 16 q-6 -3 -9 0 M20 16 q6 -3 9 0 M20 16 q-3 -6 -1 -9 M20 16 q4 -5 8 -4" /></g>
    </g>
  {:else if id === "ach-sterne"}
    <g>
      <rect x="4" y="6" width="36" height="32" rx="3" fill="#1b2a4a" />
      <g fill="#fdf3dd">
        <circle cx="12" cy="12" r="1.4" /><circle cx="24" cy="10" r="1" /><circle cx="33" cy="15" r="1.5" />
        <circle cx="16" cy="22" r="1" /><circle cx="28" cy="24" r="1.4" /><circle cx="10" cy="30" r="1.2" />
        <circle cx="22" cy="33" r="1" /><circle cx="35" cy="30" r="1" /><circle cx="19" cy="15" r="0.8" />
        <circle cx="31" cy="21" r="0.8" /><circle cx="8" cy="20" r="0.8" />
      </g>
      <path d="M22 17 l1.2 3 3 0.4 -2.2 2 0.6 3 -2.6 -1.6 -2.6 1.6 0.6 -3 -2.2 -2 3 -0.4 z" fill="#f2c94c" />
    </g>
  {:else if id === "ach-namib"}
    <g>
      <circle cx="34" cy="11" r="4" fill="#f2a54c" />
      <path d="M3 30 q9 -10 17 -3 q7 6 12 -3 q3 -3 8 1 v11 h-40 z" fill="#d98a4e" stroke="#b06a34" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M3 34 q11 -5 20 -1 q9 4 15 -3 v9 h-38 z" fill="#c2703a" opacity="0.7" stroke="none" />
    </g>
  {:else if id === "ach-allersand"}
    <g>
      <circle cx="22" cy="22" r="15" fill="#e6c684" stroke="#cf9f45" stroke-width="1.4" />
      <path d="M12 16 q6 3 12 0 q4 4 9 2 M9 24 q8 4 16 0 q4 3 10 1 M14 31 q6 2 12 0" fill="none" stroke="#cf9f45" stroke-width="1" opacity="0.6" />
      <g fill="#cf9f45" opacity="0.5"><circle cx="18" cy="20" r="0.9" /><circle cx="27" cy="24" r="0.9" /><circle cx="20" cy="28" r="0.9" /></g>
    </g>
  {/if}
</svg>

<style>
  .ic {
    display: block;
    flex: none;
  }
</style>
