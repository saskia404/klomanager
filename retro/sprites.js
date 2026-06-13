// Pixel-Sprites als Text-Raster — jede Zeile ein String, jeder
// Buchstabe ein Pixel (Farbe aus palette.js), '.' = durchsichtig.
// Vorteil: Sprites sind direkt im Code lesbar und änderbar wie
// ASCII-Art. Gemalt wird auf <canvas>, hochskaliert ohne Unschärfe.
import { PALETTE } from './palette.js'

// ── Gebäude (18 × 14 Pixel) ───────────────────────────────────────

export const GEBAEUDE_KNEIPE = [
  '..................',
  '.dddddddddddddddd.',
  '.DDDDDDDDDDDDDDDD.',
  '.rrrrrrrrrrrrrrrr.',
  '.raaaaaaaaaaaaaar.',
  '.raoaoaaooaoaaoar.',
  '.rrrrrrrrrrrrrrrr.',
  '.rffrrffrrffrrffr.',
  '.rffrrffrrffrrffr.',
  '.rRrrrrRrrrrRrrrr.',
  '.rffrrffrttttffrr.',
  '.rffrrffrttttffrr.',
  '.rRrrrrrrtottrrrr.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_COCKTAILBAR = [
  '..................',
  '.DDDDDDDDDDDDDDDD.',
  '.bbbbbbbbbbbbbbbb.',
  '.bnnnnnnnnnnnnnnb.',
  '.bnwnwnnwwnwnwnnb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFFFFbbFFFFFbbb.',
  '.bFnFFFbbFFFnFbbb.',
  '.bFFFFFbbFFFFFbbb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFFFFbbttttbbbb.',
  '.bFFnFFbbttttbbbb.',
  '.bbbbbbbbtottbbbb.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_CLUB = [
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

export const GEBAEUDE_SPATI = [
  '..................',
  '..................',
  '..................',
  '.gggggggggggggggg.',
  '.gllllllllllllllg.',
  '.glolloolollloolg.',
  '.ewewewewewewewew.',
  '.ewewewewewewewew.',
  '.gffffffgggffffgg.',
  '.gffffffgttgffffg.',
  '.gffffffgttgffffg.',
  '.gggggggtottggggg.',
  '.gGgGgGgGgGgGgGgg.',
  'oooooooooooooooooo',
]

export const GEBAEUDE_SHISHA = [
  '..................',
  '.dddddddddddddddd.',
  '.bbbbbbbbbbbbbbbb.',
  '.bppppppppppppppb.',
  '.bpwpwppwwpwpwppb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bffbbffbbffbbffb.',
  '.bffbbffbbffbbffb.',
  '.bbbbbbbbbbbbbbbb.',
  '.bFFbbFFbttbbFFbb.',
  '.bFFbbFFbttbbFFbb.',
  '.bbbbbbbbtotbbbbb.',
  '.bRbRbRbRbRbRbRbb.',
  'oooooooooooooooooo',
]

export const GEBAEUDE = {
  kneipe: GEBAEUDE_KNEIPE,
  cocktailbar: GEBAEUDE_COCKTAILBAR,
  club: GEBAEUDE_CLUB,
  spati: GEBAEUDE_SPATI,
  shisha: GEBAEUDE_SHISHA,
  nachtclub: GEBAEUDE_CLUB,
}

// ── Figuren (8 × 10 Pixel) — die Kundschaft ───────────────────────

export const FIGUR_HIPSTER = [   // Dutt, Bart, Jeans
  '...tt...',
  '..ssss..',
  '..stts..',   // Bart
  '...ss...',
  '.gggggg.',   // Cordjacke
  '.g.gg.g.',
  '..uuuu..',   // Jeans
  '..u..u..',
  '..u..u..',
  '..o..o..',
]

export const FIGUR_RAVER = [     // ganz in Schwarz, Sonnenbrille
  '..kkkk..',
  '..oooo..',   // Sonnenbrille
  '..ssss..',
  '..kkkk..',
  '.kkkkkk.',
  '.k.kk.k.',
  '..kkkk..',
  '..k..k..',
  '..k..k..',
  '..o..o..',
]

export const FIGUR_TOURIST = [   // Käppi, Kamera, kurze Hose
  '..eeee..',
  '..ssss..',
  '..ssss..',
  '.wwwwww.',
  '.w.oo.w.',   // Kamera
  '.wwwwww.',
  '..eeee..',
  '..s..s..',
  '..s..s..',
  '..o..o..',
]

export const FIGUR_STAMMGAST = [ // Torsten. Seit 1994 hier.
  '...gg...',
  '..ssss..',
  '..s..s..',
  '...ss...',
  '.TTTTTT.',
  '.T.TT.T.',
  '..TTTT..',
  '..u..u..',
  '..u..u..',
  '..o..o..',
]

export const FIGUREN = {
  hipster: FIGUR_HIPSTER,
  raver: FIGUR_RAVER,
  touristen: FIGUR_TOURIST,
  stammkunden: FIGUR_STAMMGAST,
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

export const ICON_BIER = [
  '..........',
  '.wwww.....',
  '.ffffww...',
  '.ffff.w...',
  '.ffff.w...',
  '.ffffww...',
  '.ffff.....',
  '.ffff.....',
  '.oooo.....',
  '..........',
]

export const ICON_BERND = [      // Ordnungsamt-Bernd mit Klemmbrett
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

export function spriteMasse(raster) {
  return { breite: raster[0].length, hoehe: raster.length }
}
