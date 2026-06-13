// Klo-Screen — hier wird verwaltet: kaufen, ausbauen, Personal,
// Eintrittspreis, Reinigung, Ruf und die Tagesaktion (Werbung/
// Gerüchte). Gehört das Klo einer anderen Person (oder Dieter),
// gibt's nur eine Übersicht — verwalten geht nur mit eigenen Klos.
import { useState } from 'react'
import InnenSzene from '../retro/InnenSzene.jsx'
import { TOILETTEN, TOILETTEN_TYPEN } from '../data/toiletten.js'
import { STANDORTE } from '../data/standorte.js'
import { AUSSTATTUNG, PERSONAL_OPTIONEN } from '../data/ausstattung.js'
import { PREIS_OPTIONEN, PREIS_REIHENFOLGE, REINIGUNG_KOSTEN, MARKETING_KOSTEN, SABOTAGE_KOSTEN } from '../data/strategie.js'

// Retro-Balken aus Block-Zeichen: 7/10 → ███████░░░
function Balken({ wert, max = 10, klasse }) {
  const blocks = Math.round((wert / max) * 10)
  return (
    <span className={klasse}>
      {'█'.repeat(Math.max(0, blocks))}{'░'.repeat(Math.max(0, 10 - blocks))}
    </span>
  )
}

function risikoKlasse(wert) {
  return wert <= 3 ? 'gruen' : wert <= 6 ? 'amber' : 'rot'
}

function sauberkeitKlasse(wert) {
  return wert >= 60 ? 'gruen' : wert >= 30 ? 'amber' : 'rot'
}

function rufKlasse(wert) {
  return wert >= 60 ? 'gruen' : wert >= 35 ? 'amber' : 'rot'
}

