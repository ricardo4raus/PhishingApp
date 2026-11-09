# 06 – Antworten im Resultat ansehen

Autor: Ricardo Kraus · Stand: 09.11.2026

## Ziel dieses Schritts

Am Ende soll man alle bearbeiteten Situationen nochmals ansehen können. Für jede Situation steht, ob die Antwort
richtig oder falsch war. Bei Fehlern wird erklärt, woran man die Nachricht erkennt und wie man richtig reagiert,
damit man sie beim nächsten Mal erkennt.

## Was umgesetzt wurde

Unter dem Resultat gibt es den Bereich **«Deine Antworten»** mit einem Eintrag pro Situation, in der gespielten Reihenfolge.

| Teil | Inhalt |
|---|---|
| Zusammenfassung (immer sichtbar) | Symbol ✓ oder ✗, Nummer, Kanal und Betreff bzw. Absender, z. B. «3. WhatsApp: +44 7700 900318», darunter das Ergebnis als Text, z. B. «Falsch: Du hast «Echt» gewählt, es war Phishing.» |
| Aufgeklappt | Kontext (falls vorhanden) und die Nachricht genau so, wie sie in der Situation aussah, inklusive Link-Prüfung |
| Aufgeklappt, nur bei Fehlern | «Woran du es erkennst» (bei echten Nachrichten «Darum ist die Nachricht echt») mit den nummerierten Merkmalen und «So reagierst du richtig» |

Richtig und falsch sind nie nur über die Farbe erkennbar: Es gibt immer Symbol (✓ / ✗), Text («Richtig: …» / «Falsch: …»)
und Farbe (grüner bzw. oranger Rand).

**Ergebnis-Texte:**

| Situation | Antwort | Text |
|---|---|---|
| Phishing | richtig | Richtig: Du hast Phishing erkannt. |
| echt | richtig | Richtig: Du hast erkannt, dass die Nachricht echt ist. |
| Phishing | falsch | Falsch: Du hast «Echt» gewählt, es war Phishing. |
| echt | falsch | Falsch: Du hast «Phishing» gewählt, die Nachricht war echt. |

**Layout:** Auf dem Handy steht alles untereinander. Auf dem Desktop stehen im aufgeklappten Eintrag links die Nachricht
und rechts die Erklärung, ähnlich wie im Desktop-Wireframe «Erklärung».

## Aufbau im Code

| Datei | Aufgabe |
|---|---|
| `js/komponenten/antwort-eintrag.js` | Neu: ein Eintrag in der Liste (Zusammenfassung, Nachricht, Erklärung bei Fehlern) |
| `js/komponenten/erklaerung.js` | Neu: Merkmale und richtige Reaktion. Kann später auch für den Erklärungsbildschirm nach jeder Antwort verwendet werden |
| `js/komponenten/nachricht.js` | Neu: wählt die passende Darstellung nach Kanal. Vorher stand diese Tabelle in `situation.js`, jetzt brauchen sie zwei Bildschirme |
| `js/komponenten/kontext.js` | Neu: zeigt oder versteckt die Kontext-Box. Wird von Situation und Resultat verwendet |
| `js/komponenten/link.js` | Neu `erstelleLinkVorschau()`: Die Link-Vorschau hat wieder eine eigene Vorlage, weil sie jetzt an mehreren Stellen gebraucht wird |
| `js/bildschirme/resultat.js` | `zeigeAntworten()` füllt die Liste |
| `js/bildschirme/situation.js` | Verwendet die neuen gemeinsamen Module statt eigener Kopien |
| `index.html` | Bereich «Deine Antworten», Vorlagen `vorlage-antwort-eintrag`, `vorlage-erklaerung`, `vorlage-merkmal`, `vorlage-linkvorschau`, Kontext-Box mit gemeinsamer Klasse `kontext` |
| `css/style.css` | Stile für Liste, Eintrag, Erklärung, Merkmale und Reaktion, Kontext als gemeinsame Komponente, `h3` und `ol` ohne Standardabstand |

## Entscheide und Begründungen

| Entscheid | Begründung | Quelle |
|---|---|---|
| Aufklappen mit `<details>` und `<summary>` | Fertiges HTML-Element: lässt sich mit Maus, Tippen und Tastatur (Leertaste) öffnen und wird von Screenreadern richtig vorgelesen, ganz ohne JavaScript. | MDN details |
| Standard-Dreieck ausgeblendet (`list-style: none`, `::-webkit-details-marker`), eigener Pfeil | Einheitliches Aussehen in allen Browsern. Der Pfeil dreht sich beim Öffnen. | MDN details |
| Alle Einträge zuerst zugeklappt | Zehn offene Einträge wären sehr lang. Die Zusammenfassung zeigt das Wichtigste auf einen Blick. | – |
| Erklärung nur bei Fehlern | So wie gewünscht: Bei Fehlern steht, warum und wie man es beim nächsten Mal erkennt. Richtige Antworten bleiben kurz. | – |
| Gemeinsame Module statt Kopien | Die Darstellung der Nachricht, der Kontext und die Link-Vorschau werden jetzt an zwei Orten gebraucht. Eine einzige Stelle im Code verhindert, dass die beiden Stellen auseinanderlaufen. | – |
| Liste als `<ol>` | Die Reihenfolge der Situationen ist bedeutsam (1 bis 10). | – |

## Tests

Automatisch getestet mit Chrome (Headless), 3 von 10 Antworten absichtlich falsch:

| Test | Ergebnis |
|---|---|
| 10 Einträge in der gespielten Reihenfolge | erfüllt |
| Status richtig/falsch stimmt bei jedem Eintrag | erfüllt |
| Erklärung genau bei den 3 falschen Einträgen, mit allen Merkmalen | erfüllt |
| Jeder Eintrag enthält die Nachricht, Kontext nur wo vorhanden | erfüllt |
| Link-Prüfung im Eintrag zeigt das echte Ziel | erfüllt |
| Situationsbildschirm funktioniert nach der Umstellung auf gemeinsame Module weiterhin | erfüllt |
| Desktop hell und Handy dunkel mit aufgeklappten Einträgen | geprüft |

Gefundener und behobener Fehler: Überschriften und Listen in der Erklärung hatten zu viel Abstand, weil `h3` und `ol`
noch die Standardabstände des Browsers hatten.
