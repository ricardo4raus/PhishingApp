# 02 – Erste Komponenten

Autor: Ricardo Kraus · Stand: 09.11.2026

> Diese Datei zeigt den Stand nach dem ersten Arbeitsschritt. Datenmodell und SMS-Darstellung wurden in
> [Schritt 03](03_situationen-und-kanaele.md) erweitert. Den aktuellen Stand beschreibt [app-aufbau.md](app-aufbau.md).

## Was jetzt funktioniert

- **Startbildschirm** mit Titel, Einleitung, Infos (Anzahl Situationen, Dauer) und Button «Training starten»
- **Situationsbildschirm** mit Kopfzeile (Beenden, «Situation x von y», Fortschrittsbalken, Punkte),
  der Nachricht und den Buttons «Echt» und «Phishing»
- **SMS-Komponente**, die eine Nachricht wie auf dem Handy darstellt
- Die Antwort wird ausgewertet und die Punkte werden gezählt
- Hell- und Dunkelmodus nach Systemeinstellung, Handy- und Desktop-Layout
- Fehlermeldung, falls die Situationen nicht geladen werden können

**Noch nicht:** Auswertung mit Erklärung, Resultat, E-Mail- und Chat-Komponente.
Bis die Auswertung gebaut ist, springt die App nach einer Antwort direkt zur nächsten Situation
und nach der letzten Situation zurück zum Start.

## Aufbau der Dateien

```
index.html                  Grundgerüst der Seite und alle Vorlagen (<template>)
css/style.css               Farben, Hell/Dunkel, Layout, Aussehen der Komponenten
data/situationen.json       Die Situationen (zurzeit 2 SMS)
js/app.js                   Zustand der App und Ablauf: welcher Bildschirm wann gezeigt wird
js/daten.js                 Lädt die Situationen aus der JSON-Datei
js/vorlagen.js              Erstellt eine Kopie einer Vorlage aus index.html
js/bildschirme/start.js     Startbildschirm
js/bildschirme/situation.js Situationsbildschirm
js/komponenten/sms.js       Darstellung einer SMS
```

Jede Datei hat eine Aufgabe. Die Bildschirm-Dateien wissen nichts vom Ablauf,
sie bekommen Daten und Funktionen übergeben (z. B. `beimStarten`, `beiAntwort`) und geben ein fertiges Element zurück.
Den Ablauf steuert nur `app.js`.

## Wie eine Komponente funktioniert

1. Das Aussehen (HTML) steht als `<template>` in `index.html`, z. B. `<template id="vorlage-sms">`.
   Ein Template wird vom Browser nicht angezeigt, es ist nur eine Vorlage.
2. Die JavaScript-Datei macht eine Kopie der Vorlage (`erstelleAusVorlage("vorlage-sms")`).
3. Sie füllt die Daten mit `textContent` ein, z. B. den Absender.
4. Sie hängt Klick-Funktionen an die Buttons (`addEventListener("click", …)`).
5. Sie gibt die fertige Kopie zurück, und `app.js` zeigt sie an.

So bleiben HTML (Aufbau), CSS (Aussehen) und JavaScript (Verhalten) getrennt.

## Ablauf in `app.js`

```
Seite lädt → Situationen laden → zeigeStart()
«Training starten» → starteTraining() → zeigeSituation()
«Echt»/«Phishing» → werteAntwortAus() → zeigeNaechsteSituation()
                     → noch Situationen übrig? Ja: zeigeSituation() / Nein: zeigeStart()
«Beenden» → Rückfrage → zeigeStart()
```

Der Zustand steht in einem einzigen Objekt:
`{ situationen, index, punkte, antworten }`.
Jeder Klick ändert den Zustand und zeigt dann den passenden Bildschirm.

## Aufbau einer Situation (JSON)

| Feld | Bedeutung |
|---|---|
| `id` | Nummer aus der Inhaltstabelle |
| `kanal` | «SMS», später «E-Mail», «WhatsApp», «Instagram» |
| `absender`, `zeit`, `text` | Was in der Nachricht steht |
| `link` | Angezeigter Link oder `null`, wenn die Nachricht keinen Link hat |
| `istPhishing` | `true` oder `false`, daraus wird die richtige Antwort bestimmt |
| `merkmale` | Liste mit `titel` und `text`, woran man es erkennt (für die Auswertung) |
| `reaktion` | Liste, wie man richtig reagiert (für die Auswertung) |

