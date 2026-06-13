// Zufallsereignisse — der Klo-Manager-Humor lebt hier.
// Ereignisse würfeln sich aus den Risiko-Werten der Klos
// (vandalismusRisiko, gesundheitsamtRisiko, Sauberkeit) und aus
// standort-typischen Welt-Events. Manche verlangen eine Entscheidung
// (bestechen?).
//
// Ereignisse betreffen Klos EGAL wem sie gehören. Welt-Events
// liefern eine "effekte"-Liste (pro Klo ein Delta), damit die
// Simulation jedem Besitzer seinen Anteil gutschreiben kann.
import { TOILETTEN } from '../data/toiletten.js'
import { STANDORTE } from '../data/standorte.js'

const wuerfel = (chance) => Math.random() < chance
const zwischen = (min, max) => Math.round(min + Math.random() * (max - min))
const zufaellig = (liste) => liste[Math.floor(Math.random() * liste.length)]

const VANDALISMUS_TEXTE = [
  'Jemand hat "HIER WAR ICH" in die Kabinenwand geritzt. Tiefenphilosophisch.',
  'Türschloss kaputt. Schon wieder. Der Schlüsseldienst kennt dich beim Vornamen.',
  'Das ganze Klopapier ist weg. Einfach weg. Nicht mal benutzt.',
  'Graffiti über Nacht. Künstlerisch wertvoll, sagt der Sprayer. Teuer, sagt die Putzkraft.',
  'Der Seifenspender wurde demontiert. Mitgenommen. Komplett.',
]

const AMT_TEXTE = [
  'Amtsärztin Dr. Hannelore Pissulke steht vor der Tür. Klemmbrett gezückt, Miene versteinert.',
  'Das Gesundheitsamt hat die Lüftung "bedenklich" genannt. Heißt: teuer für dich.',
  'Unangekündigte Kontrolle! Frau Dr. Pissulke riecht an allem. Wirklich an allem.',
]

const AMT_DRECK_TEXTE = [
  'Frau Dr. Pissulke hat den Boden angefasst. Mit blankem Finger. Großer Fehler — für dich.',
  'Sie zückt ihr Handy: "Das poste ich in die Gesundheitsamt-Gruppe."',
  'Frau Dr. Pissulke steht knöcheltief in... irgendwas. Sie macht sich Notizen. Viele Notizen.',
]

// ── Klos, die jemandem gehören (egal welcher Spieler) ──
function besitzteKlos(zustand) {
  return Object.entries(zustand.klos)
    .filter(([, klo]) => klo.besitzer)
    .map(([id, klo]) => ({ id, klo, toilette: TOILETTEN.find(t => t.id === id) }))
    .filter(eintrag => eintrag.toilette)
}

