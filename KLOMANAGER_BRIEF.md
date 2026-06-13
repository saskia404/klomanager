# Klomanager — Originalgetreuer Nachbau (Projekt-Brief)

## Worum geht's
Du willst das Original **"Klomanager"** (Atari ST, 1995, von Matthias
Hofmann & Ronald Wendt / Anvil-Soft) nachbauen — als eigenständiges
Projekt, getrennt von Kiez Manager (das ja nur *vom Stil* inspiriert ist,
aber ein eigenes Bar-Spiel ist).

### Das Originalspiel (Recherche-Stand)
- Du bist **WC-Manager** und verwaltest mehrere öffentliche Toiletten
  einer Stadt.
- Du mietest **Standorte** (Bahnhof, Kaserne, etc.) und baust dort
  Toiletten + Extras ein.
- **Ausstattung/Upgrades:** Klobrille (Plastik → Marmor → Gold),
  Seidentoilettenpapier, Seifenspender, Händetrockner, Kondomautomat
  ("Cond-O-Mat") als zusätzliche Einnahmequelle, in späteren Versionen
  sogar Klobrillen mit Getränkehalter.
- **Sauberkeit ist der Kern-Mechanismus** ("das Klo-Manager-Prinzip") —
  gepflegte Klos = mehr zahlende Besucher.
- Bis zu **4 Spieler**, rundenbasiert, grafische Menüs.
- **Konkurrenten mit witzigen Namen** sabotieren dich mit Gerüchten und
  Vandalismus — du kannst zurückschlagen, das Gesundheitsamt spielt
  ebenfalls eine Rolle.
- Ziel: am Ende am meisten Geld + Auszeichnungen → "Klomanager" werden.
- Optik original: 16 Farben, 320×200 Pixel (Atari ST).

