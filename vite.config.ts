import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// base: "./" -> relative Pfade, damit der Build auch unter einem
// Unterpfad (z.B. GitHub Pages) und beim lokalen Öffnen funktioniert.
export default defineConfig({
  base: "./",
  plugins: [svelte()],
});
