// Spülkönig Dieter — der KI-Rivale.
// Zieht NACH allen menschlichen Spielern, BEVOR die Tages-Simulation
// läuft. Einfache, aber spürbare Heuristiken:
// - kauft günstige freie Klos, solange genug Reserve übrig bleibt
// - bevorzugt "teuer" (Dieter ist gierig)
// - reinigt, wenn's zu dreckig wird und Geld da ist
// - streut gerne Gerüchte über menschliche Spieler, sonst Werbung für sich
import { TOILETTEN } from '../data/toiletten.js'
import { REINIGUNG_KOSTEN, MARKETING_KOSTEN, SABOTAGE_KOSTEN } from '../data/strategie.js'

const wuerfel = (chance) => Math.random() < chance
const zufaellig = (liste) => liste[Math.floor(Math.random() * liste.length)]

function leereToilette() {
  return { besitzer: null, ausstattung: [], personal: [], preis: 'normal', sauberkeit: 100, ruf: 50, aktion: null }
}

export function konkurrentZug(zustand) {
  const konkurrent = zustand.spieler.find(s => s.id === 'konkurrent')
  let kasse = konkurrent.kasse
  const klos = { ...zustand.klos }

  // ── 1. Kaufen: günstigstes freies Klo, solange Reserve bleibt ──
  const freie = TOILETTEN
    .filter(t => !klos[t.id]?.besitzer)
    .filter(t => t.kaufpreis <= kasse - 20000)
    .sort((a, b) => a.kaufpreis - b.kaufpreis)

  if (freie.length > 0 && wuerfel(0.6)) {
    const ziel = freie[0]
    kasse -= ziel.kaufpreis
    klos[ziel.id] = { ...(klos[ziel.id] ?? leereToilette()), besitzer: 'konkurrent' }
  }

  // ── 2. Für jedes Dieter-Klo: Preis, Reinigung, Aktion ──
  const eigeneIds = Object.entries(klos).filter(([, k]) => k.besitzer === 'konkurrent').map(([id]) => id)
  const fremdeIds = Object.entries(klos).filter(([, k]) => k.besitzer && k.besitzer !== 'konkurrent').map(([id]) => id)

  for (const id of eigeneIds) {
    const klo = klos[id]
    let neu = { ...klo }

    // Preis: Dieter ist gierig und drückt gern auf "teuer"
    neu.preis = zufaellig(['teuer', 'teuer', 'normal', 'guenstig'])

    // Reinigen, wenn's dreckig wird und genug Reserve da ist
    if (neu.sauberkeit < 50 && kasse > REINIGUNG_KOSTEN * 3) {
      neu.sauberkeit = 100
      kasse -= REINIGUNG_KOSTEN
    }

    // Aktion: Gerüchte gegen Menschen oder Werbung für sich selbst
    neu.aktion = null
    if (fremdeIds.length > 0 && wuerfel(0.25) && kasse > SABOTAGE_KOSTEN * 2) {
      neu.aktion = { typ: 'geruechte', ziel: zufaellig(fremdeIds) }
    } else if (wuerfel(0.35) && kasse > MARKETING_KOSTEN * 2) {
      neu.aktion = { typ: 'werbung' }
    }

    klos[id] = neu
  }

  return { klos, kasse }
}
