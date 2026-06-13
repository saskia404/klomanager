// Strategie-Konstanten: Eintrittspreis, Sauberkeit, Werbung/Gerüchte,
// Spieler- und Konkurrenten-Farben. Alles an einer Stelle für
// einfaches Balancing — analog zu Kiez Manager.

// ── Eintrittspreis-Stufen ──
// guenstig: mehr Andrang, schmalere Marge, Ruf steigt langsam
// teuer:   bessere Marge pro Besuch, Ruf sinkt langsam
export const PREIS_OPTIONEN = {
  guenstig: {
    id: 'guenstig',
    label: 'Günstig',
    emoji: '💸',
    umsatzFaktor: 0.85,
    rufVeraenderung: 1,
    beschreibung: '20 Cent. Lange Schlange, aber alle sind zufrieden.',
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    emoji: '➖',
    umsatzFaktor: 1.0,
    rufVeraenderung: 0,
    beschreibung: '50 Cent. Der ortsübliche Standard.',
  },
  teuer: {
    id: 'teuer',
    label: 'Teuer',
    emoji: '💎',
    umsatzFaktor: 1.18,
    rufVeraenderung: -1,
    beschreibung: '1 € fürs Pinkeln. Manche meckern, alle zahlen.',
  },
}

export const PREIS_REIHENFOLGE = ['guenstig', 'normal', 'teuer']

// ── Sauberkeit — das Klo-Manager-Kernprinzip ──
export const REINIGUNG_KOSTEN = 150
export const SAUBERKEIT_VERFALL_MIN = 4
export const SAUBERKEIT_VERFALL_MAX = 11

// ── Werbung & Gerüchte (eine Aktion pro Klo pro Tag) ──
export const MARKETING_KOSTEN = 400
export const SABOTAGE_KOSTEN = 600
export const SABOTAGE_ENTDECKT_CHANCE = 0.25
export const SABOTAGE_ENTDECKT_STRAFE = 500

// ── Spieler-Farben (Hot-Seat) ──
export const SPIELER_FARBEN = ['#3fe0ff', '#ff4d8f', '#7dff5a', '#ffb347']

// ── KI-Konkurrent ──
export const KONKURRENT_FARBE = '#e8453c'
export const KONKURRENT_NAME = 'Spülkönig Dieter'
