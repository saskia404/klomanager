// KLOMANAGER — Retro-Edition
// Screen-basiert wie das Original Klo-Manager (1995):
// Setup → Intro ("TAG X BEGINNT") → Standortkarte → Klo verwalten
// → TAG BEENDEN → Tagesbericht → nächster Tag.
// Ein useReducer hält den kompletten Spielstand zusammen.
import { useReducer } from 'react'
import { spielReducer, START_ZUSTAND, wochentag } from './game/spielzustand.js'
import SetupScreen from './screens/SetupScreen.jsx'
import IntroScreen from './screens/IntroScreen.jsx'
import StadtScreen from './screens/StadtScreen.jsx'
import ToiletteScreen from './screens/ToiletteScreen.jsx'
import BerichtScreen from './screens/BerichtScreen.jsx'

export default function App() {
  const [spiel, dispatch] = useReducer(spielReducer, START_ZUSTAND)

  const aktiverSpieler = spiel.spieler[spiel.aktiverSpielerIndex]
  const anzahlKlos = (spielerId) =>
    Object.values(spiel.klos).filter(k => k.besitzer === spielerId).length

  // Schlüssel für die CRT-Übergangs-Animation: ändert sich bei jedem
  // Screen- und Spielerwechsel, wodurch React den Block neu einhängt
  // und die "crt-in"-Animation aus retro.css erneut abspielt.
  const uebergangsSchluessel = `${spiel.screen.name}-${spiel.tag}-${spiel.aktiverSpielerIndex}`

  return (
    <div className="spiel">

      {/* ── Statusleiste (immer sichtbar) ── */}
      <div className="statusleiste">
        <span className="status-logo">KLOMANAGER</span>

        {spiel.spieler.length > 0 && (
          <>
            <span className="status-wert">
              TAG <b>{spiel.tag}</b> · <b>{wochentag(spiel.tag)}</b>
            </span>

            {spiel.phase === 'planung' && aktiverSpieler && (
              <span className="status-wert spieler-badge" style={{ '--spielerfarbe': aktiverSpieler.farbe }}>
                <span className="farb-punkt" style={{ background: aktiverSpieler.farbe }} />
                <b>{aktiverSpieler.name}</b>
              </span>
            )}

            {spiel.phase === 'planung' && aktiverSpieler && (
              <>
                <span className="status-wert geld">
                  KASSE <b>{aktiverSpieler.kasse.toLocaleString('de-DE')} €</b>
                </span>
                <span className="status-wert">
                  KLOS <b>{anzahlKlos(aktiverSpieler.id)}</b>
                </span>
              </>
            )}
          </>
        )}

        {spiel.meldung && <span className="status-wert amber">{spiel.meldung}</span>}
      </div>

      {/* ── Aktiver Screen (mit CRT-Übergangs-Effekt) ── */}
      <div className="screen-bereich">
        <div className="crt-uebergang" key={uebergangsSchluessel}>
          {spiel.screen.name === 'setup' && (
            <SetupScreen spiel={spiel} dispatch={dispatch} />
          )}
          {spiel.screen.name === 'intro' && (
            <IntroScreen spiel={spiel} dispatch={dispatch} />
          )}
          {spiel.screen.name === 'stadt' && (
            <StadtScreen spiel={spiel} dispatch={dispatch} />
          )}
          {spiel.screen.name === 'klo' && (
            <ToiletteScreen spiel={spiel} dispatch={dispatch} />
          )}
          {spiel.screen.name === 'bericht' && (
            <BerichtScreen spiel={spiel} dispatch={dispatch} />
          )}
        </div>
      </div>

    </div>
  )
}
