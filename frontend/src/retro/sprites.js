// Pixel-Sprites als Text-Raster — jede Zeile ein String, jeder
// Buchstabe ein Pixel (Farbe aus palette.js), '.' = durchsichtig.
// Vorteil: Sprites sind direkt im Code lesbar und änderbar wie
// ASCII-Art. Gemalt wird auf <canvas>, hochskaliert ohne Unschärfe.
import { PALETTE } from './palette.js'

// ── Gebäude (18 × 14 Pixel) — ein Sprite pro WC-Typ ───────────────

export const GEBAEUDE_STANDARD = [
  '..................',
  '.dddddddddddddddd.',
  '.DDDDDDDDDDDDDDDD.',
  '.wwwwwwwwwwwwwwww.',
  '.wuuwwwwwwwwwwuuw.',
  '.wwwwwwppwwwwwwww.',
  '.wwwwwwppwwwwwwww.',
  '.wwFFwwwwwwwwFFww.',
  '.wwFFwwwwwwwwFFww.',
  '.wGwwwwwwwwwwwwGw.',
  '.wwwwwwttttwwwwww.',
  '.wwwwwwttttwwwwww.',
  '.GwwwwwwtottwwwwG.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_PISSOIR = [
  '..................',
  '..................',
  '..................',
  '.GGGGGGGGGGGGGGGG.',
  '.GzzzzzzzzzzzzzzG.',
  '.GzGzGGzGGzGGzGzG.',
  '.ewewewewewewewew.',
  '.GFFGGFFGGFFGGFFG.',
  '.GFFGGFFGGFFGGFFG.',
  '.GFFGGFFGGFFGGFFG.',
  '.GGGGGGttttGGGGGG.',
  '.GGGGGGttttGGGGGG.',
  '.GGGGGGGtottGGGGG.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_LUXUS = [
  '..................',
  '.DDDDDDDDDDDDDDDD.',
  '.wwwwwwwwwwwwwwww.',
  '.wggggggggggggggw.',
  '.wgwgwwgggwgwgwwg.',
  '.wwwwwwwwwwwwwwww.',
  '.wFFFFFmmFFFFFwww.',
  '.wFmFFFmmFFFmFwww.',
  '.wFFFFFmmFFFFFwww.',
  '.wwwwwwwwwwwwwwww.',
  '.wFFmFFwwttttwwww.',
  '.wFmmFFwwttttwwww.',
  '.wwwwwwwwtottwwww.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_BEHINDERTEN = [
  '..................',
  '.dddddddddddddddd.',
  '.bbbbbbbbbbbbbbbb.',
  '.buuuuuuuuuuuuuub.',
  '.buwuwuuwwuwuwuub.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFFFFuuFFFFFbbb.',
  '.bFuFFFuuFFFuFbbb.',
  '.bFFFFFuuFFFFFbbb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFFFFbbttttbbbb.',
  '.bFuFFFbbttttbbbb.',
  '.bbbbbbbbtottbbbb.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_FAMILIEN = [
  '..................',
  '.DDDDDDDDDDDDDDDD.',
  '.bbbbbbbbbbbbbbbb.',
  '.bnnnnnnnnnnnnnnb.',
  '.bnfnfnnffnfnfnnb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFFFFbbFFFFFbbb.',
  '.bFnFFFbbFFFnFbbb.',
  '.bFFFFFbbFFFFFbbb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFFFFbbttttbbbb.',
  '.bFnFFFbbttttbbbb.',
  '.bbbbbbbbtottbbbb.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_DUSCHE = [
  '..................',
  '.dddddddddddddddd.',
  '.kkkkkkkkkkkkkkkk.',
  '.kccccccccccccckk.',
  '.kckckkcckckkcckk.',
  '.kkkkkkkkkkkkkkkk.',
  '.kKkkkKkkkkKkkkKk.',
  '.kkkkkkkkkkkkkkkk.',
  '.kkFFkkkkkkkFFkkk.',
  '.kKkkkKkkkkKkkkKk.',
  '.kkkkkkttttkkkkkk.',
  '.kKkkkkttttkkkkKk.',
  '.kkkkkktottkkkkkk.',
  'oooooooooooooooooo',
]

