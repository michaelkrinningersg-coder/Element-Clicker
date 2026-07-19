import { GENERATORS } from "./generators";
import type { GameState } from "./state";

/**
 * Achievements: dauerhaft (überleben Kollaps/Prestige). Jedes freigeschaltete
 * Achievement erhöht den Gesamt-Multiplikator auf Auto- UND Klick-Einkommen
 * um +0,1 (Start bei 1,0).
 */
export const GENERATOR_ACHIEVEMENT_THRESHOLDS = [1, 5, 10, 25, 50, 75, 100];
export const CLICK_ACHIEVEMENT_THRESHOLDS = [1, 10, 50, 100, 500, 1000, 5000, 10000];

/** Spielzeit-Schwellen (Sekunden) mit Label. */
export const TIME_ACHIEVEMENTS: Array<{ seconds: number; label: string }> = [
  { seconds: 3600, label: "1 Stunde" },
  { seconds: 36000, label: "10 Stunden" },
  { seconds: 86400, label: "1 Tag" },
  { seconds: 172800, label: "2 Tage" },
  { seconds: 604800, label: "1 Woche" },
  { seconds: 2592000, label: "1 Monat" },
  { seconds: 31536000, label: "1 Jahr" },
];

export type AchievementCategory = "generator" | "clicks" | "time";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  generatorId?: string;
  threshold: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  ...GENERATORS.flatMap((g) =>
    GENERATOR_ACHIEVEMENT_THRESHOLDS.map((t) => ({
      id: `gen_${g.id}_${t}`,
      name: `${g.name} ×${t}`,
      description: `Besitze ${t}× ${g.name}.`,
      category: "generator" as const,
      generatorId: g.id,
      threshold: t,
    })),
  ),
  ...CLICK_ACHIEVEMENT_THRESHOLDS.map((t) => ({
    id: `clicks_${t}`,
    name: `${t.toLocaleString("de-DE")} Klicks`,
    description: `Klicke insgesamt ${t.toLocaleString("de-DE")}×.`,
    category: "clicks" as const,
    threshold: t,
  })),
  ...TIME_ACHIEVEMENTS.map((t) => ({
    id: `time_${t.seconds}`,
    name: t.label,
    description: `Spiele insgesamt ${t.label}.`,
    category: "time" as const,
    threshold: t.seconds,
  })),
];

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;

/**
 * Prüft alle Achievement-Bedingungen und schaltet neu erfüllte frei.
 * Mutiert state.achievements (idempotent).
 */
export function evaluateAchievements(state: GameState): void {
  const earned = new Set(state.achievements);
  let changed = false;

  for (const g of GENERATORS) {
    const owned = state.generators[g.id].owned;
    for (const t of GENERATOR_ACHIEVEMENT_THRESHOLDS) {
      const id = `gen_${g.id}_${t}`;
      if (owned >= t && !earned.has(id)) {
        earned.add(id);
        changed = true;
      }
    }
  }
  for (const t of CLICK_ACHIEVEMENT_THRESHOLDS) {
    const id = `clicks_${t}`;
    if (state.totalClicks >= t && !earned.has(id)) {
      earned.add(id);
      changed = true;
    }
  }
  for (const t of TIME_ACHIEVEMENTS) {
    const id = `time_${t.seconds}`;
    if (state.playtimeSeconds >= t.seconds && !earned.has(id)) {
      earned.add(id);
      changed = true;
    }
  }

  if (changed) state.achievements = [...earned];
}