export default function ToiletteScreen({ spiel, dispatch }) {
  const toilette = TOILETTEN.find(t => t.id === spiel.screen.toilettenId)
  const aktiver = spiel.spieler[spiel.aktiverSpielerIndex]
  const [geruechteZiel, setGeruechteZiel] = useState('')
  if (!toilette) return null

  const klo = spiel.klos[toilette.id]          // undefined = noch nicht gekauft
  const gekauft = !!klo?.besitzer
  const besitzer = gekauft ? spiel.spieler.find(s => s.id === klo.besitzer) : null
  const eigenesKlo = gekauft && klo.besitzer === aktiver.id
  const ausstattungsListe = AUSSTATTUNG[toilette.typ] ?? []
  const typLabel = TOILETTEN_TYPEN[toilette.typ]

  // Mögliche Gerüchte-Ziele: Klos anderer Besitzer
  const fremdeToiletten = Object.entries(spiel.klos)
    .filter(([, k]) => k.besitzer && k.besitzer !== aktiver.id)
    .map(([id]) => TOILETTEN.find(t => t.id === id))
    .filter(Boolean)

  return (
    <>
      <button className="pixel-btn" onClick={() => dispatch({ type: 'ZEIGE', screen: { name: 'stadt' } })}>
        ◂ STADTPLAN
      </button>

      <div className="klo-screen">

        {/* ── Linke Spalte: Innenansicht + Beschreibung ── */}
        <div className="panel">
          <div className="panel-titel">
            {typLabel.emoji} {toilette.name.toUpperCase()} — {typLabel.name.toUpperCase()} · {STANDORTE[toilette.standort].name.toUpperCase()}
          </div>

          {besitzer && (
            <div className="zeile" style={{ marginBottom: 8 }}>
              <span>Besitzer</span>
              <b style={{ color: besitzer.farbe }}>{besitzer.name}</b>
            </div>
          )}

          <InnenSzene
            toilette={toilette}
            gekauft={gekauft}
            anzahlAusstattung={klo?.ausstattung.length ?? 0}
            anzahlPersonal={klo?.personal.length ?? 0}
            sauberkeit={klo?.sauberkeit ?? 100}
          />

          <div className="beschreibung">"{toilette.beschreibung}"</div>
        </div>

        {/* ── Rechte Spalte: Zahlen + Aktionen ── */}
        <div className="panel">
          <div className="panel-titel">[ FINANZEN ]</div>
          <div className="zeile"><span>Kaufpreis</span><b className="amber">{toilette.kaufpreis.toLocaleString('de-DE')} €</b></div>
          <div className="zeile"><span>Miete / Monat</span><b className="rot">{toilette.mieteMonat.toLocaleString('de-DE')} €</b></div>
          <div className="zeile"><span>Tagesumsatz ca.</span><b className="gruen">{toilette.umsatzMin.toLocaleString('de-DE')}–{toilette.umsatzMax.toLocaleString('de-DE')} €</b></div>

          <div className="panel-titel" style={{ marginTop: 16 }}>[ RISIKEN ]</div>
          <div className="zeile">
            <span>Vandalismus</span>
            <Balken wert={toilette.vandalismusRisiko} klasse={risikoKlasse(toilette.vandalismusRisiko)} />
          </div>
          <div className="zeile">
            <span>Gesundheitsamt</span>
            <Balken wert={toilette.gesundheitsamtRisiko} klasse={risikoKlasse(toilette.gesundheitsamtRisiko)} />
          </div>

          {/* ── Sauberkeit & Ruf: nur sichtbar, wenn das Klo jemandem gehört ── */}
          {gekauft && (
            <>
              <div className="panel-titel" style={{ marginTop: 16 }}>[ ZUSTAND ]</div>
              <div className="zeile">
                <span>Sauberkeit</span>
                <span><Balken wert={klo.sauberkeit} max={100} klasse={sauberkeitKlasse(klo.sauberkeit)} /> {klo.sauberkeit}%</span>
              </div>
              <div className="zeile">
                <span>Ruf</span>
                <span><Balken wert={klo.ruf} max={100} klasse={rufKlasse(klo.ruf)} /> {klo.ruf}/100</span>
              </div>
            </>
          )}

          {/* ── Kaufen oder Verwalten ── */}
          {!gekauft ? (
            <button
              className="pixel-btn primaer"
              style={{ width: '100%', marginTop: 18 }}
              onClick={() => dispatch({ type: 'KAUFEN', toilette })}
              disabled={aktiver.kasse < toilette.kaufpreis}
            >
              KAUFEN — {toilette.kaufpreis.toLocaleString('de-DE')} €
            </button>
          ) : !eigenesKlo ? (
            <div className="dim" style={{ marginTop: 18, fontSize: 12 }}>
              Dieses Klo gehört {besitzer.name}. Lass die Finger davon — oder
              streu Gerüchte, wenn du selbst ein Klo besitzt.
            </div>
          ) : (
            <>
              {/* ── Eintrittspreis ── */}
              <div className="panel-titel" style={{ marginTop: 16 }}>[ EINTRITTSPREIS ]</div>
              <div className="aktion-reihe">
                {PREIS_REIHENFOLGE.map(id => {
                  const opt = PREIS_OPTIONEN[id]
                  return (
                    <button
                      key={id}
                      className={`pixel-btn ${klo.preis === id ? 'primaer' : ''}`}
                      style={{ fontSize: 9, padding: '6px 8px', flex: 1 }}
                      title={opt.beschreibung}
                      onClick={() => dispatch({ type: 'PREIS', toilettenId: toilette.id, preis: id })}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  )
                })}
              </div>
              <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>
                {PREIS_OPTIONEN[klo.preis].beschreibung}
              </div>

              {/* ── Reinigung ── */}
              <div className="panel-titel" style={{ marginTop: 16 }}>[ REINIGUNG ]</div>
              <div className="zeile">
                <span className="dim">Das Klo-Manager-Prinzip: dreckig = weniger Gäste, mehr Dr. Pissulke.</span>
              </div>
              <button
                className="pixel-btn"
                style={{ width: '100%', marginTop: 6 }}
                disabled={klo.sauberkeit >= 100 || aktiver.kasse < REINIGUNG_KOSTEN}
                onClick={() => dispatch({ type: 'REINIGEN', toilettenId: toilette.id })}
              >
                🧹 REINIGEN — {REINIGUNG_KOSTEN.toLocaleString('de-DE')} €
              </button>

              {/* ── Tagesaktion ── */}
              <div className="panel-titel" style={{ marginTop: 16 }}>[ AKTION HEUTE ]</div>
              <div className="aktion-reihe">
                <button
                  className={`pixel-btn ${!klo.aktion ? 'primaer' : ''}`}
                  style={{ fontSize: 9, padding: '6px 8px', flex: 1 }}
                  onClick={() => dispatch({ type: 'AKTION', toilettenId: toilette.id, aktion: null })}
                >
                  KEINE
                </button>
                <button
                  className={`pixel-btn ${klo.aktion?.typ === 'werbung' ? 'primaer' : ''}`}
                  style={{ fontSize: 9, padding: '6px 8px', flex: 1 }}
                  disabled={aktiver.kasse < MARKETING_KOSTEN}
                  title={`Kostet ${MARKETING_KOSTEN}€, +15% Umsatz heute, Ruf +3`}
                  onClick={() => dispatch({ type: 'AKTION', toilettenId: toilette.id, aktion: { typ: 'werbung' } })}
                >
                  📣 WERBUNG
                </button>
              </div>
              {klo.aktion?.typ === 'werbung' && (
                <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>
                  📣 Werbeplakat ({MARKETING_KOSTEN.toLocaleString('de-DE')} €): +15% Umsatz heute, Ruf +3.
                </div>
              )}

              {fremdeToiletten.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div className="zeile">
                    <span className="dim" style={{ fontSize: 11 }}>
                      🎯 Gerüchte streuen ({SABOTAGE_KOSTEN.toLocaleString('de-DE')} €, -18% Umsatz & Ruf -4 fürs Ziel,
                      25% Risiko erwischt zu werden)
                    </span>
                  </div>
                  <div className="aktion-reihe">
                    <select
                      className="pixel-select"
                      value={klo.aktion?.typ === 'geruechte' ? klo.aktion.ziel : geruechteZiel}
                      onChange={e => setGeruechteZiel(e.target.value)}
                    >
                      <option value="">— Ziel wählen —</option>
                      {fremdeToiletten.map(t => {
                        const zielBesitzer = spiel.spieler.find(s => s.id === spiel.klos[t.id]?.besitzer)
                        return (
                          <option key={t.id} value={t.id}>
                            {t.name} ({zielBesitzer?.name})
                          </option>
                        )
                      })}
                    </select>
                    <button
                      className={`pixel-btn ${klo.aktion?.typ === 'geruechte' ? 'gefahr' : ''}`}
                      style={{ fontSize: 9, padding: '6px 8px' }}
                      disabled={!geruechteZiel && klo.aktion?.typ !== 'geruechte' || aktiver.kasse < SABOTAGE_KOSTEN}
                      onClick={() => {
                        const ziel = klo.aktion?.typ === 'geruechte' ? klo.aktion.ziel : geruechteZiel
                        if (!ziel) return
                        dispatch({ type: 'AKTION', toilettenId: toilette.id, aktion: { typ: 'geruechte', ziel } })
                      }}
                    >
                      GERÜCHTE STREUEN
                    </button>
                  </div>
                </div>
              )}

              {/* ── Ausstattung ── */}
              <div className="panel-titel" style={{ marginTop: 16 }}>[ AUSSTATTUNG ]</div>
              {ausstattungsListe.map(a => {
                const eingebaut = klo.ausstattung.includes(a.id)
                return (
                  <div className="zeile" key={a.id}>
                    <span title={a.beschreibung}>{a.name} <span className="dim">+{a.revenueBonus} €/Tag</span></span>
                    {eingebaut ? (
                      <span className="gruen">✓ DRIN</span>
                    ) : (
                      <button
                        className="pixel-btn"
                        style={{ fontSize: 8, padding: '4px 8px' }}
                        disabled={aktiver.kasse < a.kosten}
                        onClick={() => dispatch({ type: 'AUSSTATTUNG_KAUFEN', toilettenId: toilette.id, ausstattungId: a.id })}
                      >
                        {a.kosten.toLocaleString('de-DE')} €
                      </button>
                    )}
                  </div>
                )
              })}

              <div className="panel-titel" style={{ marginTop: 16 }}>[ PERSONAL ]</div>
              {PERSONAL_OPTIONEN.map(p => {
                const eingestellt = klo.personal.includes(p.id)
                return (
                  <div className="zeile" key={p.id}>
                    <span title={p.beschreibung}>{p.name} <span className="dim">{p.tageskosten} €/Tag</span></span>
                    <button
                      className={`pixel-btn ${eingestellt ? 'gefahr' : ''}`}
                      style={{ fontSize: 8, padding: '4px 8px' }}
                      onClick={() => dispatch({ type: 'PERSONAL', toilettenId: toilette.id, personalId: p.id })}
                    >
                      {eingestellt ? 'FEUERN' : 'EINSTELLEN'}
                    </button>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </>
  )
}