export const GEBAEUDE = {
  standard: GEBAEUDE_STANDARD,
  pissoir: GEBAEUDE_PISSOIR,
  luxus: GEBAEUDE_LUXUS,
  behinderten: GEBAEUDE_BEHINDERTEN,
  familien: GEBAEUDE_FAMILIEN,
  dusche: GEBAEUDE_DUSCHE,
}

// ── Figuren (8 × 10 Pixel) — die Kundschaft je Standort ───────────

export const FIGUR_PENDLER = [   // Anzug, Aktentasche — Bahnhof
  '...ss...',
  '..ssss..',
  '..s..s..',
  '...ss...',
  '.kkkkkk.',
  '.k.kk.k.',
  '..kkkk..',
  '.tk..kt.',
  '..k..k..',
  '..o..o..',
]

export const FIGUR_SOLDAT = [    // Tarnfarben — Kaserne
  '...ll...',
  '..ssss..',
  '..stts..',
  '...ss...',
  '.GGGGGG.',
  '.G.GG.G.',
  '..llll..',
  '..l..l..',
  '..l..l..',
  '..o..o..',
]

export const FIGUR_FAN = [       // Trikot — Stadion
  '...ss...',
  '..ssss..',
  '..ssss..',
  '..nccn..',
  '.nccccn.',
  '.n.cc.n.',
  '..uuuu..',
  '..u..u..',
  '..u..u..',
  '..o..o..',
]

export const FIGUR_TOURIST = [   // Käppi, Kamera — Fußgängerzone
  '..eeee..',
  '..ssss..',
  '..ssss..',
  '.wwwwww.',
  '.w.oo.w.',
  '.wwwwww.',
  '..eeee..',
  '..s..s..',
  '..s..s..',
  '..o..o..',
]

export const FIGUR_VIELFLIEGER = [ // Anzug + Rollkoffer — Flughafen
  '...ss...',
  '..ssss..',
  '..s..s..',
  '...ss...',
  '.kkkkkk.',
  '.k.kk.kg',
  '..kkkkg.',
  '..k..kg.',
  '..k..k..',
  '..o..o..',
]

export const FIGUREN = {
  bf: FIGUR_PENDLER,
  ks: FIGUR_SOLDAT,
  st: FIGUR_FAN,
  fz: FIGUR_TOURIST,
  fh: FIGUR_VIELFLIEGER,
}

// ── Icons (10 × 10 Pixel) ─────────────────────────────────────────

export const ICON_EURO = [
  '...yyyy...',
  '..y....y..',
  '.y......y.',
  'yyyy......',
  '.y........',
  'yyyy......',
  '.y......y.',
  '..y....y..',
  '...yyyy...',
  '..........',
]

export const ICON_KLOPAPIER = [
  '..wwwwww..',
  '.wwwwwwww.',
  'wwwwoowwww',
  'wwwoTTowww',
  'wwwoTTowww',
  'wwwwoowwww',
  '.wwwwwwww.',
  '..wwwwww..',
  '..........',
  '..........',
]

export const ICON_AMT = [        // Gesundheitsamt-Kontrolleurin mit Klemmbrett
  '...gg.....',
  '..ssss....',
  '..ssss....',
  '.uuuuuu...',
  '.u.uu.u.ww',
  '.uuuuuu.wo',
  '..uuuu..ww',
  '..u..u..wo',
  '..u..u..ww',
  '..o..o....',
]

export const ICON_KAPUTT = [     // zerbrochene Scheibe (Vandalismus)
  'FFFFFFFFFF',
  'FFFwFFFFFF',
  'FFwFwFFFFF',
  'FwFFFwFFFF',
  'FFFwFFwFFF',
  'FFwFwFFFFF',
  'FwFFFwFwFF',
  'FFFFwFFFwF',
  'FFFwFFFFFF',
  'FFFFFFFFFF',
]

export const ICON_STERN = [
  '....ww....',
  '....ww....',
  '.wwwwwwww.',
  '..wwwwww..',
  '...wwww...',
  '..ww..ww..',
  '.w......w.',
  '..........',
  '..........',
  '..........',
]

