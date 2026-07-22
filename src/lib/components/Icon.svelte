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
  {/if}
</svg>

<style>
  .ic {
    display: block;
    flex: none;
  }
</style>
