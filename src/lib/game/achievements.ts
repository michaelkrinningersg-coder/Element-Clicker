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
    id: "reagenzglas",
    name: "Ein Reagenzglas voll Sand",
    icon: "ach-reagenzglas",
    threshold: new Decimal("2e6"),
    desc: "Ein Reagenzglas (≈ 20 g) für den Laborsand.",
  },
  {
    id: "eierbecher",
    name: "Ein Eierbecher voll Sand",
    icon: "ach-eierbecher",
    threshold: new Decimal("4e6"),
    desc: "Ein Eierbecher (≈ 40 g) randvoll mit Sand.",
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
    id: "schubkarre",
    name: "Eine Schubkarre voll Sand",
    icon: "ach-schubkarre",
    threshold: new Decimal("1e10"),
    desc: "100 kg Sand – gut für den Rücken ist das nicht.",
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
    desc: "Der ganze Spielplatz-Sandkasten, randvoll (≈ 1,1 t).",
  },
  {
    id: "elefant",
    name: "Ein Elefant",
    icon: "ach-elefant",
    threshold: new Decimal("6e11"),
    desc: "≈ 6 t – so viel Sand wie ein afrikanischer Elefant wiegt.",
  },
  {
    id: "lkw",
    name: "Ein LKW voll Sand",
    icon: "ach-lkw",
    threshold: new Decimal("2.4e12"),
    desc: "Eine ganze Ladung (≈ 24 t) – Sand für die Baustelle.",
  },
  {
    id: "beachvolleyball",
    name: "Ein Beachvolleyball-Feld",
    icon: "ach-beachvolleyball",
    threshold: new Decimal("4e12"),
    desc: "Das komplette Sandbett eines Spielfelds (≈ 40 t).",
  },
  {
    id: "gueterwaggon",
    name: "Ein Güterwaggon voll Sand",
    icon: "ach-gueterwaggon",
    threshold: new Decimal("6e12"),
    desc: "Eine Waggonladung (≈ 60 t) auf der Schiene.",
  },
  {
    id: "blauwal",
    name: "Ein Blauwal",
    icon: "ach-blauwal",
    threshold: new Decimal("1.5e13"),
    desc: "≈ 150 t – so viel wie ein Blauwal, das größte Tier der Erde.",
  },
  {
    id: "glasscheibe",
    name: "Eine Glasscheibe (aus Sand geschmolzen)",
    icon: "ach-glasscheibe",
    threshold: new Decimal("3e13"),
    desc: "Aus Quarzsand bei 1700 °C zu Glas geschmolzen (≈ 300 t).",
  },
  {
    id: "saturnv",
    name: "Eine Saturn-V-Rakete",
    icon: "ach-saturnv",
    threshold: new Decimal("3e14"),
    desc: "≈ 2.970 t – so schwer wie eine startbereite Saturn V.",
  },
  {
    id: "sandbank",
    name: "Eine Sandbank",
    icon: "ach-sandbank",
    threshold: new Decimal("1e15"),
    desc: "Eine Sandbank im Meer – ≈ 10.000 t Sand.",
  },
  {
    id: "eiffelturm",
    name: "Der Eiffelturm",
    icon: "ach-eiffelturm",
    threshold: new Decimal("1.01e15"),
    desc: "≈ 10.100 t – die Gesamtmasse des Eiffelturms.",
  },
  {
    id: "sphinx",
    name: "Die Sphinx",
    icon: "ach-sphinx",
    threshold: new Decimal("3e15"),
    desc: "≈ 30.000 t Kalkstein – der große Wächter von Gizeh.",
  },
  {
    id: "sandfrachter",
    name: "Ein Sandfrachter",
    icon: "ach-sandfrachter",
    threshold: new Decimal("5e15"),
    desc: "Ein Frachtschiff randvoll mit Sand (≈ 50.000 t).",
  },
  {
    id: "silizium",
    name: "Silizium-Chips (aus Sand)",
    icon: "ach-silizium",
    threshold: new Decimal("8e15"),
    desc: "Quarzsand raffiniert zu Silizium für Mikrochips.",
  },
  {
    id: "duene",
    name: "Eine Düne",
    icon: "ach-duene",
    threshold: new Decimal("15e15"),
    desc: "Vom Wind geformt: ein Sandhügel (≈ 150.000 t).",
  },
  {
    id: "koelner-dom",
    name: "Der Kölner Dom",
    icon: "ach-koelnerdom",
    threshold: new Decimal("3e16"),
    desc: "≈ 300.000 t Baumasse der gotischen Kathedrale.",
  },
  {
    id: "goldengate",
    name: "Die Golden Gate Bridge",
    icon: "ach-goldengate",
    threshold: new Decimal("8e16"),
    desc: "≈ 805.000 t – die Masse der berühmten Brücke.",
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
    desc: "Kilometerweit nichts als Sand – ein ganzer Strand (≈ 2 Mio. t).",
  },
  {
    id: "cheops",
    name: "Die Cheops-Pyramide",
    icon: "ach-pyramide",
    threshold: new Decimal("5.9e17"),
    desc: "≈ 5,9 Mio. t Kalkstein – das größte Bauwerk der Antike.",
  },
  {
    id: "alle-straende",
    name: "Alle Strände der Erde",
    icon: "ach-straende",
    threshold: new Decimal("7.5e18"),
    desc: "≈ 7,5·10¹⁸ Körner – die berühmte Schätzung für alle Strände.",
  },
  {
    id: "kuenstliche-insel",
    name: "Eine künstliche Insel (Palm Jumeirah)",
    icon: "ach-insel",
    threshold: new Decimal("1.5e19"),
    desc: "Aufgeschüttet aus ≈ 150 Mio. t Meeressand.",
  },
  {
    id: "berg",
    name: "Ein ganzer Berg",
    icon: "ach-berg",
    threshold: new Decimal("5e19"),
    desc: "Ein kompletter Berg aus Sand (≈ 500 Mrd. t).",
  },
  {
    id: "sterne",
    name: "Mehr Körner als Sterne im Universum",
    icon: "ach-sterne",
    threshold: new Decimal("1e24"),
    desc: "Mehr Sandkörner, als es Sterne im beobachtbaren Universum gibt.",
  },
  {
    id: "namib",
    name: "Die Namib-Wüste",
    icon: "ach-namib",
    threshold: new Decimal("3e25"),
    desc: "Rote Dünen so weit das Auge reicht.",
  },
  {
    id: "sahara",
    name: "Die Sahara",
    icon: "ach-sahara",
    threshold: new Decimal("1e27"),
    desc: "Die größte Sandwüste der Erde. Unvorstellbar.",
  },
  {
    id: "aller-sand",
    name: "Aller Sand der Erde",
    icon: "ach-allersand",
    threshold: new Decimal("1e28"),
    desc: "Sämtlicher Sand des Planeten – Strände, Wüsten, Meeresgrund.",
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
