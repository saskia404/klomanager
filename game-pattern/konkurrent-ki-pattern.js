// Kiez-König Murat — die KI-Rivalin/der KI-Rivale.
// Zieht NACH allen menschlichen Spielern, BEVOR die Tages-Simulation
// läuft. Einfache, aber spürbare Heuristiken:
// - kauft günstige freie Bars, solange genug Reserve übrig bleibt
// - bevorzugt "teuer" (Murat ist gierig)
// - reinigt, wenn's zu dreckig wird und Geld da ist
// - sabotiert gerne menschliche Spieler, sonst Marketing für sich
import { VENUES } from '../data/venues.js'
import { REINIGUNG_KOSTEN, MARKETING_KOSTEN, SABOTAGE_KOSTEN } from '../data/strategie.js'

const wuerfel = (chance) => Math.random() < chance
const zufaellig = (liste) => liste[Math.floor(Math.random() * liste.length)]

function leereBar() {
  return { besitzer: null, upgrades: [], personal: [], preis: 'normal', sauberkeit: 100, ruf: 50, aktion: null }
}

export function muratZug(zustand) {
  const murat = zustand.spieler.find(s => s.id === 'murat')
  let kasse = murat.kasse
  const bars = { ...zustand.bars }

  // ── 1. Kaufen: günstigste freie Bar, solange Reserve bleibt ──
  const freie = VENUES
    .filter(v => !bars[v.id]?.besitzer)
    .filter(v => v.kaufpreis <= kasse - 20000)
    .sort((a, b) => a.kaufpreis - b.kaufpreis)

  if (freie.length > 0 && wuerfel(0.6)) {
    const ziel = freie[0]
    kasse -= ziel.kaufpreis
    bars[ziel.id] = { ...(bars[ziel.id] ?? leereBar()), besitzer: 'murat' }
  }

  // ── 2. Für jede Murat-Bar: Preis, Reinigung, Aktion ──
  const muratBarIds = Object.entries(bars).filter(([, b]) => b.besitzer === 'murat').map(([id]) => id)
  const fremdeBarIds = Object.entries(bars).filter(([, b]) => b.besitzer && b.besitzer !== 'murat').map(([id]) => id)

  for (const id of muratBarIds) {
    const bar = bars[id]
    let neu = { ...bar }

    // Preis: Murat ist gierig und drückt gern auf "teuer"
    neu.preis = zufaellig(['teuer', 'teuer', 'normal', 'guenstig'])

    // Reinigen, wenn's dreckig wird und genug Reserve da ist
    if (neu.sauberkeit < 50 && kasse > REINIGUNG_KOSTEN * 3) {
      neu.sauberkeit = 100
      kasse -= REINIGUNG_KOSTEN
    }

    // Aktion: Sabotage gegen Menschen oder Marketing für sich selbst
    neu.aktion = null
    if (fremdeBarIds.length > 0 && wuerfel(0.25) && kasse > SABOTAGE_KOSTEN * 2) {
      neu.aktion = { typ: 'sabotage', ziel: zufaellig(fremdeBarIds) }
    } else if (wuerfel(0.35) && kasse > MARKETING_KOSTEN * 2) {
      neu.aktion = { typ: 'marketing' }
    }

    bars[id] = neu
  }

  return { bars, kasse }
}
