// Tages-Simulation — wird ausgeführt, wenn der letzte Spieler seine
// Planung abschließt. Rechnet für JEDES Klo (egal wem es gehört):
// Umsatz × Standort-/Wochentags-Faktor × Preis-Faktor × Ruf-Faktor ×
// Sauberkeits-Faktor + Ausstattungs-Boni + Personal − Miete − Löhne
// − Aktions-Kosten. Danach: neue Sauberkeit & neuer Ruf für morgen.
import { TOILETTEN } from '../data/toiletten.js'
import { AUSSTATTUNG, PERSONAL_OPTIONEN } from '../data/ausstattung.js'
import { WOCHENTAGE } from '../data/zeit.js'
import { wuerfleEvents } from './events.js'
import {
  PREIS_OPTIONEN, MARKETING_KOSTEN, SABOTAGE_KOSTEN,
  SABOTAGE_ENTDECKT_CHANCE, SABOTAGE_ENTDECKT_STRAFE,
  SAUBERKEIT_VERFALL_MIN, SAUBERKEIT_VERFALL_MAX,
} from '../data/strategie.js'

// Standort-/Wochentags-Faktor:
// - Bahnhof: Pendlerverkehr, unter der Woche voll, am Wochenende leerer
// - Kaserne: gleichmäßig, am Wochenende Ausgang (weniger los)
// - Stadion: an Spieltagen (Sa/So) die Hölle, sonst Friedhof
// - Fußgängerzone: Shopping-Bonus Fr/Sa, sonntags zu
// - Flughafen: läuft immer, am Wochenende Reise-Bonus
function tagesFaktor(standort, wt) {
  const woche = wt <= 4   // Montag-Freitag
  const wochenende = wt === 5 || wt === 6  // Samstag, Sonntag
  switch (standort) {
    case 'bf': return woche ? 1.2 : wt === 5 ? 0.7 : 0.5
    case 'ks': return wochenende ? 0.6 : 1.0
    case 'st': return wochenende ? 1.0 : 0.08
    case 'fz': return (wt === 4 || wt === 5) ? 1.3 : wt === 6 ? 0.5 : 1.0
    case 'fh': return wochenende ? 1.15 : 1.0
    default: return 1.0
  }
}

