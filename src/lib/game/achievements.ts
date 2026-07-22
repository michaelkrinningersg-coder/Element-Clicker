import { Decimal } from "./decimal";
import type { GameState } from "./state";

/**
 * "Bauwerke aus Sand" – Erfolge, die sich an der insgesamt gesammelten
 * Sandmenge (totalSandEver) freischalten. Reine Sammel-Meilensteine.
 */
export interface AchievementDef {
  id: string;
  name: string;
  icon: string; // Icon-Id (siehe Icon.svelte)
  threshold: Decimal; // benötigte gesamt gesammelte Sandkörner
  desc: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "schaufel-voll",
    name: "Eine Schaufel voll Sand",
    icon: "ach-schaufel",
    threshold: new Decimal("5e6"),
    desc: "Genug Sand für eine ordentliche Schaufel voll.",
  },
  {
    id: "eimer-voll",
    name: "Ein Eimer voll Sand",
    icon: "ach-eimer",
    threshold: new Decimal("30e6"),
    desc: "Ein randvoll gefüllter Eimer – bereit für die Burg.",
  },
  {
    id: "sandburg",
    name: "Eine Sandburg",
    icon: "ach-sandburg",
    threshold: new Decimal("6e9"),
    desc: "Türme, Zinnen, Burggraben – eine echte Sandburg.",
  },
];

/** Ist der Erfolg (nach gesamt gesammeltem Sand) freigeschaltet? */
export function isUnlocked(state: GameState, a: AchievementDef): boolean {
  return state.totalSandEver.gte(a.threshold);
}

/** Anzahl freigeschalteter Erfolge. */
export function unlockedCount(state: GameState): number {
  let n = 0;
  for (const a of ACHIEVEMENTS) if (isUnlocked(state, a)) n++;
  return n;
}
