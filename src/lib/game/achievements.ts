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
    id: "eierbecher",
    name: "Ein Eierbecher voll Sand",
    icon: "ach-eierbecher",
    threshold: new Decimal("4e6"),
    desc: "Ein Eierbecher (~50 g) randvoll mit Sand.",
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
    id: "vogelsand",
    name: "Ein Beutel Vogelsand",
    icon: "ach-vogelsand",
    threshold: new Decimal("2e8"),
    desc: "2 kg Vogelsand aus dem Zoohandel.",
  },
  {
    id: "sandsack",
    name: "Ein Sandsack",
    icon: "ach-sandsack",
    threshold: new Decimal("2.5e9"),
    desc: "25 kg gegen das Hochwasser.",
  },
  {
    id: "sandburg",
    name: "Eine Sandburg",
    icon: "ach-sandburg",
    threshold: new Decimal("6e9"),
    desc: "Türme, Zinnen, Burggraben – eine echte Sandburg.",
  },
  {
    id: "elefant",
    name: "Ein Elefant",
    icon: "ach-elefant",
    threshold: new Decimal("8e9"),
    desc: "So viel Sand wie ein afrikanischer Elefant wiegt.",
  },
  {
    id: "schubkarre",
    name: "Eine Schubkarre voll Sand",
    icon: "ach-schubkarre",
    threshold: new Decimal("1e10"),
    desc: "100 kg Sand – gut für den Rücken ist das nicht.",
  },
  {
    id: "koelner-dom",
    name: "Der Kölner Dom",
    icon: "ach-koelnerdom",
    threshold: new Decimal("65e9"),
    desc: "Zwei gotische Türme – nachgebaut aus Sand.",
  },
  {
    id: "sandsteinblock",
    name: "Ein Sandsteinblock",
    icon: "ach-sandsteinblock",
    threshold: new Decimal("1e11"),
    desc: "Eine Tonne massiver Sandstein.",
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
    id: "blauwal",
    name: "Ein Blauwal",
    icon: "ach-blauwal",
    threshold: new Decimal("3e12"),
    desc: "So viel Sand wie das größte Tier der Erde wiegt.",
  },
  {
    id: "beachvolleyball",
    name: "Ein Beachvolleyball-Feld",
    icon: "ach-beachvolleyball",
    threshold: new Decimal("4e12"),
    desc: "Das komplette Sandbett eines Spielfelds.",
  },
  {
    id: "glasscheibe",
    name: "Eine Glasscheibe (aus Sand geschmolzen)",
    icon: "ach-glasscheibe",
    threshold: new Decimal("3e13"),
    desc: "Aus Quarzsand bei 1700 °C zu Glas geschmolzen.",
  },
  {
    id: "eiffelturm",
    name: "Der Eiffelturm",
    icon: "ach-eiffelturm",
    threshold: new Decimal("5e13"),
    desc: "300 Meter Eisen – hier aus Sand geformt.",
  },
  {
    id: "cheops",
    name: "Die Cheops-Pyramide",
    icon: "ach-pyramide",
    threshold: new Decimal("600e12"),
    desc: "Das größte Bauwerk der Antike, Korn für Korn errichtet.",
  },
  {
    id: "sandbank",
    name: "Eine Sandbank",
    icon: "ach-sandbank",
    threshold: new Decimal("1e15"),
    desc: "Eine Sandbank im Meer – 10.000 Tonnen Sand.",
  },
  {
    id: "duene",
    name: "Eine Düne",
    icon: "ach-duene",
    threshold: new Decimal("15e15"),
    desc: "Vom Wind geformt: ein sanfter Sandhügel.",
  },
  {
    id: "saturnv",
    name: "Eine Saturn-V-Rakete",
    icon: "ach-saturnv",
    threshold: new Decimal("6e16"),
    desc: "110 Meter Mondrakete – nachgebaut aus Sand.",
  },
  {
    id: "wueste",
    name: "Ein Wüstenabschnitt",
    icon: "ach-wueste",
    threshold: new Decimal("1e17"),
    desc: "Eine Million Tonnen Sand – ein Stück Wüste.",
  },
  {
    id: "strand",
    name: "Ein Strand",
    icon: "ach-strand",
    threshold: new Decimal("200e15"),
    desc: "Kilometerweit nichts als Sand – ein ganzer Strand.",
  },
  {
    id: "goldengate",
    name: "Die Golden Gate Bridge",
    icon: "ach-goldengate",
    threshold: new Decimal("2e18"),
    desc: "Die berühmte Brücke – aus Sand nachgebildet.",
  },
  {
    id: "berg",
    name: "Ein ganzer Berg",
    icon: "ach-berg",
    threshold: new Decimal("5e19"),
    desc: "Ein kompletter Berg aus Sand.",
  },
  {
    id: "sahara",
    name: "Die Sahara",
    icon: "ach-sahara",
    threshold: new Decimal("1e27"),
    desc: "Die größte Sandwüste der Erde. Unvorstellbar.",
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

/**
 * Effektive Abschlüsse eines Bauwerks: gebankt (frühere Runs) + 1, falls in
 * diesem Run bereits erreicht. So wirkt der Bonus sofort und bleibt über Prestige.
 */
export function effectiveCompletions(state: GameState, achId: string): number {
  const banked = state.completions?.[achId] ?? 0;
  const a = ACHIEVEMENTS.find((x) => x.id === achId);
  const reached = a ? state.runSandEver.gte(a.threshold) : false;
  return banked + (reached ? 1 : 0);
}
