// Der komplette Spielzustand + Reducer.
// Prinzip: ALLE Änderungen am Spiel laufen durch diese eine Funktion.
// Eine "Action" beschreibt, was passieren soll, der Reducer rechnet
// den neuen Zustand aus. Kein verstreutes setState — ein Ort, eine
// Wahrheit. (Gleiches Muster wie bei Kiez Manager.)
//
// - zustand.spieler: Array aus 1-4 Menschen (Hot-Seat) + Spülkönig (KI)
// - zustand.aktiverSpielerIndex: wer ist gerade am Zug (Planungsphase)
// - zustand.phase: 'setup' | 'intro' | 'planung' | 'bericht'
// - zustand.klos: toilettenId → { besitzer, ausstattung, personal,
//   preis, sauberkeit, ruf, aktion }
import { TOILETTEN } from '../data/toiletten.js'
import { AUSSTATTUNG, PERSONAL_OPTIONEN } from '../data/ausstattung.js'
import {
  REINIGUNG_KOSTEN, SPIELER_FARBEN, KONKURRENT_FARBE, KONKURRENT_NAME,
} from '../data/strategie.js'
import { simuliereTag } from './simulation.js'
import { konkurrentZug } from './konkurrent.js'

export { WOCHENTAGE, wochentag } from '../data/zeit.js'

// Eine frisch gekaufte Toilette startet sauber, mit Mittelpreis und
// neutralem Ruf — niemand kennt das Klo noch.
function leereToilette() {
  return {
    besitzer: null,
    ausstattung: [],
    personal: [],
    preis: 'normal',
    sauberkeit: 100,
    ruf: 50,
    aktion: null,       // { typ: 'werbung' } oder { typ: 'geruechte', ziel: toilettenId }
  }
}

export const START_ZUSTAND = {
  spieler: [],                  // wird beim Start gefüllt (SPIEL_STARTEN)
  aktiverSpielerIndex: 0,
  tag: 1,                        // Tag 1 = Montag
  phase: 'setup',                // 'setup' | 'intro' | 'planung' | 'bericht'
  screen: { name: 'setup' },     // 'setup' | 'intro' | 'stadt' | 'klo' | 'bericht'
  klos: {},                       // toilettenId → { besitzer, ausstattung, personal, preis, sauberkeit, ruf, aktion }
  bericht: null,                  // Ergebnis des letzten Tages
  meldung: '',
}

