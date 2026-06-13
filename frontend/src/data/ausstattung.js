// Ausstattung (analog "UPGRADES") und Personal — die Original-
// Klomanager-Klassiker: Klobrille in drei Stufen, Seidenpapier,
// Seifenspender, Händetrockner, Cond-O-Mat & Co.
//
// AUSSTATTUNG ist wie UPGRADES in Kiez Manager nach WC-Typ
// aufgeschlüsselt, damit der Reducer unverändert
// `AUSSTATTUNG[toilette.typ]?.find(...)` nutzen kann. Die Basis-
// Liste gilt für alle Typen, ein paar Extras sind typ-spezifisch.

const BASIS = [
  {
    id: 'brille-holz',
    name: 'Klobrille: Holz',
    kosten: 1500,
    revenueBonus: 30,
    beschreibung: 'Schon mal kein nacktes Plastik mehr. Erster Schritt zur Würde.',
  },
  {
    id: 'brille-marmor',
    name: 'Klobrille: Marmor',
    kosten: 6000,
    revenueBonus: 90,
    beschreibung: 'Kühl, edel, fotogen. Gäste sitzen länger — und zahlen lieber.',
  },
  {
    id: 'brille-gold',
    name: 'Klobrille: Gold',
    kosten: 18000,
    revenueBonus: 220,
    beschreibung: 'Pures Protzen. Manche posten ein Selfie davon. Manche stehlen sie.',
  },
  {
    id: 'seidenpapier',
    name: 'Seidentoilettenpapier',
    kosten: 2000,
    revenueBonus: 40,
    beschreibung: 'Weich wie eine Umarmung. Kratzpapier war gestern.',
  },
  {
    id: 'seifenspender',
    name: 'Seifenspender',
    kosten: 1200,
    revenueBonus: 25,
    beschreibung: 'Hygiene zieht zahlende Stammkundschaft an. Wer hätte das gedacht.',
  },
  {
    id: 'haendetrockner',
    name: 'Händetrockner (Heißluft)',
    kosten: 3500,
    revenueBonus: 60,
    beschreibung: 'Lauter als nötig, aber die Gäste fühlen sich modern.',
  },
  {
    id: 'spiegel',
    name: 'Beleuchteter Spiegel',
    kosten: 2500,
    revenueBonus: 45,
    beschreibung: 'Gutes Licht kaschiert vieles. Auch die Bahnhofsmüdigkeit.',
  },
  {
    id: 'musik',
    name: 'Hintergrundmusik',
    kosten: 1800,
    revenueBonus: 35,
    beschreibung: 'Dezente Fahrstuhlmusik übertönt... alles, was übertönt werden sollte.',
  },
  {
    id: 'cond-o-mat',
    name: 'Cond-O-Mat',
    kosten: 4000,
    revenueBonus: 110,
    beschreibung: 'Der diskrete Klassiker. Läuft immer. Wirklich immer.',
  },
]

const WICKELTISCH = {
  id: 'wickeltisch',
  name: 'Wickeltisch',
  kosten: 3000,
  revenueBonus: 70,
  beschreibung: 'Eltern in Not zahlen, was verlangt wird. Sauberkeit ist hier Pflicht.',
}

const GETRAENKEHALTER = {
  id: 'getraenkehalter',
  name: 'Klobrille mit Getränkehalter',
  kosten: 9000,
  revenueBonus: 150,
  beschreibung: 'Das berühmte Upgrade aus der Windows-2000-Version. ' +
    'Niemand hat danach gefragt. Alle lieben es.',
}

// Pro WC-Typ: Basisliste + typ-spezifische Extras
export const AUSSTATTUNG = {
  standard: [...BASIS],
  pissoir: [...BASIS],
  luxus: [...BASIS, GETRAENKEHALTER],
  behinderten: [...BASIS, WICKELTISCH],
  familien: [...BASIS, WICKELTISCH],
  dusche: [...BASIS, GETRAENKEHALTER],
}

// Personal — analog PERSONAL_OPTIONEN
export const PERSONAL_OPTIONEN = [
  {
    id: 'klofrau',
    name: 'Klofrau / Klomann',
    tageskosten: 80,
    revenueBonus: 30,
    beschreibung: 'Hält den Laden sauber und der Trinkgeldteller klingelt von selbst.',
  },
  {
    id: 'kassierer',
    name: 'Pförtner/Kassierer',
    tageskosten: 120,
    revenueBonus: 60,
    beschreibung: 'Kassiert zuverlässiger als jede Ehrlichkeitsbox.',
  },
  {
    id: 'wachdienst',
    name: 'Wachdienst',
    tageskosten: 150,
    revenueBonus: 10,
    vandalismusReduktion: 0.5,
    beschreibung: 'Hält Vandalen fern. Mit Blick und manchmal mit Diensthund.',
  },
]