// Senfgelbe Klobrille — Klomanager-Markenzeichen, markiert eigene Klos
export const ICON_KLOBRILLE = [
  '..mmmmmm..',
  '.mMMMMMMm.',
  'mM......Mm',
  'mM......Mm',
  'mM......Mm',
  'mM......Mm',
  'mM......Mm',
  'mM......Mm',
  '.mMMMMMMm.',
  '..mmmmmm..',
]

// WC-Schild — weißes Pictogramm-Schild, markiert jede Toilette auf
// der Stadtkarte (wie die kleinen WC-Symbole auf der Klomanager-Karte)
export const ICON_WC_SCHILD = [
  'wwwwwwwwww',
  'wwwoooowww',
  'wwwoooowww',
  'wwwwoowwww',
  'wwooooooww',
  'woooooooow',
  'woooooooow',
  'woooooooow',
  'wooowwooow',
  'wooowwooow',
]

// ── Großes Klobecken (22 × 25 Pixel) ──────────────────────────────
// Detail-Sprite fürs Klo-Innere. Nutzt Platzhalter-Buchstaben statt
// fester Farben: B = Grundfarbe, H = Glanzlicht, S = Schatten.
// InnenSzene.jsx ersetzt B/H/S je nach Material (Keramik, Holz,
// Marmor, Gold) über zeichneSpriteEingefaerbt(). 'o' = Umriss,
// '.' = durchsichtig.
export const KLOBECKEN = [
  '..oooooooooooooooooo..',
  '...oHHHHHHHHHHHHHSo...',
  '...oHHHHHHBBBBBBBSo...',
  '...oHHHHHHBBBBBBBSo...',
  '...oHHHHHBBBBBBBSSo...',
  '...oHHHHHBBBBBBBSSo...',
  '...oHHHHHBBBBBBBSSo...',
  '...oHHHHHBBBBBBBSSo...',
  '...oooooooooooooooo...',
  '...SSSSSSSSSSSSSSSS...',
  '.........oBBo.........',
  '.........oBBo.........',
  '.....oHHHHHHHHHHo.....',
  '.....oHHHHBBBBBSo.....',
  '...oHHHHHBBBBBBBSSo...',
  '...oHHHHHBBBBBBBSSo...',
  '...oHHHHBBBBBBBBSSo...',
  '...oHHHHBBBBBBBBSSo...',
  '...oHHHBBBBBBBBSSSo...',
  '...oHHHBBBBBBBBSSSo...',
  '...SSSSSSSSSSSSSSSS...',
  '...oooooooooooooooo...',
  '......oBBBBBBBBo......',
  '......oBBBBBBBBo......',
  '......oooooooooo......',
]

// ── Zeichen-Engine ────────────────────────────────────────────────

// Malt ein Sprite-Raster auf einen Canvas-Kontext.
// scale = wie viele echte Pixel pro Sprite-Pixel.
export function zeichneSprite(ctx, raster, scale = 4, offsetX = 0, offsetY = 0) {
  for (let y = 0; y < raster.length; y++) {
    for (let x = 0; x < raster[y].length; x++) {
      const farbe = PALETTE[raster[y][x]]
      if (!farbe) continue              // '.' oder unbekannt = durchsichtig
      ctx.fillStyle = farbe
      ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale)
    }
  }
}

// Wie zeichneSprite, aber mit eigener Farbtabelle statt PALETTE —
// für Sprites mit austauschbaren Material-Farben (z.B. Klobecken:
// B/H/S = Grundfarbe/Glanzlicht/Schatten je nach Ausstattung).
// Buchstaben, die nicht in farbkarte stehen, fallen auf PALETTE
// zurück (z.B. 'o' für den Umriss).
export function zeichneSpriteEingefaerbt(ctx, raster, farbkarte, scale = 4, offsetX = 0, offsetY = 0) {
  for (let y = 0; y < raster.length; y++) {
    for (let x = 0; x < raster[y].length; x++) {
      const zeichen = raster[y][x]
      const farbe = farbkarte[zeichen] ?? PALETTE[zeichen]
      if (!farbe) continue
      ctx.fillStyle = farbe
      ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale)
    }
  }
}

export function spriteMasse(raster) {
  return { breite: raster[0].length, hoehe: raster.length }
}
