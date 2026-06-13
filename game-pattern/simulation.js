// Tages-Simulation — wird ausgeführt, wenn der letzte Spieler seine
// Planung abschließt. Rechnet für JEDE Bar (egal wem sie gehört):
// Umsatz × Wochentags-Faktor × Preis-Faktor × Ruf-Faktor ×
// Sauberkeits-Faktor + Ausbau-Boni + Personal − Miete − Löhne
// − Aktions-Kosten. Danach: neue Sauberkeit & neuer Ruf für morgen.
import { VENUES } from '../data/venues.js'
import { UPGRADES, PERSONAL_OPTIONEN } from '../data/upgrades.js'
import { WOCHENTAGE } from './zeit.js'
import { wuerfleEvents } from './events.js'
import {
  PREIS_OPTIONEN, MARKETING_KOSTEN, SABOTAGE_KOSTEN,
  SABOTAGE_ENTDECKT_CHANCE, SABOTAGE_ENTDECKT_STRAFE,
  SAUBERKEIT_VERFALL_MIN, SAUBERKEIT_VERFALL_MAX,
} from '../data/strategie.js'

// Wochentags-Faktor: Clubs leben vom Wochenende, Spätis vom
// Nach-Club-Geschäft, Kneipen laufen immer einigermaßen.
function tagesFaktor(typ, wt) {
  const frSa = wt === 4 || wt === 5      // Freitag, Samstag
  switch (typ) {
    case 'club':
    case 'nachtclub': return frSa ? 1.0 : wt === 6 ? 0.45 : 0.12
    case 'cocktailbar': return frSa ? 1.35 : wt === 6 ? 0.9 : 0.95
    case 'kneipe': return frSa ? 1.25 : 1.0
    case 'spati': return wt === 5 || wt === 6 ? 1.25 : 1.0
    default: return 1.0
  }
}

// ── Kommentar-Pools (Klo-Manager-Ton: frech, direkt) ──
const KOMMENTARE = {
  super: [
    'Der Laden brummt. Sogar der Türsteher lächelt. Fast.',
    'Volles Haus! Die Kasse klingelt wie ein BVG-Fahrkartenautomat.',
    'Beste Nacht seit Wochen. Jemand hat sogar Trinkgeld gegeben.',
    'Läuft wie geschmiert. Verdächtig gut. Genieß es.',
  ],
  gut: [
    'Solider Tag. Keine Beschwerden, keine Polizei. Nimmt man.',
    'Ordentlicher Umsatz. Detlef hat zweimal gezahlt. Rekord.',
    'Geht so weiter? Dann reicht es sogar für die Miete.',
  ],
  mau: [
    'Tote Hose. Selbst die Fruchtfliegen sind gegangen.',
    'Drei Gäste, zwei davon wollten nur aufs Klo.',
    'Heute war eher... künstlerische Pause.',
    'Der Umsatz passt in ein Pfandglas.',
  ],
  miese: [
    'Miese Nacht. Die Miete lacht dich aus.',
    'Heute draufgezahlt. Klassiker des Berliner Nachtlebens.',
    'Verlustgeschäft. Aber hey — Atmosphäre unbezahlbar.',
  ],
  dreckig: [
    'Der Boden klebt. Die Gäste auch — am liebsten an der Tür, auf dem Weg raus.',
    'Es riecht komisch. Niemand will wissen wonach.',
    'Putzkolonne überfällig. Sehr überfällig.',
  ],
}

const zufaellig = (liste) => liste[Math.floor(Math.random() * liste.length)]
const zwischen = (min, max) => Math.round(min + Math.random() * (max - min))
const clamp = (wert, min, max) => Math.min(max, Math.max(min, wert))

