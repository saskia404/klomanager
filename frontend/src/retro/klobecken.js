// Glossy-Klobecken — "Glossy-Look per Code": statt eines Pixel-Rasters
// aus einzelnen B/H/S-Kästchen wird das Becken jetzt mit Farbverläufen
// (Gradients) und runden Formen (Ellipsen, abgerundete Rechtecke)
// gezeichnet. Das soll an die glatten, "gerenderten" 3D-Becken aus
// Klomanager Deluxe erinnern — bleibt aber 100% Code, keine Bilder.
import { PALETTE } from './palette.js'

// Drei Farbtöne je Material: hell (Glanzkante), mitte (Grundfarbe),
// dunkel (Schatten). Die Gradients blenden zwischen diesen Tönen.
const MATERIAL_FARBEN = {
  standard: { hell: '#ffffff', mitte: '#f4f0e6', dunkel: '#b8b0a0' }, // Keramik weiß
  holz:     { hell: '#a87b4f', mitte: '#6b4528', dunkel: '#3a2515' }, // Holzbrille
  marmor:   { hell: '#e4e4ea', mitte: '#9a9aa0', dunkel: '#5a5a64' }, // Marmorbrille
  gold:     { hell: '#fff6c2', mitte: '#d4a629', dunkel: '#8a6a14' }, // Goldbrille
}

// Pfad für ein abgerundetes Rechteck (kompatibler als ctx.roundRect)
function rundesRechteck(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// Zeichnet das große Klobecken (Spülkasten, Sitz, Schüssel, Sockel)
// bei (ox, oy) — alles in echten Canvas-Pixeln (schon mit SCALE
// multipliziert). t = Animationszeit in Sekunden für den Goldglanz.
export function zeichneKlobecken(ctx, material, ox, oy, t, getraenkehalter = false) {
  const f = MATERIAL_FARBEN[material] ?? MATERIAL_FARBEN.standard
  ctx.lineWidth = 2
  ctx.strokeStyle = PALETTE.o

  // ── Sockel (Trapez, schmal nach unten) ──
  const sockelGrad = ctx.createLinearGradient(ox + 28, oy + 135, ox + 102, oy + 158)
  sockelGrad.addColorStop(0, f.mitte)
  sockelGrad.addColorStop(1, f.dunkel)
  ctx.fillStyle = sockelGrad
  ctx.beginPath()
  ctx.moveTo(ox + 28, oy + 135)
  ctx.lineTo(ox + 102, oy + 135)
  ctx.lineTo(ox + 85, oy + 158)
  ctx.lineTo(ox + 45, oy + 158)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // ── Becken-Korpus (große Ellipse, glänzt oben links) ──
  const beckenGrad = ctx.createLinearGradient(ox + 17, oy + 70, ox + 113, oy + 146)
  beckenGrad.addColorStop(0, f.hell)
  beckenGrad.addColorStop(0.55, f.mitte)
  beckenGrad.addColorStop(1, f.dunkel)
  ctx.fillStyle = beckenGrad
  ctx.beginPath()
  ctx.ellipse(ox + 65, oy + 108, 48, 38, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // ── Spülrohr (verbindet Kasten und Becken) ──
  const rohrGrad = ctx.createLinearGradient(ox + 58, oy + 52, ox + 76, oy + 68)
  rohrGrad.addColorStop(0, f.mitte)
  rohrGrad.addColorStop(1, f.dunkel)
  ctx.fillStyle = rohrGrad
  ctx.fillRect(ox + 58, oy + 52, 18, 16)
  ctx.strokeRect(ox + 58, oy + 52, 18, 16)

  // ── Spülkasten (abgerundetes Rechteck) ──
  const kastenGrad = ctx.createLinearGradient(ox + 24, oy + 10, ox + 106, oy + 54)
  kastenGrad.addColorStop(0, f.hell)
  kastenGrad.addColorStop(1, f.dunkel)
  ctx.fillStyle = kastenGrad
  rundesRechteck(ctx, ox + 24, oy + 10, 82, 44, 8)
  ctx.fill()
  ctx.stroke()

  // ── Deckel ──
  const deckelGrad = ctx.createLinearGradient(ox + 18, oy, ox + 112, oy + 14)
  deckelGrad.addColorStop(0, f.hell)
  deckelGrad.addColorStop(1, f.mitte)
  ctx.fillStyle = deckelGrad
  rundesRechteck(ctx, ox + 18, oy, 94, 14, 5)
  ctx.fill()
  ctx.stroke()

  // ── Klobrillen-Ring (Sitzfläche) ──
  const ringGrad = ctx.createLinearGradient(ox + 25, oy + 63, ox + 105, oy + 93)
  ringGrad.addColorStop(0, f.hell)
  ringGrad.addColorStop(1, f.mitte)
  ctx.fillStyle = ringGrad
  ctx.beginPath()
  ctx.ellipse(ox + 65, oy + 78, 40, 15, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // ── Öffnung — dunkles Loch in der Brille ──
  ctx.fillStyle = '#2a2a36'
  ctx.beginPath()
  ctx.ellipse(ox + 65, oy + 78, 29, 10, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Getränkehalter — das berühmte Upgrade ──
  if (getraenkehalter) {
    const becherGrad = ctx.createLinearGradient(ox + 108, oy + 92, ox + 124, oy + 118)
    becherGrad.addColorStop(0, '#9af0ff')
    becherGrad.addColorStop(1, PALETTE.c)
    ctx.fillStyle = becherGrad
    rundesRechteck(ctx, ox + 108, oy + 92, 16, 26, 5)
    ctx.fill()
    ctx.stroke()
  }

  // ── Goldene Brille glänzt gelegentlich (animierter Lichtfleck) ──
  if (material === 'gold') {
    const glanz = 0.15 + 0.2 * (0.5 + 0.5 * Math.sin(t * 2.4))
    const glanzGrad = ctx.createRadialGradient(ox + 45, oy + 90, 2, ox + 45, oy + 90, 26)
    glanzGrad.addColorStop(0, `rgba(255,255,255,${0.5 + glanz})`)
    glanzGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glanzGrad
    ctx.beginPath()
    ctx.ellipse(ox + 45, oy + 90, 26, 20, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}