export function spielReducer(zustand, action) {
  switch (action.type) {

    // ── Spielstart: Hot-Seat-Spielerzahl wählen, Spülkönig dazugeben ──
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
        id: 'konkurrent',
        name: KONKURRENT_NAME,
        typ: 'ki',
        kasse: 200000,
        farbe: KONKURRENT_FARBE,
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

    // ── Toilette kaufen (für den aktiven Spieler) ──
    case 'KAUFEN': {
      const toilette = action.toilette
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const bestehend = zustand.klos[toilette.id]
      if (bestehend?.besitzer) return zustand
      if (aktiver.kasse < toilette.kaufpreis) {
        return { ...zustand, meldung: 'Nicht genug Kohle! Erstmal die anderen Klos zum Laufen bringen.' }
      }
      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === aktiver.id ? { ...s, kasse: s.kasse - toilette.kaufpreis } : s),
        klos: {
          ...zustand.klos,
          [toilette.id]: { ...(bestehend ?? leereToilette()), besitzer: aktiver.id },
        },
        meldung: `${toilette.name} gehört jetzt dir, ${aktiver.name}!`,
      }
    }

    // ── Ausstattung kaufen ──
    case 'AUSSTATTUNG_KAUFEN': {
      const { toilettenId, ausstattungId } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const klo = zustand.klos[toilettenId]
      const toilette = TOILETTEN.find(t => t.id === toilettenId)
      const item = AUSSTATTUNG[toilette.typ]?.find(a => a.id === ausstattungId)
      if (!klo || klo.besitzer !== aktiver.id) return zustand
      if (!item || klo.ausstattung.includes(ausstattungId)) return zustand
      if (aktiver.kasse < item.kosten) {
        return { ...zustand, meldung: 'Zu teuer. Der Tresor ist leerer als der Seifenspender montagmorgens.' }
      }
      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === aktiver.id ? { ...s, kasse: s.kasse - item.kosten } : s),
        klos: {
          ...zustand.klos,
          [toilettenId]: { ...klo, ausstattung: [...klo.ausstattung, ausstattungId] },
        },
        meldung: `${item.name} eingebaut!`,
      }
    }

    // ── Personal einstellen / feuern (Toggle) ──
    case 'PERSONAL': {
      const { toilettenId, personalId } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const klo = zustand.klos[toilettenId]
      const person = PERSONAL_OPTIONEN.find(p => p.id === personalId)
      if (!klo || klo.besitzer !== aktiver.id || !person) return zustand
      const eingestellt = klo.personal.includes(personalId)
      return {
        ...zustand,
        klos: {
          ...zustand.klos,
          [toilettenId]: {
            ...klo,
            personal: eingestellt
              ? klo.personal.filter(id => id !== personalId)
              : [...klo.personal, personalId],
          },
        },
        meldung: eingestellt
          ? `${person.name} gefeuert. Tschüss!`
          : `${person.name} eingestellt — kostet ${person.tageskosten} €/Tag.`,
      }
    }

    // ── Eintrittspreis einstellen (günstig / normal / teuer) ──
    case 'PREIS': {
      const { toilettenId, preis } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const klo = zustand.klos[toilettenId]
      if (!klo || klo.besitzer !== aktiver.id) return zustand
      return {
        ...zustand,
        klos: { ...zustand.klos, [toilettenId]: { ...klo, preis } },
      }
    }

    // ── Reinigen: Sauberkeit zurück auf 100, kostet Kohle ──
    case 'REINIGEN': {
      const { toilettenId } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const klo = zustand.klos[toilettenId]
      if (!klo || klo.besitzer !== aktiver.id) return zustand
      if (klo.sauberkeit >= 100) {
        return { ...zustand, meldung: 'Ist doch schon blitzeblank.' }
      }
      if (aktiver.kasse < REINIGUNG_KOSTEN) {
        return { ...zustand, meldung: 'Zu wenig Kohle für den Putzeimer.' }
      }
      return {
        ...zustand,
        spieler: zustand.spieler.map(s =>
          s.id === aktiver.id ? { ...s, kasse: s.kasse - REINIGUNG_KOSTEN } : s),
        klos: { ...zustand.klos, [toilettenId]: { ...klo, sauberkeit: 100 } },
        meldung: 'Frisch geschrubbt! Riecht nach Zitrone und neuen Chancen.',
      }
    }

    // ── Aktion für den Tag wählen: Werbung oder Gerüchte (oder zurücknehmen) ──
    case 'AKTION': {
      const { toilettenId, aktion } = action
      const aktiver = zustand.spieler[zustand.aktiverSpielerIndex]
      const klo = zustand.klos[toilettenId]
      if (!klo || klo.besitzer !== aktiver.id) return zustand
      return {
        ...zustand,
        klos: { ...zustand.klos, [toilettenId]: { ...klo, aktion } },
      }
    }

    // ── Spieler ist mit der Planung fertig: nächster Spieler ODER Tag beenden ──
    case 'SPIELER_WEITER': {
      const menschen = zustand.spieler.filter(s => s.typ === 'mensch')
      const naechsterIndex = zustand.aktiverSpielerIndex + 1
      if (naechsterIndex < menschen.length) {
        return { ...zustand, aktiverSpielerIndex: naechsterIndex, meldung: '' }
      }

      // Alle Menschen fertig → Spülkönig zieht, dann läuft die Simulation
      const konkurrentErgebnis = konkurrentZug(zustand)
      const zwischenzustand = {
        ...zustand,
        klos: konkurrentErgebnis.klos,
        spieler: zustand.spieler.map(s =>
          s.id === 'konkurrent' ? { ...s, kasse: konkurrentErgebnis.kasse } : s),
      }

      const bericht = simuliereTag(zwischenzustand)

      const spielerNeu = zwischenzustand.spieler.map(s => {
        const ergebnis = bericht.ergebnisse.find(e => e.spielerId === s.id)
        return ergebnis ? { ...s, kasse: s.kasse + ergebnis.gesamt } : s
      })

      return {
        ...zwischenzustand,
        spieler: spielerNeu,
        klos: bericht.klosNeu,
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

    // ── Event-Entscheidung (z. B. Gesundheitsamt bestechen oder nicht) ──
    case 'ENTSCHEIDUNG': {
      const { eventIndex, optionIndex } = action
      const events = [...(zustand.bericht?.events ?? [])]
      const ev = events[eventIndex]
      if (!ev?.entscheidung || ev.ergebnis) return zustand

      // Die gewählte Option auswürfeln (Bestechung kann schiefgehen!)
      const ausgang = ev.entscheidung.optionen[optionIndex].ausgang()
      events[eventIndex] = { ...ev, ergebnis: ausgang.text, delta: ausgang.delta }

      const besitzerId = zustand.klos[ev.toilettenId]?.besitzer

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
