// Zufallsereignisse — der Klo-Manager-Humor lebt hier.
// Ereignisse würfeln sich aus den Risiko-Werten der Bars
// (vandalismusRisiko, ordnungsamtRisiko, Sauberkeit) und aus
// Berlin-typischen Welt-Events. Manche verlangen eine Entscheidung
// (bestechen?).
//
// NEU (Multiplayer): Ereignisse betreffen Bars EGAL wem sie gehören.
// Welt-Events liefern jetzt eine "effekte"-Liste (pro Bar ein Delta),
// damit die Simulation jedem Besitzer seinen Anteil gutschreiben kann.
import { VENUES } from '../data/venues.js'
import { KIEZE } from '../data/kieze.js'

const wuerfel = (chance) => Math.random() < chance
const zwischen = (min, max) => Math.round(min + Math.random() * (max - min))
const zufaellig = (liste) => liste[Math.floor(Math.random() * liste.length)]

const VANDALISMUS_TEXTE = [
  'Jemand hat "TOURIS RAUS" an die Fassade gesprüht. Immerhin korrekt geschrieben.',
  'Fensterscheibe kaputt. Schon wieder. Der Glaser kennt dich beim Vornamen.',
  'Jemand hat den Türgriff geklaut. Nur den Türgriff. Berlin halt.',
  'Graffiti über Nacht. Künstlerisch wertvoll, sagt der Sprayer. Teuer, sagt der Maler.',
]

const BERND_TEXTE = [
  'Ordnungsamt-Bernd steht vor der Tür. Klemmbrett gezückt, Miene versteinert.',
  'Bernd hat die Lüftungsanlage "bedenklich" genannt. Er meint: teuer für dich.',
  'Unangekündigte Kontrolle! Bernd riecht an allem. Wirklich an allem.',
]

const BERND_DRECK_TEXTE = [
  'Bernd hat den Boden angefasst. Mit blankem Finger. Großer Fehler — für dich.',
  'Bernd zückt sein Handy: "Das poste ich beim Gesundheitsamt-Gruppenchat."',
  'Bernd steht knöcheltief in... irgendwas. Er macht sich Notizen. Viele Notizen.',
]

// ── Bars, die jemandem gehören (egal welcher Spieler) ──
function besitzteBars(zustand) {
  return Object.entries(zustand.bars)
    .filter(([, bar]) => bar.besitzer)
    .map(([id, bar]) => ({ id, bar, venue: VENUES.find(v => v.id === id) }))
    .filter(eintrag => eintrag.venue)
}

// ── Pro-Bar-Ereignisse ────────────────────────────────────────────
function barEvents(zustand) {
  const events = []

  for (const { id, bar, venue } of besitzteBars(zustand)) {
    // Vandalismus: Risiko 1-10 → bis zu 20% Chance pro Tag
    if (wuerfel(venue.vandalismusRisiko * 0.02)) {
      const schaden = zwischen(300, 1200)
      events.push({
        titel: `Vandalismus: ${venue.name}`,
        text: zufaellig(VANDALISMUS_TEXTE),
        effekte: [{ venueId: id, delta: -schaden }],
        delta: -schaden,
      })
    }

    // Ordnungsamt-Bernd: verlangt eine ENTSCHEIDUNG.
    // Schmutzige Läden ziehen Bernd magisch an.
    const dreckFaktor = bar.sauberkeit < 15 ? 3 : bar.sauberkeit < 40 ? 2 : 1
    if (wuerfel(venue.ordnungsamtRisiko * 0.015 * dreckFaktor)) {
      const text = dreckFaktor > 1
        ? zufaellig(BERND_DRECK_TEXTE)
        : zufaellig(BERND_TEXTE)
      events.push({
        titel: `Kontrolle: ${venue.name}`,
        text,
        delta: null,            // hängt von der Entscheidung ab
        venueId: id,
        ergebnis: null,
        entscheidung: {
          optionen: [
            {
              label: 'BESTECHEN (2.500 €)',
              ausgang: () =>
                Math.random() < 0.75
                  ? { text: 'Bernd steckt den Umschlag ein und "findet nichts". Geschäft ist Geschäft.', delta: -2500 }
                  : { text: 'Bernd ist heute unbestechlich! Bußgeld plus peinliches Schweigen.', delta: -2500 - 6000 },
            },
            {
              label: 'KOOPERIEREN',
              ausgang: () =>
                Math.random() < 0.5
                  ? { text: 'Bernd findet nichts. Diesmal. Er kommt wieder, das spürst du.', delta: 0 }
                  : { text: 'Mängelliste, drei Seiten. Strafe und Auflagen.', delta: -4000 },
            },
          ],
        },
      })
    }

    // Schöne Momente gibt's auch
    if (venue.typ === 'kneipe' && wuerfel(0.06)) {
      const betrag = zwischen(200, 600)
      events.push({
        titel: `Stammgast-Wunder: ${venue.name}`,
        text: 'Detlef hat seinen Deckel bezahlt. Den von 2019. Historischer Moment.',
        effekte: [{ venueId: id, delta: betrag }],
        delta: betrag,
      })
    }

    if ((venue.typ === 'cocktailbar' || venue.typ === 'club') && wuerfel(0.05)) {
      const betrag = zwischen(800, 2000)
      events.push({
        titel: `Influencerin Lena K. war da!`,
        text: `Story mit Standort-Tag von ${venue.name}. 40.000 Views. Der Laden platzt.`,
        effekte: [{ venueId: id, delta: betrag }],
        delta: betrag,
      })
    }
  }

  return events
}

