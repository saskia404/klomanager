// Pixel-Innenansicht eines Klos — wird live auf Canvas gezeichnet
// UND animiert (requestAnimationFrame): Gäste schwanken/laufen leicht
// in der Schlange, das WC-Leuchtschild flackert, ab und zu glitzert
// eine Fliese. Ist der Laden dreckig (Sauberkeit < 40), schwirren
// Fliegen rum.
import { useRef, useEffect } from 'react'
import { PALETTE } from './palette.js'
import { zeichneSprite, FIGUREN } from './sprites.js'

// Wand-/Boden-Farben je WC-Typ
const RAUM_FARBEN = {
  standard:    { wand: '#3a4a5a', boden: '#222e38' },
  pissoir:     { wand: '#3e4a3e', boden: '#26302a' },
  luxus:       { wand: '#5a5440', boden: '#3a3528' },
  behinderten: { wand: '#2e3e5a', boden: '#1c2638' },
  familien:    { wand: '#5a3e4a', boden: '#382630' },
  dusche:      { wand: '#2e545a', boden: '#1c3438' },
}

const FLIESEN_FARBEN = ['#3fe0ff', '#f4f0e6', '#ffb347', '#7dff5a', '#ff4d8f']

// Breite/Höhe der Szene in Sprite-Pixeln
const B = 110
const H = 52
const SCALE = 5

export default function InnenSzene({ toilette, gekauft, anzahlAusstattung = 0, anzahlPersonal = 0, sauberkeit = 100 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const raum = RAUM_FARBEN[toilette.typ] ?? RAUM_FARBEN.standard
    const figur = FIGUREN[toilette.standort] ?? FIGUREN.bf
    const px = (x, y, w, h, farbe) => {
      ctx.fillStyle = farbe
      ctx.fillRect(x * SCALE, y * SCALE, w * SCALE, h * SCALE)
    }

    const start = performance.now()
    let frameId

    const zeichneFrame = (jetzt) => {
      const t = (jetzt - start) / 1000   // Sekunden seit Start

      // ── Raum ──
      px(0, 0, B, H, raum.wand)                 // Wand
      px(0, H - 14, B, 14, raum.boden)          // Boden
      px(0, H - 14, B, 1, PALETTE.o)            // Bodenkante

      // ── Kabinentüren an der Wand (gelegentliches Fliesen-Glitzern) ──
      px(4, 6, 70, 18, PALETTE.t)
      for (let i = 0; i < 5; i++) {
        px(6 + i * 14, 8, 11, 14, PALETTE.T)
        const glitzert = (Math.sin(t * 1.7 + i * 2.1) > 0.985)
        ctx.globalAlpha = glitzert ? 1 : 0.85
        px(14 + i * 14, 13, 1, 4, FLIESEN_FARBEN[i % FLIESEN_FARBEN.length])
        ctx.globalAlpha = 1
      }

      // ── Waschbecken-Reihe ──
      px(4, 28, 38, 3, PALETTE.T)               // Platte
      px(6, 31, 34, 9, PALETTE.t)               // Korpus
      px(6, 31, 34, 1, PALETTE.o)

      // ── Hahn / Spiegel-Deko je nach Typ ──
      if (toilette.typ === 'dusche') {
        px(10, 24, 2, 4, PALETTE.c)
        px(10, 23, 4, 1, PALETTE.c)
      } else if (toilette.typ === 'luxus') {
        px(10, 24, 2, 4, PALETTE.y)
        px(10, 23, 4, 1, PALETTE.y)
      }

      // ── WC-Leuchtschild ab 1 Ausstattung — flackert munter ──
      if (anzahlAusstattung >= 1) {
        for (let i = 0; i < 13; i++) {
          const helligkeit = 0.55 + 0.45 * Math.sin(t * 3 + i * 0.9)
          ctx.globalAlpha = Math.max(0.25, helligkeit)
          px(4 + i * 8, 2, 2, 2, FLIESEN_FARBEN[i % FLIESEN_FARBEN.length])
          ctx.globalAlpha = 1
        }
      }

      // ── Klofrau/-mann am Eingang (wenn eingestellt), wippt leicht ──
      if (anzahlPersonal >= 1) {
        const wipp = Math.sin(t * 1.4) * 0.4
        zeichneSprite(ctx, figur, SCALE, 14 * SCALE, (19 + wipp) * SCALE)
      }

      // ── Wartende Gäste: Anzahl wächst mit Ausbau, schwanken/laufen ──
      if (gekauft) {
        const anzahl = Math.min(6, 1 + anzahlAusstattung + anzahlPersonal)
        for (let i = 0; i < anzahl; i++) {
          // Leichtes Schwanken (Ungeduld) + langsames Hin-und-Her-Schlendern
          const schwanken = Math.sin(t * 2 + i * 1.7) * 0.6
          const schlendern = Math.sin(t * 0.35 + i * 2.3) * 1.5
          const x = 50 + i * 9 + (i % 2) * 2 + schlendern
          const y = 26 + (i % 3) * 4 + schwanken
          zeichneSprite(ctx, figur, SCALE, x * SCALE, y * SCALE)
        }
      }

      // ── Dreckig? Dann schwirren Fliegen über dem Becken ──
      if (gekauft && sauberkeit < 40) {
        const anzahlFliegen = sauberkeit < 15 ? 4 : 2
        ctx.fillStyle = PALETTE.o
        for (let i = 0; i < anzahlFliegen; i++) {
          const fx = 20 + i * 14 + Math.sin(t * 4 + i * 2) * 6
          const fy = 22 + Math.cos(t * 5 + i * 3) * 3
          ctx.fillRect(fx * SCALE, fy * SCALE, SCALE, SCALE)
        }
      }

      frameId = requestAnimationFrame(zeichneFrame)
    }

    frameId = requestAnimationFrame(zeichneFrame)
    return () => cancelAnimationFrame(frameId)
  }, [toilette, gekauft, anzahlAusstattung, anzahlPersonal, sauberkeit])

  return (
    <div className="szene-rahmen">
      <canvas
        ref={ref}
        width={B * SCALE}
        height={H * SCALE}
        style={{ imageRendering: 'pixelated', width: '100%', display: 'block' }}
      />
      {!gekauft && <div className="szene-overlay pixel-font">ZU VERKAUFEN</div>}
    </div>
  )
}