// ── Kommentar-Pools (Klo-Manager-Ton: frech, direkt) ──
const KOMMENTARE = {
  super: [
    'Der Laden brummt. Die Klospülung kommt kaum nach.',
    'Volle Kabinen, klingelnde Kasse — besser geht\'s kaum.',
    'Beste Schicht seit Wochen. Sogar Trinkgeld lag im Teller.',
    'Läuft wie geschmiert. Verdächtig gut. Genieß es.',
  ],
  gut: [
    'Solider Tag. Keine Beschwerden, keine Schlangen vor der Tür.',
    'Ordentlicher Umsatz. Reicht locker für die Miete.',
    'Geht so weiter? Dann kann sich Dieter warm anziehen.',
  ],
  mau: [
    'Tote Hose. Selbst die Fliegen sind gegangen.',
    'Drei Gäste, zwei davon haben nur nach dem Weg gefragt.',
    'Heute war eher... künstlerische Pause.',
    'Der Umsatz passt in die Münzkasse vom Kondomautomaten.',
  ],
  miese: [
    'Miese Schicht. Die Miete lacht dich aus.',
    'Heute draufgezahlt. Klassiker im Toilettengeschäft.',
    'Verlustgeschäft. Aber hey — der Seifenspender duftet wenigstens.',
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
  const klosNeu = { ...zustand.klos }

  // Ergebnis-Eimer pro Spieler (inkl. Spülkönig), startet bei 0
  const ergebnisse = zustand.spieler.map(s => ({
    spielerId: s.id, name: s.name, farbe: s.farbe, gesamt: 0,
  }))
  const addErgebnis = (spielerId, delta) => {
    const eintrag = ergebnisse.find(e => e.spielerId === spielerId)
    if (eintrag) eintrag.gesamt += delta
  }

  // ── Gerüchte-Aktionen vorab sammeln: wer streut Gerüchte gegen wen? ──
  const geruechte = []          // { vonId (Klo), zielId (Klo) }
  for (const [id, klo] of Object.entries(zustand.klos)) {
    if (klo.besitzer && klo.aktion?.typ === 'geruechte' && zustand.klos[klo.aktion.ziel]?.besitzer) {
      geruechte.push({ vonId: id, zielId: klo.aktion.ziel })
    }
  }
  const geruechteGegen = (id) => geruechte.filter(g => g.zielId === id)

  for (const [id, klo] of Object.entries(zustand.klos)) {
    if (!klo.besitzer) continue
    const toilette = TOILETTEN.find(t => t.id === id)
    if (!toilette) continue

    const spielerName = zustand.spieler.find(s => s.id === klo.besitzer)?.name ?? '???'
    const spielerFarbe = zustand.spieler.find(s => s.id === klo.besitzer)?.farbe ?? '#fff'

    // ── Grundumsatz: Zufall zwischen Min und Max, dann Standort/Wochentag ──
    const basis = toilette.umsatzMin + Math.random() * (toilette.umsatzMax - toilette.umsatzMin)
    const faktor = tagesFaktor(toilette.standort, wt)

    // ── Preis- und Ruf-Faktor ──
    const preisOpt = PREIS_OPTIONEN[klo.preis] ?? PREIS_OPTIONEN.normal
    const rufFaktor = 0.7 + (klo.ruf / 100) * 0.6   // 0.7 .. 1.3

    // ── Sauberkeits-Faktor: dreckig = Gäste bleiben weg ──
    const sauberkeitFaktor = klo.sauberkeit < 15 ? 0.6 : klo.sauberkeit < 40 ? 0.85 : 1.0

    // ── Ausstattungs-Boni (einmal gekauft, wirken jeden Tag) ──
    const ausstattungListe = AUSSTATTUNG[toilette.typ] ?? []
    const ausstattungBonus = klo.ausstattung.reduce(
      (summe, aid) => summe + (ausstattungListe.find(a => a.id === aid)?.revenueBonus ?? 0), 0)

    // ── Personal: bringt Bonus, kostet Lohn ──
    const personalBonus = klo.personal.reduce(
      (summe, pid) => summe + (PERSONAL_OPTIONEN.find(p => p.id === pid)?.revenueBonus ?? 0), 0)
    const personalKosten = klo.personal.reduce(
      (summe, pid) => summe + (PERSONAL_OPTIONEN.find(p => p.id === pid)?.tageskosten ?? 0), 0)

    let einnahmenRoh = basis * faktor * preisOpt.umsatzFaktor * rufFaktor * sauberkeitFaktor
      + ausstattungBonus + personalBonus

    // ── Eigene Aktion: Werbung pumpt den Tagesumsatz ──
    let aktionsKosten = 0
    let rufDelta = preisOpt.rufVeraenderung
    const aktionsTexte = []

    if (klo.aktion?.typ === 'werbung') {
      einnahmenRoh *= 1.15
      aktionsKosten += MARKETING_KOSTEN
      rufDelta += 3
      aktionsTexte.push('📣 Werbeplakat hing aus (+15% Umsatz, Ruf +3)')
    }

    if (klo.aktion?.typ === 'geruechte') {
      const zielToilette = TOILETTEN.find(t => t.id === klo.aktion.ziel)
      aktionsKosten += SABOTAGE_KOSTEN
      let text = `🎯 Gerüchte über ${zielToilette?.name ?? 'unbekannt'} gestreut`
      if (Math.random() < SABOTAGE_ENTDECKT_CHANCE) {
        aktionsKosten += SABOTAGE_ENTDECKT_STRAFE
        rufDelta -= 3
        text += ` — ERWISCHT! Strafe ${SABOTAGE_ENTDECKT_STRAFE} €, Ruf -3.`
      } else {
        text += ' — niemand hat was gemerkt.'
      }
      aktionsTexte.push(text)
    }

    // ── Wurde dieses Klo mit Gerüchten beschädigt? ──
    const angriffe = geruechteGegen(id)
    if (angriffe.length > 0) {
      einnahmenRoh *= Math.pow(0.82, angriffe.length)
      rufDelta -= 4 * angriffe.length
      for (const angriff of angriffe) {
        const vonToilette = TOILETTEN.find(t => t.id === angriff.vonId)
        aktionsTexte.push(`💩 Schlechte Gerüchte von ${vonToilette?.name ?? '???'}! Umsatz -18%, Ruf -4`)
      }
    }

    const einnahmen = Math.max(0, Math.round(einnahmenRoh))
    const kosten = Math.round(toilette.mieteMonat / 30 + personalKosten + aktionsKosten)
    const netto = einnahmen - kosten
    addErgebnis(klo.besitzer, netto)

    // ── Sauberkeit & Ruf für morgen ──
    if (klo.sauberkeit < 15) rufDelta -= 5
    else if (klo.sauberkeit < 40) rufDelta -= 2

    const rufNeu = clamp(klo.ruf + rufDelta, 0, 100)
    const sauberkeitNeu = clamp(klo.sauberkeit - zwischen(SAUBERKEIT_VERFALL_MIN, SAUBERKEIT_VERFALL_MAX), 0, 100)

    klosNeu[id] = { ...klo, ruf: rufNeu, sauberkeit: sauberkeitNeu, aktion: null }

    // ── Kommentar je nach Tagesform ──
    let stimmung =
      netto > toilette.umsatzMax * 0.7 ? 'super'
      : netto > 0 ? 'gut'
      : netto > -150 ? 'mau'
      : 'miese'
    if (klo.sauberkeit < 15) stimmung = 'dreckig'

    zeilen.push({
      toilettenId: id,
      name: toilette.name,
      typ: toilette.typ,
      standort: toilette.standort,
      besitzerId: klo.besitzer,
      besitzerName: spielerName,
      besitzerFarbe: spielerFarbe,
      einnahmen,
      kosten,
      netto,
      kommentar: zufaellig(KOMMENTARE[stimmung]),
      preis: klo.preis,
      sauberkeitAlt: klo.sauberkeit,
      sauberkeitNeu,
      rufAlt: klo.ruf,
      rufNeu,
      aktionsTexte,
    })
  }

  // ── Zufallsereignisse würfeln ──
  // Sofortige Geld-Wirkungen direkt den Besitzern gutschreiben.
  // Entscheidungs-Events (Gesundheitsamt) erst, wenn die Spielerin entscheidet.
  const events = wuerfleEvents(zustand)
  for (const ev of events) {
    if (ev.entscheidung) continue
    for (const effekt of ev.effekte ?? []) {
      const besitzer = zustand.klos[effekt.toilettenId]?.besitzer
      if (besitzer) addErgebnis(besitzer, effekt.delta)
    }
  }

  return {
    tag: zustand.tag,
    wochentagName: WOCHENTAGE[wt],
    zeilen,
    events,
    ergebnisse,
    klosNeu,
  }
}