// ── Welt-Ereignisse (betreffen alle Bars / einen Kiez, egal wem sie gehören) ──
function weltEvents(zustand) {
  const alleBars = besitzteBars(zustand)
  if (alleBars.length === 0 || !wuerfel(0.18)) return []

  const kandidaten = [
    () => {
      const effekte = alleBars.map(({ id }) => ({ venueId: id, delta: -150 }))
      return {
        titel: 'BVG-Streik!',
        text: 'Keine Bahn, kein Bus, keine Gäste. Berlin steht. Alle Kassen leiden.',
        effekte,
      }
    },
    () => {
      const betroffen = alleBars.filter(({ venue }) => venue.kiez === 'krz' || venue.kiez === 'nkn')
      if (betroffen.length === 0) return null
      return {
        titel: 'Karneval der Kulturen!',
        text: 'Kreuzberg und Neukölln im Ausnahmezustand. Alles voll, alle durstig.',
        effekte: betroffen.map(({ id }) => ({ venueId: id, delta: 400 })),
      }
    },
    () => {
      const betroffen = alleBars.filter(({ venue }) => venue.kiez === 'fh')
      if (betroffen.length === 0) return null
      return {
        titel: 'Berghain-Abweisungswelle',
        text: 'Der Türsteher hatte heute Laune. Hunderte Abgewiesene suchen Trost — bei euch.',
        effekte: betroffen.map(({ id }) => ({ venueId: id, delta: 500 })),
      }
    },
    () => ({
      titel: 'Dauerregen',
      text: 'Berlin grau in grau. Nur die Härtesten verlassen das Haus.',
      effekte: alleBars.map(({ id }) => ({ venueId: id, delta: -100 })),
    }),
    () => {
      const kiezId = zufaellig([...new Set(alleBars.map(({ venue }) => venue.kiez))])
      const betroffen = alleBars.filter(({ venue }) => venue.kiez === kiezId)
      return {
        titel: `Hipster entdecken ${KIEZE[kiezId].name}!`,
        text: 'Ein Blog nannte den Kiez "the next big thing". Die Flat-White-Karawane rollt.',
        effekte: betroffen.map(({ id }) => ({ venueId: id, delta: 300 })),
      }
    },
  ]

  const event = zufaellig(kandidaten)()
  if (!event) return []
  // delta = Summe aller Effekte, nur für die Anzeige im Bericht
  event.delta = event.effekte.reduce((summe, e) => summe + e.delta, 0)
  return [event]
}

// Haupteinstieg: würfelt alle Ereignisse für einen Tag (max. 3)
export function wuerfleEvents(zustand) {
  const alle = [...barEvents(zustand), ...weltEvents(zustand)]
  // mischen und auf 3 begrenzen — sonst wird der Bericht zur Tageszeitung
  for (let i = alle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[alle[i], alle[j]] = [alle[j], alle[i]]
  }
  return alle.slice(0, 3)
}
