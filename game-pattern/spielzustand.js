// Der komplette Spielzustand + Reducer.
// Prinzip: ALLE Änderungen am Spiel laufen durch diese eine Funktion.
// Eine "Action" beschreibt was passieren soll, der Reducer rechnet
// den neuen Zustand aus. Kein verstreutes setState — ein Ort, eine
// Wahrheit. (Das gleiche Muster wie Redux, nur eingebaut in React.)
//
// NEU (Multiplayer + KI-Rivale):
// - zustand.spieler: Array aus 1-4 Menschen (Hot-Seat) + Murat (KI)
// - zustand.aktiverSpielerIndex: wer ist gerade am Zug (Planungsphase)
// - zustand.phase: 'intro' | 'planung' | 'bericht'
// - jede Bar hat jetzt: besitzer, preis, sauberkeit, ruf, aktion
import { VENUES } from '../data/venues.js'
import { UPGRADES, PERSONAL_OPTIONEN } from '../data/upgrades.js'
import {
  REINIGUNG_KOSTEN, SPIELER_FARBEN, MURAT_FARBE, MURAT_NAME,
} from '../data/strategie.js'
import { simuliereTag } from './simulation.js'
import { muratZug } from './murat.js'

export { WOCHENTAGE, wochentag } from './zeit.js'

// Eine frisch gekaufte Bar startet sauber, mit Mittelpreis und
// neutralem Ruf — niemand kennt den Laden noch.
function leereBar() {
  return {
    besitzer: null,
    upgrades: [],
    personal: [],
    preis: 'normal',
    sauberkeit: 100,
    ruf: 50,
    aktion: null,       // { typ: 'marketing' } oder { typ: 'sabotage', ziel: venueId }
  }
}

export const START_ZUSTAND = {
  spieler: [],                 // wird beim Start gefüllt (SPIEL_STARTEN)
  aktiverSpielerIndex: 0,
  tag: 1,                       // Tag 1 = Montag
  phase: 'setup',                // 'setup' | 'intro' | 'planung' | 'bericht'
  screen: { name: 'setup' },    // 'setup' | 'intro' | 'stadt' | 'bar' | 'bericht'
  bars: {},                      // venueId → { besitzer, upgrades, personal, preis, sauberkeit, ruf, aktion }
  bericht: null,                 // Ergebnis des letzten Tages
  meldung: '',
}

