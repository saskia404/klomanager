// TOILETTEN = die kaufbaren Objekte (analog "VENUES" in Kiez Manager).
// Jede Toilette gehört zu einem Standort und hat einen WC-Typ, der
// die Tagesform (Sonntag vs. Spieltag etc.) und das Risiko-Profil
// bestimmt.
//
// Felder:
//  - kaufpreis: einmaliger Kaufpreis
//  - mieteMonat: monatliche Standortmiete (wird /30 pro Tag abgezogen)
//  - umsatzMin/umsatzMax: Spanne für den rohen Tagesumsatz vor allen
//    Faktoren (Preis, Sauberkeit, Ruf, Wochentag, Ausbau, Personal)
//  - vandalismusRisiko / gesundheitsamtRisiko: 1 (selten) bis 10 (oft)
export const TOILETTEN = [
  // ── Bahnhof ──
  {
    id: 'bf-gleis7',
    name: 'Bahnhofsklo Gleis 7',
    standort: 'bf',
    typ: 'standard',
    kaufpreis: 15000,
    mieteMonat: 700,
    umsatzMin: 150,
    umsatzMax: 420,
    vandalismusRisiko: 5,
    gesundheitsamtRisiko: 4,
    beschreibung: 'Klassiker. Riecht nach Currywurst und Entscheidungen, ' +
      'die man im Schnellzug bereut.',
  },
  {
    id: 'bf-pissoir',
    name: 'Pissoir Haupthalle',
    standort: 'bf',
    typ: 'pissoir',
    kaufpreis: 6000,
    mieteMonat: 280,
    umsatzMin: 80,
    umsatzMax: 230,
    vandalismusRisiko: 6,
    gesundheitsamtRisiko: 3,
    beschreibung: 'Schnell rein, schnell raus. Umsatz in kleinen ' +
      'Münzen, aber davon viele.',
  },

  // ── Kaserne ──
  {
    id: 'ks-ost',
    name: 'Standort-WC Kaserne Ost',
    standort: 'ks',
    typ: 'standard',
    kaufpreis: 14000,
    mieteMonat: 550,
    umsatzMin: 120,
    umsatzMax: 320,
    vandalismusRisiko: 2,
    gesundheitsamtRisiko: 7,
    beschreibung: 'Stammkundschaft mit Stubendurchgang-Disziplin. ' +
      'Der Amtsarzt kennt den Weg leider auch.',
  },
  {
    id: 'ks-dusche',
    name: 'Dusch-Trakt Kaserne',
    standort: 'ks',
    typ: 'dusche',
    kaufpreis: 42000,
    mieteMonat: 1800,
    umsatzMin: 220,
    umsatzMax: 980,
    vandalismusRisiko: 1,
    gesundheitsamtRisiko: 8,
    beschreibung: 'Kalt, laut, immer voll nach dem Sport. Sehr ' +
      'profitabel — wenn die Inspektion mitspielt.',
  },

  // ── Stadion ──
  {
    id: 'st-fanblock',
    name: 'Fanblock-Klo Süd',
    standort: 'st',
    typ: 'pissoir',
    kaufpreis: 9000,
    mieteMonat: 350,
    umsatzMin: 60,
    umsatzMax: 1200,
    vandalismusRisiko: 8,
    gesundheitsamtRisiko: 3,
    beschreibung: 'An Spieltagen Goldgrube, sonst Friedhof. ' +
      'Manchmal fliegt was an die Wand. Oder durch sie.',
  },
  {
    id: 'st-vip',
    name: 'VIP-WC Stadion',
    standort: 'st',
    typ: 'luxus',
    kaufpreis: 50000,
    mieteMonat: 2200,
    umsatzMin: 150,
    umsatzMax: 1400,
    vandalismusRisiko: 2,
    gesundheitsamtRisiko: 4,
    beschreibung: 'Logenplatz fürs Geschäft. Sponsoren-Klientel, ' +
      'erwartet Marmor und Mundwasser.',
  },

  // ── Fußgängerzone ──
  {
    id: 'fz-city',
    name: 'City-Toilette Fußgängerzone',
    standort: 'fz',
    typ: 'standard',
    kaufpreis: 18000,
    mieteMonat: 950,
    umsatzMin: 180,
    umsatzMax: 460,
    vandalismusRisiko: 4,
    gesundheitsamtRisiko: 5,
    beschreibung: 'Mitten im Trubel. Jeder, der shoppen geht, muss ' +
      'irgendwann mal — Gott sei Dank.',
  },
  {
    id: 'fz-luxus',
    name: 'Luxus-WC Boulevard',
    standort: 'fz',
    typ: 'luxus',
    kaufpreis: 48000,
    mieteMonat: 2400,
    umsatzMin: 280,
    umsatzMax: 1150,
    vandalismusRisiko: 2,
    gesundheitsamtRisiko: 5,
    beschreibung: 'Marmor, Musik, Mundwasser. Touristen zahlen ' +
      'für das Selfie im Spiegel.',
  },
  {
    id: 'fz-familien',
    name: 'Familien-WC Einkaufscenter',
    standort: 'fz',
    typ: 'familien',
    kaufpreis: 23000,
    mieteMonat: 1100,
    umsatzMin: 190,
    umsatzMax: 480,
    vandalismusRisiko: 3,
    gesundheitsamtRisiko: 5,
    beschreibung: 'Wickeltisch, Kindersitz, Kinderwagen-Stau vor ' +
      'der Tür. Eltern zahlen für Sauberkeit Gold.',
  },

  // ── Flughafen ──
  {
    id: 'fh-transit',
    name: 'Transit-WC Terminal 2',
    standort: 'fh',
    typ: 'standard',
    kaufpreis: 26000,
    mieteMonat: 1400,
    umsatzMin: 220,
    umsatzMax: 540,
    vandalismusRisiko: 1,
    gesundheitsamtRisiko: 6,
    beschreibung: 'Zwischen zwei Gates, neun Stunden Aufenthalt. ' +
      'Jetlag macht jeden dankbar für eine saubere Kabine.',
  },
  {
    id: 'fh-dusche',
    name: 'Dusch-Lounge Langstrecke',
    standort: 'fh',
    typ: 'dusche',
    kaufpreis: 65000,
    mieteMonat: 3200,
    umsatzMin: 250,
    umsatzMax: 1600,
    vandalismusRisiko: 1,
    gesundheitsamtRisiko: 7,
    beschreibung: 'Premium-Erfrischung für gestrandete ' +
      'Vielflieger. Teuer, aber wer einmal duscht, zahlt klaglos.',
  },
  {
    id: 'fh-behinderten',
    name: 'Behinderten-WC Ankunft',
    standort: 'fh',
    typ: 'behinderten',
    kaufpreis: 19000,
    mieteMonat: 850,
    umsatzMin: 130,
    umsatzMax: 360,
    vandalismusRisiko: 1,
    gesundheitsamtRisiko: 6,
    beschreibung: 'Barrierefrei, gefördert, gern genutzt. Strenge ' +
      'Vorschriften — aber auch ein Zuschuss vom Amt.',
  },
]

export const TOILETTEN_TYPEN = {
  standard:   { name: 'Standard-WC', emoji: '🚽' },
  pissoir:    { name: 'Pissoir', emoji: '🚻' },
  luxus:      { name: 'Luxus-WC', emoji: '🧻' },
  behinderten:{ name: 'Behinderten-WC', emoji: '♿' },
  familien:   { name: 'Familien-WC', emoji: '👶' },
  dusche:     { name: 'Dusch-Anlage', emoji: '🚿' },
}
