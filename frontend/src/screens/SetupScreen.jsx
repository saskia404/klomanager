// Setup-Screen — der allererste Bildschirm.
// Hier wird die Hot-Seat-Spielerzahl gewählt (1-4 Menschen).
// Spülkönig Dieter spielt in jedem Fall mit, auch im Solo-Modus.
import { KONKURRENT_NAME, SPIELER_FARBEN } from '../data/strategie.js'

export default function SetupScreen({ dispatch }) {
  return (
    <div className="panel setup-panel">
      <div className="panel-titel">[ KLOMANAGER ]</div>

      <div className="setup-intro">
        <p>
          Stell dir vor: du bist Toiletten-Unternehmer*in. Du kaufst
          öffentliche Klos an Bahnhof, Kaserne, Stadion, Fußgängerzone
          und Flughafen, baust sie aus und hältst sie sauber — oder
          eben nicht. Tag für Tag wird abgerechnet.
        </p>
        <p className="dim">
          Immer am Start: <b style={{ color: 'var(--rot)' }}>{KONKURRENT_NAME}</b> —
          dein KI-Rivale. Er kauft, putzt, verbreitet Gerüchte und macht Werbung.
          Ganz automatisch. Ganz gemein.
        </p>
      </div>

      <div className="panel-titel" style={{ marginTop: 18 }}>[ WIE VIELE SPIELEN MIT? ]</div>
      <div className="setup-auswahl">
        {[1, 2, 3, 4].map(anzahl => (
          <button
            key={anzahl}
            className="pixel-btn primaer setup-btn"
            onClick={() => dispatch({ type: 'SPIEL_STARTEN', anzahl })}
          >
            <span className="setup-anzahl">{anzahl}</span>
            <span className="setup-label">{anzahl === 1 ? 'SOLO' : `HOT-SEAT (${anzahl}er)`}</span>
            <span className="setup-farben">
              {SPIELER_FARBEN.slice(0, anzahl).map((farbe, i) => (
                <span key={i} className="farb-punkt" style={{ background: farbe }} />
              ))}
            </span>
          </button>
        ))}
      </div>

      <div className="dim" style={{ marginTop: 16, fontSize: 12 }}>
        Hot-Seat heißt: ihr teilt euch einen Bildschirm. Jede Person plant
        ihren Zug (Klos kaufen, Preise, Reinigung, Aktionen) — dann ist
        die nächste Person dran. Am Ende des Tages rechnet Dieter ab.
      </div>
    </div>
  )
}
