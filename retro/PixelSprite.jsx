// React-Komponente: malt ein Sprite-Raster auf ein <canvas>.
// 'pixelated' sorgt dafür, dass der Browser die Pixel NICHT
// weichzeichnet — das ist der ganze Trick hinter knackiger Pixel-Art.
import { useRef, useEffect } from 'react'
import { zeichneSprite, spriteMasse } from './sprites.js'

export default function PixelSprite({ raster, scale = 4, className = '', title }) {
  const ref = useRef(null)
  const { breite, hoehe } = spriteMasse(raster)

  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    ctx.clearRect(0, 0, breite * scale, hoehe * scale)
    zeichneSprite(ctx, raster, scale)
  }, [raster, scale, breite, hoehe])

  return (
    <canvas
      ref={ref}
      width={breite * scale}
      height={hoehe * scale}
      className={`pixel-canvas ${className}`}
      title={title}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
