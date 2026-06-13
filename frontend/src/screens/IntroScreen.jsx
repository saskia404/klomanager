// Intro-Screen — "TAG X BEGINNT".
// Kurzer CRT-Flacker-Moment zwischen den Tagen, wie ein Levelstart
// im alten Klo-Manager. Klick auf WEITER → Standortkarte.
import { wochentag } from '../game/spielzustand.js'

export default function IntroScreen({ spiel, dispatch }) {
  const wt = wochentag(spiel.tag)
  const spieltag = wt === 'Samstag' || wt === 'Sonntag'

  return (
    <div className="intro-screen">
      <div className="intro-flacker pixel-font">
        <div className="intro-tag-label dim">TAG {spiel.tag}</div>
        <div className="intro-tag-gross">{wt.toUpperCase()}</div>
        {spieltag && <div className="intro-hinweis amber">SPIELTAG — DAS STADION-KLO BRENNT</div>}
        {spiel.tag === 1 && (
          <div className="intro-hinweis dim">200.000 € Startkapital. Noch gehört keine Toilette wem.</div>
        )}
      </div>
      <button
        className="pixel-btn primaer"
        style={{ fontSize: 12, padding: '14px 28px', marginTop: 28 }}
        onClick={() => dispatch({ type: 'INTRO_WEITER' })}
      >
        ▸ TAG BEGINNT
      </button>
    </div>
  )
}