Quellen: [Wikipedia – Klomanager](https://de.wikipedia.org/wiki/Klomanager),
[Atari Legend](https://www.atarilegend.com/games/klo-manager)

## Warum ein eigenes Repo (statt Branch in kiezmanager)
- **Anderes Spiel, eigene Identität** — Klomanager ist das Original,
  Kiez Manager die Berlin-Bar-Neuinterpretation. Getrennte Repos =
  weniger Verwechslungsgefahr, jedes Projekt kann unabhängig wachsen,
  eigenes README/eigene Releases.
- **Aber:** die *Technik* aus dem `feature/retro-klomanager`-Branch von
  Kiez Manager passt verblüffend gut als Vorlage — siehe unten. Du
  fängst also nicht bei null an, sondern kopierst dir ein
  funktionierendes Grundgerüst und baust es zum Original um.

**Empfehlung:** Neues GitHub-Repo `klomanager` (privat, wie kiezmanager),
lokal z.B. unter `~/klomanager`. Tech-Stack identisch zu Kiez Manager:
React + Vite, Canvas-Pixel-Sprites, DOS-Panel-CSS, Press-Start-2P-Font.

## Was aus Kiez Manager 1:1 oder fast 1:1 übernehmbar ist
Im Ordner `retro/` und `game-pattern/`/`data-pattern/` dieses Pakets
liegen die Original-Dateien aus `feature/retro-klomanager` als Vorlage:

| Datei | Wiederverwendung |
|---|---|
| `retro/palette.js` | VGA-Farbpalette — direkt nutzbar |
| `retro/sprites.js` + `PixelSprite.jsx` | Sprite-Renderer-System — Gebäude/Figuren-Daten austauschen, Mechanik bleibt |
| `retro.css` | Komplettes DOS-Panel-/Pixel-Button-/CRT-Übergangs-Look — direkt nutzbar |
| `index.html.beispiel` | Font-Setup (Press Start 2P) |
| `game-pattern/spielzustand.js` | Reducer-Architektur (Spieler-Array, Tag-Phasen, Hot-Seat) — Struktur bleibt, Inhalte (Bars→Klos) austauschen |
| `game-pattern/konkurrent-ki-pattern.js` | KI-Rivale-Logik (kaufen/aufrüsten/sabotieren) — perfekte Vorlage für witzige Klomanager-Konkurrenten |
| `game-pattern/simulation.js` + `events.js` | Tagesabrechnung, Sauberkeit/Ruf-Verfall, Sabotage-Auflösung, Zufallsereignisse — Sauberkeit-Mechanik ist im Original bereits zentral! |
| `data-pattern/strategie.js` | Muster für Balancing-Konstanten (Preise, Kosten, Risiken) |

## Mapping: Kiez Manager → Klomanager
| Kiez Manager | Klomanager |
|---|---|
| Bar (Kneipe, Club, ...) | Öffentliche Toilette an einem Standort |
| Kiez (Kreuzberg, Mitte, ...) | Standort-Typ (Bahnhof, Kaserne, Stadion, Fußgängerzone, ...) |
| Upgrades (Lichterkette, Deko...) | Klobrille (Plastik→Marmor→Gold), Seidenpapier, Seifenspender, Händetrockner |
| Personal (Türsteher, Barkeeper) | Putzkraft, Klofrau/-mann, Wächter |
| Sauberkeit | Sauberkeit (1:1 — Kernmechanik des Originals!) |
| Ruf | Ruf/Beliebtheit bei den "Kunden" |
| Marketing-Aktion | Werbung / guter Ruf verbreiten |
| Sabotage-Aktion | Gerüchte streuen, Vandalismus gegen Konkurrenz-Klo |
| Ordnungsamt-Bernd | Gesundheitsamt-Kontrolleur |
| Kiez-König Murat (KI-Rivale) | Konkurrent mit albernem Namen (KI-Rivale) |
| Cocktailbar/Nachtclub-Extra | Kondomautomat "Cond-O-Mat", Getränkehalter an der Klobrille |

## Erste Schritte für den neuen Chat
1. Neues, leeres Verzeichnis `~/klomanager` anlegen (lokal, GitHub-Repo
   `klomanager` privat erstellen, wie bei kiezmanager).
2. Inhalte aus diesem `klomanager-starter-kit`-Ordner dorthin kopieren
   (als Ausgangspunkt — werden im neuen Chat umgebaut).
3. Neuen Cowork-Chat starten, diesen Ordner auswählen, und den
   **Start-Prompt** unten als erste Nachricht senden.

---

## 📋 Start-Prompt für den neuen Cowork-Chat (zum Kopieren)

```
Wir bauen "Klomanager" — den originalen Toiletten-Tycoon von 1995
(Atari ST, von Matthias Hofmann/Ronald Wendt) als modernes Web-Spiel
nach. Gleicher Edle-Retro-Pixel-Stil wie mein anderes Projekt Kiez
Manager (React + Vite, Canvas-Pixel-Sprites, DOS-Panel-Look,
"Press Start 2P"-Font, rundenbasiert Tag für Tag).

Im Ordner liegen schon Starter-Dateien aus Kiez Manager
(retro/palette.js, retro/sprites.js, retro.css, Reducer-/KI-/
Simulations-Muster) — lies KLOMANAGER_BRIEF.md zuerst, da steht das
Mapping Kiez Manager → Klomanager und die Original-Spielfeatures drin.

Konzept:
- Spieler ist WC-Manager, verwaltet mehrere öffentliche Toiletten
  an verschiedenen Stadt-Standorten (Bahnhof, Kaserne, Stadion,
  Fußgängerzone, ...)
- Kernmechanik: SAUBERKEIT (verfällt täglich, muss gereinigt werden,
  beeinflusst Einnahmen & Gesundheitsamt-Kontrollen)
- Ausstattung/Upgrades: Klobrille (Plastik/Marmor/Gold), Seidenpapier,
  Seifenspender, Händetrockner, Kondomautomat "Cond-O-Mat"
- Hot-Seat-Mehrspieler (1-4) + KI-Konkurrent(en) mit albernen Namen,
  die sabotieren (Gerüchte, Vandalismus)
- Rundenloop wie Kiez Manager: Tag-Intro → Planung → Tagesbericht
- Humor wie das Original: trocken-deutscher Toiletten-Humor

Bitte:
1. Erst Projektstruktur/Starter-Dateien anschauen
2. Plan vorschlagen, wie wir das Kiez-Manager-Grundgerüst zu Klomanager
   umbauen (welche Dateien wir 1:1 übernehmen, welche neu sind)
3. Schritt für Schritt umsetzen, alles auf Deutsch kommentiert,
   kleine Schritte, Conventional Commits, eigener Branch
   (z.B. setup/project-structure), nie direkt auf main pushen
4. Mir jeden größeren Schritt einfach erklären (ich will verstehen,
   was passiert, nicht jede Code-Zeile lernen)
```