export function spielReducer(zustand, action) {
  switch (action.type) {

    // ── Spielstart: Hot-Seat-Spielerzahl wählen, Murat dazugeben ──
    case 'SPIEL_STARTEN': {
      const anzahl = Math.min(4, Math.max(1, action.anzahl))
      const spieler = []
      for (let i = 1; i <= anzahl; i++) {
        spieler.push({
          id: `p${i}`,
          name: `Spieler ${i}`,
          typ: 'mensch',
          kasse: 200000,
          farbe: SPIELER_FARBEN[i - 1],
        })
      }
      spieler.push({
        id: 'murat',
        name: MURAT_NAME,
        typ: 'ki',
        kasse: 200000,
        farbe: MURAT_FARBE,
      })
      return {
        ...START_ZUSTAND,
        spieler,
        aktiverSpielerIndex: 0,
        tag: 1,
        phase: 'intro',
        screen: { name: 'intro' },
      }
    }

    // ── Intro ("TAG X BEGINNT") → weiter zur Stadtübersicht ──
    case 'INTRO_WEITER':
      return { ...zustand, phase: 'planung', screen: { name: 'stadt' }, meldung: '' }

    // ── Navigation zwischen den Screens ──
    case 'ZEIGE':
      return { ...zustand, screen: action.screen, meldung: '' }

    // ── Bar kaufen (für den aktiven Spieler) ──
    case 'KAUFEN': {
      const venue = action.venue
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bestehend = zustand.bars[venue.id]
      if (bestehend?.besitzer) return zustand
      if (aktiver.kasse < venue.kaufpreis) {
        return { ...zustand, meldung: 'Nicht genug Kohle! Kauf erstmal mehr Spätis.' }
      }
      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === aktiver.id ? { ...s, kasse: s.kasse - venue.kaufpreis } : s),
        bars: {
          ...zustand.bars,
          [venue.id]: { ...(bestehend ?? leereBar()), besitzer: aktiver.id },
        },
        meldung: `${venue.name} gehört jetzt dir, ${aktiver.name}!`,
      }
    }

    // ── Upgrade kaufen ──
    case 'UPGRADE': {
      const { venueId, upgradeId } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bar = zustand.bars[venueId]
      const venue = VENUES.find(v => v.id === venueId)
      const upgrade = UPGRADES[venue.typ]?.find(u => u.id === upgradeId)
      if (!bar || bar.besitzer !== aktiver.id) return zustand
      if (!upgrade || bar.upgrades.includes(upgradeId)) return zustand
      if (aktiver.kasse < upgrade.kosten) {
        return { ...zustand, meldung: 'Zu teuer. Der Tresor ist leerer als dein Club am Montag.' }
      }
      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === aktiver.id ? { ...s, kasse: s.kasse - upgrade.kosten } : s),
        bars: {
          ...zustand.bars,
          [venueId]: { ...bar, upgrades: [...bar.upgrades, upgradeId] },
        },
        meldung: `${upgrade.name} eingebaut!`,
      }
    }

    // ── Personal einstellen / feuern (Toggle) ──
    case 'PERSONAL': {
      const { venueId, personalId } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bar = zustand.bars[venueId]
      const person = PERSONAL_OPTIONEN.find(p => p.id === personalId)
      if (!bar || bar.besitzer !== aktiver.id || !person) return zustand
      const eingestellt = bar.personal.includes(personalId)
      return {
        ...zustand,
        bars: {
          ...zustand.bars,
          [venueId]: {
            ...bar,
            personal: eingestellt
              ? bar.personal.filter(id => id !== personalId)
              : [...bar.personal, personalId],
          },
        },
        meldung: eingestellt
          ? `${person.name} gefeuert. Tschüss!`
          : `${person.name} eingestellt — kostet ${person.tageskosten} €/Tag.`,
      }
    }

    // ── Preis einstellen (günstig / normal / teuer) ──
    case 'PREIS': {
      const { venueId, preis } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bar = zustand.bars[venueId]
      if (!bar || bar.besitzer !== aktiver.id) return zustand
      return {
        ...zustand,
        bars: { ...zustand.bars, [venueId]: { ...bar, preis } },
      }
    }

    // ── Reinigen: Sauberkeit zurück auf 100, kostet Kohle ──
    case 'REINIGEN': {
      const { venueId } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bar = zustand.bars[venueId]
      if (!bar || bar.besitzer !== aktiver.id) return zustand
      if (bar.sauberkeit >= 100) {
        return { ...zustand, meldung: 'Ist doch schon blitzeblank.' }
      }
      if (aktiver.kasse < REINIGUNG_KOSTEN) {
        return { ...zustand, meldung: 'Zu wenig Kohle für den Putzlappen.' }
      }
      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === aktiver.id ? { ...s, kasse: s.kasse - REINIGUNG_KOSTEN } : s),
        bars: { ...zustand.bars, [venueId]: { ...bar, sauberkeit: 100 } },
        meldung: 'Frisch geschrubbt! Riecht nach Zitrone und neuen Chancen.',
      }
    }

    // ── Aktion für den Tag wählen: Marketing oder Sabotage (oder zurücknehmen) ──
    case 'AKTION': {
      const { venueId, aktion } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bar = zustand.bars[venueId]
      if (!bar || bar.besitzer !== aktiver.id) return zustand
      return {
        ...zustand,
        bars: { ...zustand.bars, [venueId]: { ...bar, aktion } },
      }
    }

    // ── Spieler ist mit der Planung fertig: nächster Spieler ODER Tag beenden ──
    case 'SPIELER_WEITER': {
      const menschen = zustand.spieler.filter(s => s.typ === 'mensch')
      const naechsterIndex = zustand.aktiverSpielerIndex + 1
      if (naechsterIndex < menschen.length) {
        return { ...zustand, aktiverSpielerIndex: naechsterIndex, meldung: '' }
      }

      // Alle Menschen fertig → Murat zieht, dann läuft die Simulation
      const muratErgebnis = muratZug(zustand)
      const zwischenzustand = {
        ...zustand,
        bars: muratErgebnis.bars,
        spieler: zustand.spieler.map(s =>
          s.id === 'murat' ? { ...s, kasse: muratErgebnis.kasse } : s),
      }

      const bericht = simuliereTag(zwischenzustand)

      const spielerNeu = zwischenzustand.spieler.map(s => {
        const ergebnis = bericht.ergebnisse.find(e => e.spielerId === s.id)
        return ergebnis ? { ...s, kasse: s.kasse + ergebnis.gesamt } : s
      })

      return {
        ...zwischenzustand,
        spieler: spielerNeu,
        bars: bericht.barsNeu,
        bericht,
        screen: { name: 'bericht' },
        phase: 'bericht',
        meldung: '',
      }
    }

    // ── Vom Tagesbericht zum nächsten Tag (über das Intro) ──
    case 'NAECHSTER_TAG':
      return {
        ...zustand,
        tag: zustand.tag + 1,
        aktiverSpielerIndex: 0,
        phase: 'intro',
        screen: { name: 'intro' },
        bericht: null,
        meldung: '',
      }

    // ── Event-Entscheidung (z. B. Bernd bestechen oder nicht) ──
    case 'ENTSCHEIDUNG': {
      const { eventIndex, optionIndex } = action
      const events = [...(zustand.bericht?.events ?? [])]
      const ev = events[eventIndex]
      if (!ev?.entscheidung || ev.ergebnis) return zustand

      // Die gewählte Option auswürfeln (Bestechung kann schiefgehen!)
      const ausgang = ev.entscheidung.optionen[optionIndex].ausgang()
      events[eventIndex] = { ...ev, ergebnis: ausgang.text, delta: ausgang.delta }

      const besitzerId = zustand.bars[ev.venueId]?.besitzer

      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === besitzerId ? { ...s, kasse: s.kasse + ausgang.delta } : s),
        bericht: {
          ...zustand.bericht,
          events,
          ergebnisse: zustand.bericht.ergebnisse.map(e =>
            e.spielerId === besitzerId ? { ...e, gesamt: e.gesamt + ausgang.delta } : e),
        },
      }
    }

    default:
      return zustand
  }
}