export function simuliereTag(zustand) {
  const wt = (zustand.tag - 1) % 7
  const zeilen = []
  const barsNeu = { ...zustand.bars }

  // Ergebnis-Eimer pro Spieler (inkl. Murat), startet bei 0
  const ergebnisse = zustand.spieler.map(s => ({
    spielerId: s.id, name: s.name, farbe: s.farbe, gesamt: 0,
  }))
  const addErgebnis = (spielerId, delta) => {
    const eintrag = ergebnisse.find(e => e.spielerId === spielerId)
    if (eintrag) eintrag.gesamt += delta
  }

  // ── Sabotage-Aktionen vorab sammeln: wer schießt auf wen? ──
  const sabotagen = []          // { vonId (Bar), zielId (Bar) }
  for (const [id, bar] of Object.entries(zustand.bars)) {
    if (bar.besitzer && bar.aktion?.typ === 'sabotage' && zustand.bars[bar.aktion.ziel]?.besitzer) {
      sabotagen.push({ vonId: id, zielId: bar.aktion.ziel })
    }
  }
  const sabotagenGegen = (id) => sabotagen.filter(s => s.zielId === id)

  for (const [id, bar] of Object.entries(zustand.bars)) {
    if (!bar.besitzer) continue
    const venue = VENUES.find(v => v.id === id)
    if (!venue) continue

    const spielerName = zustand.spieler.find(s => s.id === bar.besitzer)?.name ?? '???'
    const spielerFarbe = zustand.spieler.find(s => s.id === bar.besitzer)?.farbe ?? '#fff'

    // ── Grundumsatz: Zufall zwischen Min und Max, dann Wochentag ──
    const basis = venue.umsatzMin + Math.random() * (venue.umsatzMax - venue.umsatzMin)
    const faktor = tagesFaktor(venue.typ, wt)

    // ── Preis- und Ruf-Faktor ──
    const preisOpt = PREIS_OPTIONEN[bar.preis] ?? PREIS_OPTIONEN.normal
    const rufFaktor = 0.7 + (bar.ruf / 100) * 0.6   // 0.7 .. 1.3

    // ── Sauberkeits-Faktor: dreckig = Gäste bleiben weg ──
    const sauberkeitFaktor = bar.sauberkeit < 15 ? 0.6 : bar.sauberkeit < 40 ? 0.85 : 1.0

    // ── Ausbau-Boni (einmal gekauft, wirken jeden Tag) ──
    const upgradeListe = UPGRADES[venue.typ] ?? []
    const upgradeBonus = bar.upgrades.reduce(
      (summe, uid) => summe + (upgradeListe.find(u => u.id === uid)?.revenueBonus ?? 0), 0)

    // ── Personal: bringt Bonus, kostet Lohn ──
    const personalBonus = bar.personal.reduce(
      (summe, pid) => summe + (PERSONAL_OPTIONEN.find(p => p.id === pid)?.revenueBonus ?? 0), 0)
    const personalKosten = bar.personal.reduce(
      (summe, pid) => summe + (PERSONAL_OPTIONEN.find(p => p.id === pid)?.tageskosten ?? 0), 0)

    let einnahmenRoh = basis * faktor * preisOpt.umsatzFaktor * rufFaktor * sauberkeitFaktor
      + upgradeBonus + personalBonus

    // ── Eigene Aktion: Marketing pumpt den Tagesumsatz ──
    let aktionsKosten = 0
    let rufDelta = preisOpt.rufVeraenderung
    const aktionsTexte = []

    if (bar.aktion?.typ === 'marketing') {
      einnahmenRoh *= 1.15
      aktionsKosten += MARKETING_KOSTEN
      rufDelta += 3
      aktionsTexte.push('📣 Marketing-Kampagne lief (+15% Umsatz, Ruf +3)')
    }

    if (bar.aktion?.typ === 'sabotage') {
      const zielVenue = VENUES.find(v => v.id === bar.aktion.ziel)
      aktionsKosten += SABOTAGE_KOSTEN
      let text = `🎯 Sabotage gegen ${zielVenue?.name ?? 'unbekannt'} geschickt`
      if (Math.random() < SABOTAGE_ENTDECKT_CHANCE) {
        aktionsKosten += SABOTAGE_ENTDECKT_STRAFE
        rufDelta -= 3
        text += ` — ERWISCHT! Strafe ${SABOTAGE_ENTDECKT_STRAFE} €, Ruf -3.`
      } else {
        text += ' — niemand hat was gesehen.'
      }
      aktionsTexte.push(text)
    }

    // ── Wurde diese Bar sabotiert? ──
    const angriffe = sabotagenGegen(id)
    if (angriffe.length > 0) {
      einnahmenRoh *= Math.pow(0.82, angriffe.length)
      rufDelta -= 4 * angriffe.length
      for (const angriff of angriffe) {
        const vonVenue = VENUES.find(v => v.id === angriff.vonId)
        aktionsTexte.push(`💩 Sabotiert von ${vonVenue?.name ?? '???'}! Umsatz -18%, Ruf -4`)
      }
    }

    const einnahmen = Math.max(0, Math.round(einnahmenRoh))
    const kosten = Math.round(venue.mieteMonat / 30 + personalKosten + aktionsKosten)
    const netto = einnahmen - kosten
    addErgebnis(bar.besitzer, netto)

    // ── Sauberkeit & Ruf für morgen ──
    if (bar.sauberkeit < 15) rufDelta -= 5
    else if (bar.sauberkeit < 40) rufDelta -= 2

    const rufNeu = clamp(bar.ruf + rufDelta, 0, 100)
    const sauberkeitNeu = clamp(bar.sauberkeit - zwischen(SAUBERKEIT_VERFALL_MIN, SAUBERKEIT_VERFALL_MAX), 0, 100)

    barsNeu[id] = { ...bar, ruf: rufNeu, sauberkeit: sauberkeitNeu, aktion: null }

    // ── Kommentar je nach Tagesform ──
    let stimmung =
      netto > venue.umsatzMax * 0.7 ? 'super'
      : netto > 0 ? 'gut'
      : netto > -150 ? 'mau'
      : 'miese'
    if (bar.sauberkeit < 15) stimmung = 'dreckig'

    zeilen.push({
      venueId: id,
      name: venue.name,
      typ: venue.typ,
      besitzerId: bar.besitzer,
      besitzerName: spielerName,
      besitzerFarbe: spielerFarbe,
      einnahmen,
      kosten,
      netto,
      kommentar: zufaellig(KOMMENTARE[stimmung]),
      preis: bar.preis,
      sauberkeitAlt: bar.sauberkeit,
      sauberkeitNeu,
      rufAlt: bar.ruf,
      rufNeu,
      aktionsTexte,
    })
  }

  // ── Zufallsereignisse würfeln ──
  // Sofortige Geld-Wirkungen direkt den Besitzern gutschreiben.
  // Entscheidungs-Events (Bernd) erst, wenn die Spielerin entscheidet.
  const events = wuerfleEvents(zustand)
  for (const ev of events) {
    if (ev.entscheidung) continue
    for (const effekt of ev.effekte ?? []) {
      const besitzer = zustand.bars[effekt.venueId]?.besitzer
      if (besitzer) addErgebnis(besitzer, effekt.delta)
    }
  }

  return {
    tag: zustand.tag,
    wochentagName: WOCHENTAGE[wt],
    zeilen,
    events,
    ergebnisse,
    barsNeu,
  }
}
