# 05 – Resultat und Farbschema-Schalter

Autor: Ricardo Kraus · Stand: 09.11.2026

## Ziel dieses Schritts

- Resultat-Bildschirm nach den Wireframes (Handy und Desktop) umsetzen.
- Hell- und Dunkelmodus oben rechts von Hand umschalten können, auf jedem Bildschirm.

## Resultat-Bildschirm

Nach der letzten Situation erscheint das Resultat (vorher ging die App direkt zurück zum Start).

| Teil | Umsetzung |
|---|---|
| «Dein Resultat» und Kreis | Ring mit dem Anteil richtiger Antworten, in der Mitte z. B. «7/10 richtig». Der Ring füllt sich beim Erscheinen in 0.9 Sekunden. |
| Titel und Text | Abhängig vom Anteil richtiger Antworten (siehe Tabelle unten) |
| Statistik | «Phishing erkannt x von y» und «Echte erkannt x von y» |
| «Darauf solltest du achten» | Tipps aus den Fehlern, höchstens 4, die häufigsten zuerst. Bei 10 von 10 wird der Bereich ausgeblendet. |
| «Nochmals spielen» | Zurück zum Start (wie im Ablauf des Grobkonzepts) |

**Bewertung:**

| Anteil richtig | Titel | Text |
|---|---|---|
| 100 % | Perfekt! | Du hast alle Nachrichten richtig eingeschätzt. Damit bist du gut vor Phishing geschützt. |
| ab 80 % | Sehr gut! | Du erkennst fast alle Phishing-Versuche. Mit den Tipps unten klappt es beim nächsten Mal ganz. |
| ab 50 % | Gut gemacht! | Du erkennst die meisten Phishing-Versuche. Mit den Tipps unten wirst du noch sicherer. |
| unter 50 % | Übe noch etwas | Phishing ist oft schwer zu erkennen. Achte auf die Tipps unten und versuche es nochmals. |

**So entstehen die Tipps:**
- Jedes Merkmal einer Phishing-Situation hat in den Daten eine Art (`art`), z. B. `absender`, `link`, `zeitdruck`.
- Wird eine Phishing-Nachricht als echt eingestuft, zählt jedes ihrer Merkmale als Tipp, z. B. `link` → «Links prüfen».
- Wird eine echte Nachricht als Phishing eingestuft, zählt der Tipp «Echte nicht verdächtigen».
- Die Tipps werden nach Häufigkeit sortiert, angezeigt werden die vier häufigsten.

| Art | Tipp |
|---|---|
| `absender` | Absender prüfen |
| `link` | Links prüfen |
| `zeitdruck` | Bei Zeitdruck misstrauisch sein |
| `daten` | Keine Daten herausgeben |
| `geld` | Bei Geldforderungen nachfragen |
| `anrede` | Auf die Anrede achten |
| `angebot` | Zu gute Angebote hinterfragen |
| `bitte` | Ungewöhnliche Bitten prüfen |
| (echte Nachricht falsch eingestuft) | Echte nicht verdächtigen |

**Bewusst weggelassen:** Der Knopf «Tipps ansehen» aus dem Wireframe. Die Tipps-Seite ist eine Kann-Funktion und
noch nicht umgesetzt. Ein Knopf ohne Ziel würde die Zielgruppe verwirren.

## Farbschema-Schalter

- Oben rechts auf jedem Bildschirm (Start, Situation, Resultat) gibt es einen runden Knopf.
  Im hellen Modus zeigt er einen Mond, im dunklen eine Sonne.
- **Beim ersten Besuch** gilt die Einstellung des Geräts (`prefers-color-scheme`).
- **Nach einem Klick** gilt die eigene Wahl. Sie wird im Browser gespeichert (`localStorage`) und gilt auch nach dem
  Neuladen. Das ist eine Einstellung und keine persönliche Angabe.
- Ohne eigene Wahl folgt die App weiterhin der Geräteeinstellung, auch wenn diese sich ändert.

**Wie es technisch funktioniert:**
- `js/farbschema.js` wird im `<head>` als normales Script geladen, **vor** dem Stylesheet. Es setzt
  `data-farbschema="hell"` oder `"dunkel"` auf `<html>`, bevor die Seite gezeichnet wird. Dadurch blitzt beim Laden
  nie das falsche Farbschema auf.
