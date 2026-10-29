# Tantra Sutra Explorer

Eine React-Anwendung zum Erkunden ausgewählter Verse aus dem *Vijnana Bhairava Tantra*. Zu jeder Sutra gibt es den Sanskrit-Text, Worterklärungen, Übersetzung und Kommentare, Alltagspraxis sowie eine geführte Atemmeditation.

## Funktionen

- **Original & Sanskrit:** Devanagari-Text, IAST-Umschrift und Wortschatz.
- **Übersetzung:** deutsche Übersetzung mit philosophischen Anmerkungen.
- **Alltags-Praxis:** praktische Impulse zur jeweiligen Sutra.
- **Meditation:** geführter Atemzyklus mit animiertem Kreis und dynamischem Zeitring.
- **Zufallspraxis:** wählt eine Alltagspraxis aus allen Sutras aus. Der Link im Dialog öffnet ihre Ursprungsutra.
- **Sutra-Auswahl:** Verse direkt über das Auswahlfeld im Header wechseln.
- **JSON-Editor:** Sutra-Daten während der laufenden Sitzung bearbeiten.
- **Responsive Bedienung:** Abschnittsnavigation und Inhalte passen sich auch kleinen Bildschirmen an.

Die Rezitations-Schaltfläche simuliert derzeit die Wiedergabe; sie spielt keine Audiodatei ab.


## Static online version

Die online App ist hier erreichbar:

[tantra_sutra_explorer](https://tnxec2.github.io/tantra_sutra_explorer/)

## Voraussetzungen

- Node.js
- npm

## Installation und Start

```bash
npm install
npm start
```

Die Entwicklungsanwendung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar. Änderungen am Quellcode werden automatisch neu geladen.

## Als PWA installieren und offline nutzen

Die Produktionsversion enthält ein Web-App-Manifest und einen Service Worker. Nach dem ersten erfolgreichen Laden werden die App-Shell und Build-Dateien zwischengespeichert, sodass die App bei späteren Besuchen auch offline geöffnet werden kann.

1. Produktionsversion mit `npm run build` erstellen und über HTTPS veröffentlichen (GitHub Pages stellt HTTPS bereit).
2. Die veröffentlichte App in einem unterstützten Browser öffnen.
3. Im Browser **Installieren** bzw. **Zum Startbildschirm hinzufügen** auswählen. Der Eintrag ist je nach Browser und Betriebssystem unterschiedlich benannt.

Der Service Worker wird nur in Produktions-Builds registriert, nicht beim lokalen Entwicklungsserver. Nach Änderungen kann es nötig sein, die App einmal online neu zu laden, damit der Offline-Cache aktualisiert wird.

## Verfügbare Befehle

| Befehl | Beschreibung |
| --- | --- |
| `npm start` | Startet den Entwicklungsserver. |
| `npm test` | Startet den Test-Runner im Watch-Modus. |
| `npm run build` | Erstellt den optimierten Produktions-Build im Verzeichnis `build/`. |

## Sutra-Daten

Die TypeScript-Datensätze liegen in `src/data/`. `src/data/InitialData.ts` importiert die einzelnen Verse und führt sie in `INITIAL_SUTRAS_DATA` zusammen. Um eine Sutra dauerhaft hinzuzufügen oder zu ändern:

1. Einen Datensatz entsprechend dem Modell in `src/model/Sutra.ts` erstellen oder bearbeiten.
2. Den Datensatz in `src/data/InitialData.ts` importieren und in `INITIAL_SUTRAS_DATA` aufnehmen.
3. Die Anwendung starten und die Sutra im Header auswählen.

Der JSON-Editor nimmt ein Array von Sutra-Datensätzen entgegen und gilt für die aktuelle Sitzung. Für dauerhafte Änderungen die Datensätze in `src/data/` aktualisieren.

Jeder Sutra-Datensatz enthält:

- Metadaten: `id`, `chapter`, `verseNum`, `title` und `subtitle`
- Sanskrit: `sanskrit` und `iast` (optional: `audioUrl`)
- Wortschatz: `vocabulary` mit `term`, `translation` und `meaning`
- Übersetzung: `translationGerman`
- Kommentare: `philosophicalNotes` mit `title` und `text`
- Alltagspraxis: `dailyPractices` mit `icon`, `title`, `situation`, `practice` und `quote`
- Meditation: `meditationConfig` mit `type`, `title`, `instruction` sowie vier Atemphasen. Jede Phase hat `name`, `duration` (Sekunden) und `instruction`.

Die TypeScript-Modelle unter `src/model/` definieren die vollständigen Datentypen.

## Technologie

React, TypeScript, Tailwind CSS und [Lucide](https://lucide.dev/) für Symbole.