## Entscheide und Begründungen

| Entscheid | Begründung | Quelle |
|---|---|---|
| Vorlagen mit `<template>` statt HTML in JavaScript-Strings | Aufbau bleibt als normales HTML lesbar. Empfohlenes Vorgehen laut MDN. | MDN `<template>` |
| Texte mit `textContent` statt `innerHTML` einfüllen | `innerHTML` kann für XSS-Angriffe anfällig sein und ist langsamer. | MDN `textContent` |
| Kopie mit `document.importNode(vorlage.content, true)` | So im MDN-Beispiel empfohlen. Klick-Funktionen an die Elemente selbst hängen, nicht an das Fragment. | MDN `<template>` |
| JavaScript in Module aufgeteilt (`import`/`export`) | Jede Datei hat eine Aufgabe, Abhängigkeiten sind oben sichtbar. | MDN JavaScript Modules |
| `fetch` mit Prüfung von `response.ok` und `try/catch` | `fetch` meldet z. B. einen 404-Fehler nicht von selbst, darum wird der Status geprüft. | MDN Using Fetch |
| Farben als CSS-Variablen auf `:root` | Eine Stelle für alle Farben, Dunkelmodus ändert nur die Variablen. | MDN Custom Properties |
| Dunkelmodus mit `prefers-color-scheme` und `<meta name="color-scheme">` | Folgt der Einstellung im Betriebssystem, auch Scrollbalken und Formularelemente passen sich an. | MDN prefers-color-scheme, MDN color-scheme |
| Buttons mind. 48 px hoch | Empfehlung für Touch-Ziele auf dem Handy (statt 44 px aus dem ersten Konzept). | web.dev Accessible tap targets |
| Fortschritt mit `<progress>` | Fertiges HTML-Element, Screenreader lesen den Fortschritt vor. | – |
| Icons als SVG direkt im HTML (Lucide, ISC-Lizenz) | Keine Bibliothek nötig, Farbe passt sich mit `currentColor` an Hell/Dunkel an. | lucide.dev |
| Mobile first, Desktop-Layout ab 900 px | Zielgruppe nutzt vor allem das Handy. Auf dem Desktop zwei Spalten wie in den Desktop-Wireframes. | – |
| Link in der Nachricht ist nicht anklickbar | Die App soll nie auf eine (erfundene) Phishing-Adresse führen. Endgültiges Verhalten noch offen. | – |

Zusätzliche Farbe: `--farbe-blase` (Hintergrund der Sprechblase), hell `#FFFFFF`, dunkel `#222B42`,
weil im Dunkelmodus die Blase heller als die Karte ist (wie im Wireframe).

## Tests

Getestet mit Chrome (Headless) über einen lokalen Webserver:

| Test | Erwartet | Ergebnis |
|---|---|---|
| Start → «Phishing» bei Situation 1 (richtig) | Situation 2, 1 Punkt | erfüllt |
| Start → «Echt» bei Situation 1 (falsch) | Situation 2, 0 Punkte | erfüllt |
| Beide Situationen beantwortet | Zurück zum Start | erfüllt |
| JSON-Datei fehlt | Fehlermeldung statt leerer Seite | erfüllt |
| Handy (390 px) und Desktop (1440 px), hell und dunkel | Layout wie Wireframes | erfüllt |

Gefundener Fehler: Bei «0 Punkte» war der Abstand doppelt (Leerzeichen und Flexbox-Abstand). Behoben.

Hinweis: Die App muss über einen Webserver geöffnet werden (VS Code «Live Server» oder GitHub Pages).
Per Doppelklick auf `index.html` funktioniert das Laden der JSON-Datei nicht.

## Offene Punkte

- Situation 7 (Bestätigungscode) braucht einen Kontext («Du meldest dich gerade an»), sonst ist sie nicht lösbar.
  Wie das angezeigt wird, ist noch offen.
- Google Fonts überträgt die IP-Adresse an Google. Alternative: Schrift selbst hosten.
