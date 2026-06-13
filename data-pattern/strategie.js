// Strategie-Konstanten für die neuen Spielebenen:
// Preis, Sauberkeit, Ruf, Sabotage & Marketing.
// Alles an einer Stelle, damit Werte leicht zu balancieren sind.

// ── Preis-Optionen pro Bar ──
// günstig: mehr Andrang, schmälere Marge, Ruf steigt langsam
// teuer:   bessere Marge pro Kopf, Ruf sinkt langsam
export const PREIS_OPTIONEN = {
  guenstig: {
    id: 'guenstig',
    label: 'Günstig',
    emoji: '💸',
    umsatzFaktor: 0.85,
    rufVeraenderung: 1,
    beschreibung: 'Volle Hütte, knappe Marge. Macht Freunde im Kiez.',
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    emoji: '➖',
    umsatzFaktor: 1.0,
    rufVeraenderung: 0,
    beschreibung: 'Der goldene Mittelweg. Niemand jubelt, niemand meckert.',
  },
  teuer: {
    id: 'teuer',
    label: 'Teuer',
    emoji: '💎',
    umsatzFaktor: 1.18,
    rufVeraenderung: -1,
    beschreibung: 'Mehr Kasse pro Kopf — aber der Ruf bröckelt.',
  },
}

export const PREIS_REIHENFOLGE = ['guenstig', 'normal', 'teuer']

// ── Sauberkeit ──
export const REINIGUNG_KOSTEN = 300
export const SAUBERKEIT_VERFALL_MIN = 4
export const SAUBERKEIT_VERFALL_MAX = 11

// ── Sabotage & Marketing (eine Aktion pro Bar pro Tag) ──
export const MARKETING_KOSTEN = 600
export const SABOTAGE_KOSTEN = 900
export const SABOTAGE_ENTDECKT_CHANCE = 0.25
export const SABOTAGE_ENTDECKT_STRAFE = 500

// ── Spieler-Farben (Hot-Seat) ──
export const SPIELER_FARBEN = ['#3fe0ff', '#ff4d8f', '#7dff5a', '#ffb347']
export const MURAT_FARBE = '#e8453c'
export const MURAT_NAME = 'Kiez-König Murat'
