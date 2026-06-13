// Standortkarte — der Haupt-Screen.
// Die 5 Standorte sind grob als Stadtplan angeordnet. Jede Toilette
// ist ein klickbares Pixel-Gebäude. Klos zeigen ihren Besitzer
// farblich an (Spieler-Farbe oder Dieters Rot). Der "TAG BEENDEN"-
// Button heißt für nicht-letzte Hot-Seat-Spieler "FERTIG → NÄCHSTE
// PERSON".
import PixelSprite from '../retro/PixelSprite.jsx'
import { GEBAEUDE, ICON_STERN } from '../retro/sprites.js'
import { TOILETTEN } from '../data/toiletten.js'
import { STANDORTE } from '../data/standorte.js'

// Reihenfolge im Raster (2 Spalten, Flughafen unten breit)
const STANDORT_REIHENFOLGE = ['bf', 'ks', 'st', 'fz', 'fh']

export default function StadtScreen({ spiel, dispatch }) {
  const aktiver = spiel.spieler[spiel.aktiverSpielerIndex]
  const menschen = spiel.spieler.filter(s => s.typ === 'mensch')
  const istLetzterMensch = spiel.aktiverSpielerIndex >= menschen.length - 1

  return (
    <>
      <div className="panel">
        <div className="panel-titel">[ STADTPLAN — STANDORTE ]</div>
        <div className="dim" style={{ marginBottom: 12 }}>
          {menschen.length > 1
            ? `${aktiver.name} ist am Zug. Klick auf ein Klo, um es zu kaufen oder zu verwalten.`
            : 'Klick auf ein Klo, um es zu kaufen oder zu verwalten.'}
        </div>

        <div className="standort-karte">
          {STANDORT_REIHENFOLGE.map(standortId => {
            const standort = STANDORTE[standortId]
            const toiletten = TOILETTEN.filter(t => t.standort === standortId)
            return (
              <div key={standortId} className={`standort-box standort-${standortId}`}>
                <div className="standort-name">
                  {standort.emoji} {standort.name.toUpperCase()}
                </div>
                <div className="standort-beschreibung dim">{standort.beschreibung}</div>

                <div className="standort-toiletten">
                  {toiletten.map(toilette => {
                    const klo = spiel.klos[toilette.id]
                    const besitzer = klo?.besitzer
                      ? spiel.spieler.find(s => s.id === klo.besitzer)
                      : null
                    const istMeine = besitzer?.id === aktiver.id
                    return (
                      <button
                        key={toilette.id}
                        className={`klo-gebaeude ${besitzer ? 'gekauft' : ''}`}
                        style={besitzer ? { borderColor: besitzer.farbe } : undefined}
                        onClick={() => dispatch({ type: 'ZEIGE', screen: { name: 'klo', toilettenId: toilette.id } })}
                        title={toilette.name}
                      >
                        <PixelSprite raster={GEBAEUDE[toilette.typ]} scale={4} />
                        {besitzer && (
                          <span className="klo-stern" style={{ filter: istMeine ? 'none' : 'grayscale(0.4)' }}>
                            <PixelSprite raster={ICON_STERN} scale={2} />
                          </span>
                        )}
                        <span className="klo-label">{toilette.name}</span>
                        {besitzer ? (
                          <span className="klo-preis" style={{ color: besitzer.farbe }}>
                            {istMeine ? 'DEINS' : besitzer.name.toUpperCase()}
                          </span>
                        ) : (
                          <span className="klo-preis dim">
                            {toilette.kaufpreis.toLocaleString('de-DE')} €
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Der wichtigste Button des Spiels */}
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <button
          className="pixel-btn primaer"
          style={{ fontSize: 13, padding: '16px 28px' }}
          onClick={() => dispatch({ type: 'SPIELER_WEITER' })}
        >
          {istLetzterMensch ? '▸ TAG BEENDEN' : `▸ ${aktiver.name.toUpperCase()} FERTIG — NÄCHSTE PERSON`}
        </button>
        {!istLetzterMensch && (
          <div className="dim" style={{ marginTop: 8, fontSize: 12 }}>
            Gebt den Bildschirm weiter — {spiel.spieler[spiel.aktiverSpielerIndex + 1]?.name} ist als Nächste(r) dran.
          </div>
        )}
      </div>
    </>
  )
}
