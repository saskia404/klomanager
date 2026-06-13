// Tagesbericht — das Klo-Manager-Ritual: Tag vorbei, Abrechnung,
// freche Kommentare, Ereignisse. Dann weiter zum nächsten Tag (Intro).
// Jedes Klo zeigt seinen Besitzer, Aktions-Hinweise (Werbung/
// Gerüchte) und am Ende steht das Ergebnis JEDER Person — inklusive
// Spülkönig Dieter.
import PixelSprite from '../retro/PixelSprite.jsx'
import { GEBAEUDE } from '../retro/sprites.js'

export default function BerichtScreen({ spiel, dispatch }) {
  const b = spiel.bericht
  if (!b) return null

  return (
    <div className="panel bericht">
      <div className="panel-titel">
        [ TAGESBERICHT — TAG {b.tag}, {b.wochentagName.toUpperCase()} ]
      </div>

      {b.zeilen.length === 0 && (
        <div className="dim" style={{ padding: '14px 0' }}>
          Niemand besitzt Klos. Der Tag verging trotzdem.
          Berlin braucht dringend Toiletten — kauf endlich was!
        </div>
      )}

      {b.zeilen.map(zeile => (
        <div className="bericht-zeile" key={zeile.toilettenId}>
          <div className="bericht-icon">
            <PixelSprite raster={GEBAEUDE[zeile.typ]} scale={2} />
          </div>
          <div className="bericht-mitte">
            <b>{zeile.name}</b>
            <span className="bericht-besitzer" style={{ color: zeile.besitzerFarbe }}>
              {zeile.besitzerName}
            </span>
            <div className="dim kommentar">{zeile.kommentar}</div>
            {zeile.aktionsTexte?.map((text, i) => (
              <div key={i} className="cyan kommentar">{text}</div>
            ))}
            <div className="dim kommentar" style={{ fontSize: 11 }}>
              Sauberkeit {zeile.sauberkeitAlt}% → {zeile.sauberkeitNeu}% · Ruf {zeile.rufAlt} → {zeile.rufNeu}
            </div>
          </div>
          <div className="bericht-zahlen">
            <span className="gruen">+{zeile.einnahmen.toLocaleString('de-DE')}</span>
            <span className="rot">−{zeile.kosten.toLocaleString('de-DE')}</span>
            <b className={zeile.netto >= 0 ? 'geld' : 'rot'}>
              {zeile.netto >= 0 ? '+' : ''}{zeile.netto.toLocaleString('de-DE')} €
            </b>
          </div>
        </div>
      ))}

      {/* Ereignisse des Tages */}
      {b.events.length > 0 && (
        <>
          <div className="panel-titel" style={{ marginTop: 16 }}>[ VORKOMMNISSE ]</div>
          {b.events.map((ev, i) => (
            <EventZeile key={i} index={i} event={ev} dispatch={dispatch} />
          ))}
        </>
      )}

      {/* Ergebnis pro Person */}
      <div className="panel-titel" style={{ marginTop: 16 }}>[ TAGESERGEBNIS ]</div>
      {b.ergebnisse.map(erg => (
        <div className="zeile bericht-ergebnis" key={erg.spielerId}>
          <span style={{ color: erg.farbe }}><b>{erg.name}</b></span>
          <b className={erg.gesamt >= 0 ? 'geld' : 'rot'}>
            {erg.gesamt >= 0 ? '+' : ''}{erg.gesamt.toLocaleString('de-DE')} €
          </b>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <button
          className="pixel-btn primaer"
          style={{ fontSize: 12, padding: '14px 24px' }}
          onClick={() => dispatch({ type: 'NAECHSTER_TAG' })}
          disabled={b.events.some(ev => ev.entscheidung && !ev.ergebnis)}
        >
          ▸ WEITER ZU TAG {b.tag + 1}
        </button>
        {b.events.some(ev => ev.entscheidung && !ev.ergebnis) && (
          <div className="dim" style={{ marginTop: 8, fontSize: 12 }}>
            Erst entscheiden, dann weiterleben.
          </div>
        )}
      </div>
    </div>
  )
}

// Ein Ereignis — manche verlangen eine Entscheidung (bestechen?)
function EventZeile({ index, event, dispatch }) {
  return (
    <div className="event-zeile">
      <div>
        <b className="amber">{event.titel}</b>
        <div className="dim kommentar">{event.text}</div>

        {event.entscheidung && !event.ergebnis && (
          <div className="event-optionen">
            {event.entscheidung.optionen.map((opt, oi) => (
              <button
                key={oi}
                className={`pixel-btn ${oi === 0 ? 'gefahr' : ''}`}
                style={{ fontSize: 9, padding: '6px 10px' }}
                onClick={() => dispatch({ type: 'ENTSCHEIDUNG', eventIndex: index, optionIndex: oi })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {event.ergebnis && <div className="cyan kommentar">→ {event.ergebnis}</div>}
      </div>
      {event.delta !== 0 && event.delta != null && (
        <b className={event.delta > 0 ? 'gruen' : 'rot'}>
          {event.delta > 0 ? '+' : ''}{event.delta.toLocaleString('de-DE')} €
        </b>
      )}
    </div>
  )
}
