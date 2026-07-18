import { TICK_INTERVAL_MS } from "./constants";
import { forceSave, tick } from "./store";

let handle: ReturnType<typeof setInterval> | null = null;
let lastTime = 0;

/** Startet den 20-Hz-Tick-Loop (delta-basiert, robust gegen Tab-Wechsel). */
export function startLoop(): void {
  if (handle !== null) return;
  lastTime = Date.now();
  handle = setInterval(() => {
    const now = Date.now();
    const dt = Math.min((now - lastTime) / 1000, 5); // Sicherheitskappe 5s
    lastTime = now;
    tick(dt);
  }, TICK_INTERVAL_MS);

  // Bei Verlassen der Seite speichern.
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => forceSave());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") forceSave();
    });
  }
}

export function stopLoop(): void {
  if (handle !== null) {
    clearInterval(handle);
    handle = null;
  }
}