- Die dunklen Farben stehen im CSS unter `:root[data-farbschema="dunkel"]`. Vorher hingen sie an der Media-Query
  `prefers-color-scheme`, diese Logik liegt jetzt in `farbschema.js`.
- Ein einziger Klick-Listener auf dem ganzen Dokument reagiert auf alle Schalter (Ereignisdelegation).
  So funktioniert der Schalter auch auf Bildschirmen, die erst später erstellt werden.

## Entscheide und Begründungen

| Entscheid | Begründung | Quelle |
|---|---|---|
| Zuerst Geräteeinstellung, danach eigene Wahl | Empfehlung: zuerst dem Signal des Browsers folgen und dann eine Übersteuerung anbieten. | web.dev prefers-color-scheme |
| `localStorage` in `try/catch` | `localStorage` kann einen Fehler auslösen, wenn das Speichern blockiert ist. Die App funktioniert dann trotzdem, die Wahl gilt nur bis zum Neuladen. | MDN localStorage |
| Script im `<head>` statt Modul | Module werden erst nach dem Aufbau der Seite ausgeführt. Das Farbschema muss vorher gesetzt sein, sonst blitzt kurz das falsche auf. | – |
| `color-scheme` je nach Farbschema | Formularelemente und Scrollbalken passen sich dem gewählten Modus an. | web.dev prefers-color-scheme |
| Ring mit `pathLength="100"` | Die Länge des Kreises zählt als 100. So entspricht der Anteil richtiger Antworten direkt der Länge des blauen Bogens, ohne Umrechnung mit Pi. | MDN pathLength |
| Animation des Rings in CSS (`@keyframes`) | Die Animation startet automatisch, wenn der Bildschirm erscheint. Bei «Bewegung reduzieren» ist sie aus. | MDN prefers-reduced-motion |
| Bei 0 richtig wird der Bogen entfernt | Ein Bogen der Länge 0 mit runden Enden würde als Punkt erscheinen. | – |
| Höchstens 4 Tipps | Bei vielen Fehlern wären es bis zu 9 Tipps. Das wäre zu viel, der Wireframe zeigt 3. | – |
| «Situation» auf sehr schmalen Handys weglassen | Unter 360 px Breite passte die Kopfzeile mit dem neuen Schalter nicht mehr auf eine Zeile. Es steht dann «1 von 10». | – |

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `js/farbschema.js` | Neu: Farbschema setzen, wechseln, speichern |
| `js/bildschirme/resultat.js` | Neu: Resultat-Bildschirm mit Bewertung, Ring, Statistik und Tipps |
| `js/app.js` | Nach der letzten Situation `zeigeResultat()`, «Nochmals spielen» → Start |
| `index.html` | Script `farbschema.js` im Kopf, Schalter in allen Kopfzeilen, Vorlage `vorlage-resultat`, Wort «Situation» in eigenem `span` |
| `css/style.css` | Dunkle Farben über `data-farbschema`, Schalter, Resultat-Bildschirm, Ring-Animation, kleinere Abstände in der Kopfzeile auf dem Handy |
| `data/situationen.json` | Feld `art` bei den Merkmalen aller Phishing-Situationen |

## Tests

Automatisch getestet mit Chrome (Headless):

| Test | Ergebnis |
|---|---|
| Alle 10 richtig: 10/10, «Perfekt!», 7 von 7 und 3 von 3, Ring voll, keine Tipps | erfüllt |
| Keine richtig: 0/10, «Übe noch etwas», Ring leer (ohne Punkt), 4 Tipps | erfüllt |
| Gemischt (6 richtig): 6/10, «Gut gemacht!», 5 von 7 und 1 von 3, Ring 60 %, 4 Tipps nach Häufigkeit | erfüllt |
| «Nochmals spielen» führt zum Start | erfüllt |
| Ring-Animation: Anfang leer, Mitte etwa halb, Ende 70 % bei 7/10 | erfüllt |
| Gerät hell, Klick auf Schalter → dunkel, nach dem Neuladen immer noch dunkel | erfüllt |
| Gerät dunkel, keine eigene Wahl → dunkel | erfüllt |
| Resultat auf Handy und Desktop, hell und dunkel, mit dem Wireframe verglichen | erfüllt |
| Kopfzeile der Situation bei 390 px und 320 px auf einer Zeile | erfüllt |
