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

// Nach Schwelle aufsteigend sortiert.
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "sanduhr",
    name: "Eine Sanduhr",
    icon: "ach-sanduhr",
    threshold: new Decimal("1e6"),
    desc: "Genug Sand, um die Zeit rinnen zu lassen.",
  },
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
    id: "sandkuchen",
    name: "Ein Sandkuchen",
    icon: "ach-sandkuchen",
    threshold: new Decimal("48e6"),
    desc: "Aus dem Förmchen gestürzt – der perfekte Sandkuchen.",
  },
  {
    id: "sandburg",
    name: "Eine Sandburg",
    icon: "ach-sandburg",
    threshold: new Decimal("6e9"),
    desc: "Türme, Zinnen, Burggraben – eine echte Sandburg.",
  },
  {
    id: "koelner-dom",
    name: "Der Kölner Dom",
    icon: "ach-koelnerdom",
    threshold: new Decimal("65e9"),
    desc: "Zwei gotische Türme – nachgebaut aus Sand.",
  },
  {
    id: "sandkasten",
    name: "Ein Sandkasten",
    icon: "ach-sandkasten",
    threshold: new Decimal("110e9"),
    desc: "Der ganze Spielplatz-Sandkasten, randvoll.",
  },
  {
    id: "sphinx",
    name: "Die Sphinx",
    icon: "ach-sphinx",
    threshold: new Decimal("400e9"),
    desc: "Der große Wächter von Gizeh – aus reinem Sand.",
  },
  {
    id: "lkw",
    name: "Ein LKW voll Sand",
    icon: "ach-lkw",
    threshold: new Decimal("2.4e12"),
    desc: "Eine ganze Ladung – Sand für die Baustelle.",
  },
  {
    id: "cheops",
    name: "Die Cheops-Pyramide",
    icon: "ach-pyramide",
    threshold: new Decimal("600e12"),
    desc: "Das größte Bauwerk der Antike, Korn für Korn errichtet.",
  },
  {
    id: "duene",
    name: "Eine Düne",
    icon: "ach-duene",
    threshold: new Decimal("15e15"),
    desc: "Vom Wind geformt: ein sanfter Sandhügel.",
  },
  {
    id: "strand",
    name: "Ein Strand",
    icon: "ach-strand",
    threshold: new Decimal("200e15"),
    desc: "Kilometerweit nichts als Sand – ein ganzer Strand.",
  },
];

/** Ist der Erfolg freigeschaltet? (nach in diesem Run gesammeltem Sand, Reset bei Prestige) */
export function isUnlocked(state: GameState, a: AchievementDef): boolean {
  return state.runSandEver.gte(a.threshold);
}

/** Anzahl freigeschalteter Erfolge. */
export function unlockedCount(state: GameState): number {
  let n = 0;
  for (const a of ACHIEVEMENTS) if (isUnlocked(state, a)) n++;
  return n;
}