// ── Pro-Klo-Ereignisse ────────────────────────────────────────────
function kloEvents(zustand) {
  const events = []

  for (const { id, klo, toilette } of besitzteKlos(zustand)) {
    // Vandalismus: Risiko 1-10 → bis zu 20% Chance pro Tag
    if (wuerfel(toilette.vandalismusRisiko * 0.02)) {
      const schaden = zwischen(300, 1200)
      events.push({
        titel: `Vandalismus: ${toilette.name}`,
        text: zufaellig(VANDALISMUS_TEXTE),
        effekte: [{ toilettenId: id, delta: -schaden }],
        delta: -schaden,
      })
    }

    // Gesundheitsamt: verlangt eine ENTSCHEIDUNG.
    // Schmutzige Klos ziehen die Kontrolleurin magisch an.
    const dreckFaktor = klo.sauberkeit < 15 ? 3 : klo.sauberkeit < 40 ? 2 : 1
    if (wuerfel(toilette.gesundheitsamtRisiko * 0.015 * dreckFaktor)) {
      const text = dreckFaktor > 1
        ? zufaellig(AMT_DRECK_TEXTE)
        : zufaellig(AMT_TEXTE)
      events.push({
        titel: `Kontrolle: ${toilette.name}`,
        text,
        delta: null,            // hängt von der Entscheidung ab
        toilettenId: id,
        ergebnis: null,
        entscheidung: {
          optionen: [
            {
              label: 'BESTECHEN (2.500 €)',
              ausgang: () =>
                Math.random() < 0.75
                  ? { text: 'Frau Dr. Pissulke steckt den Umschlag ein und "findet nichts". Geschäft ist Geschäft.', delta: -2500 }
                  : { text: 'Sie ist heute unbestechlich! Bußgeld plus peinliches Schweigen.', delta: -2500 - 6000 },
            },
            {
              label: 'KOOPERIEREN',
              ausgang: () =>
                Math.random() < 0.5
                  ? { text: 'Sie findet nichts. Diesmal. Sie kommt wieder, das spürst du.', delta: 0 }
                  : { text: 'Mängelliste, drei Seiten. Strafe und Auflagen.', delta: -4000 },
            },
          ],
        },
      })
    }

    // Schöne Momente gibt's auch
    if ((toilette.typ === 'standard' || toilette.typ === 'pissoir') && wuerfel(0.06)) {
      const betrag = zwischen(200, 600)
      events.push({
        titel: `Dauer-Pendler-Wunder: ${toilette.name}`,
        text: 'Klaus zahlt seinen Jahresbeitrag bar. Den von 2019. Historischer Moment.',
        effekte: [{ toilettenId: id, delta: betrag }],
        delta: betrag,
      })
    }

    if ((toilette.typ === 'luxus' || toilette.typ === 'dusche') && wuerfel(0.05)) {
      const betrag = zwischen(800, 2000)
      events.push({
        titel: `Toiletten-Tester LeoReviews war da!`,
        text: `5-Sterne-Bewertung für ${toilette.name}. 40.000 Views. Die Schlange reicht um den Block.`,
        effekte: [{ toilettenId: id, delta: betrag }],
        delta: betrag,
      })
    }
  }

  return events
}

// ── Welt-Ereignisse (betreffen mehrere Klos / einen Standort-Typ) ──
function weltEvents(zustand) {
  const alleKlos = besitzteKlos(zustand)
  if (alleKlos.length === 0 || !wuerfel(0.18)) return []

  const kandidaten = [
    () => {
      const effekte = alleKlos.map(({ id }) => ({ toilettenId: id, delta: -150 }))
      return {
        titel: 'Bahnstreik!',
        text: 'Keine Bahn, kein Bus, kaum Reisende. Überall weniger Andrang.',
        effekte,
      }
    },
    () => {
      const betroffen = alleKlos.filter(({ toilette }) => toilette.standort === 'st')
      if (betroffen.length === 0) return null
      return {
        titel: 'Spieltag-Absage!',
        text: 'Das Spiel wurde verschoben. Das Stadion bleibt leer — und still.',
        effekte: betroffen.map(({ id }) => ({ toilettenId: id, delta: -300 })),
      }
    },
    () => {
      const betroffen = alleKlos.filter(({ toilette }) => toilette.standort === 'fz' || toilette.standort === 'fh')
      if (betroffen.length === 0) return null
      return {
        titel: 'Großes Stadtfest!',
        text: 'Fußgängerzone und Flughafen platzen aus allen Nähten. Alles voll, alle durstig — und danach...',
        effekte: betroffen.map(({ id }) => ({ toilettenId: id, delta: 400 })),
      }
    },
    () => ({
      titel: 'Dauerregen',
      text: 'Draußen graue Suppe. Wer kann, bleibt drinnen — und sucht ein WC in der Nähe.',
      effekte: alleKlos.map(({ id }) => ({ toilettenId: id, delta: 120 })),
    }),
    () => {
      const standortId = zufaellig([...new Set(alleKlos.map(({ toilette }) => toilette.standort))])
      const betroffen = alleKlos.filter(({ toilette }) => toilette.standort === standortId)
      return {
        titel: `Reisewelle: ${STANDORTE[standortId].name}!`,
        text: 'Ein Reiseblog hat den Standort empfohlen. Plötzlich ist jeder hier — und muss mal.',
        effekte: betroffen.map(({ id }) => ({ toilettenId: id, delta: 300 })),
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
  const alle = [...kloEvents(zustand), ...weltEvents(zustand)]
  // mischen und auf 3 begrenzen — sonst wird der Bericht zur Tageszeitung
  for (let i = alle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[alle[i], alle[j]] = [alle[j], alle[i]]
  }
  return alle.slice(0, 3)
}
