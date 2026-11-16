# 08 – Auswertung nach jeder Antwort

Autor: Ricardo Kraus · Stand: 16.11.2026

## Ziel dieses Schritts

Die letzte fehlende Muss-Funktion umsetzen: Nach jeder Antwort sieht man sofort, ob sie richtig war,
woran man die Nachricht erkennt und wie man richtig reagiert (Erfolgskriterium 2: «Die Entscheidungen werden korrekt
ausgewertet und verständlich erklärt»). Vorher sprang die App direkt zur nächsten Situation, die Erklärung gab es nur
bei Fehlern im Resultat.

## Was umgesetzt wurde

| Teil | Inhalt |
|---|---|
| Ergebnis-Banner | «Richtig erkannt!» (grün, ✓) oder «Leider falsch» (orange, ✗), darunter «Diese Nachricht ist Phishing.» bzw. «Diese Nachricht ist echt.» |
| Erklärung | «Woran du es erkennst» bzw. «Darum ist die Nachricht echt» mit den nummerierten Merkmalen, danach «So reagierst du richtig» |
| Knopf | «Weiter» zur nächsten Situation, bei der letzten Situation «Zum Resultat» |
| Punkte | Werden in der Kopfzeile sofort nach der Antwort nachgeführt |

Die Auswertung erscheint nach **jeder** Antwort, auch bei richtigen (wie im Wireframe «Erklärung richtig»).
So wiederholt man die Merkmale auch dann, wenn man richtig geraten hat.

**Layout:**
- Handy: Banner, Erklärung, Knopf «Weiter» unten (wie Wireframe). Die Nachricht ist in diesem Schritt ausgeblendet.
- Desktop: links Banner und Nachricht (inklusive Link-Prüfung), rechts Erklärung und «Weiter» rechtsbündig (wie Wireframe).

## Aufbau im Code

Die Auswertung ist **kein eigener Bildschirm**, sondern ein zweiter Schritt im Situationsbildschirm.

```
«Echt» / «Phishing» → werteAntwortAus() → zeigeAuswertung() → aktualisiereAuswertung()
«Weiter»            → zeigeNaechsteSituation() → zeigeSituation() → aktualisiereSituation()
```

| Datei | Änderung |
|---|---|
| `index.html` | Vorlage `vorlage-situation`: Ergebnis-Banner (`.ergebnis`, zuerst `hidden`), Bereich `.situation__nachricht-bereich` um Kanal, Kontext und Nachricht, neue Spalte `.situation__auswertung` mit Platz für die Erklärung und Knopf «Weiter» |
| `js/bildschirme/situation.js` | Neu `aktualisiereAuswertung()`, `zeigeSchritt()` (wechselt zwischen «Entscheidung» und «Auswertung») und `zeigeErgebnis()`. Callback `beiWeiter`. Doppelklick-Schutz als gemeinsame Funktion `nurBeimErstenKlick()` für alle drei Knöpfe |
| `js/app.js` | `werteAntwortAus()` ruft neu `zeigeAuswertung()` auf statt direkt die nächste Situation. «Weiter» ruft `zeigeNaechsteSituation()` auf |
| `css/style.css` | Komponente `.ergebnis` (Banner), Ausblenden der Nachricht auf dem Handy, grössere Überschrift der Erklärung, «Weiter» auf dem Desktop rechtsbündig, Einblenden mit Rücksicht auf «Bewegung reduzieren» |

Die Erklärung selbst kommt aus der bestehenden Komponente `erklaerung.js`, die bisher nur im Resultat verwendet wurde.
Es gibt also nur eine Stelle im Code, welche Merkmale und Reaktion darstellt.

## Entscheide und Begründungen

| Entscheid | Begründung | Quelle |
|---|---|---|
| Auswertung als Schritt im Situationsbildschirm statt eigener Bildschirm | Kopfzeile, Zähler und Fortschrittsbalken sind im Wireframe dieselben wie bei der Situation. Würde ein neuer Bildschirm aufgebaut, könnte der Fortschrittsbalken nicht mehr flüssig weiterlaufen (Problem aus [Schritt 04](04_fluessiger-ablauf.md)). Auf dem Desktop bleibt ausserdem die Nachricht links stehen. | – |
| Umschalten mit dem Attribut `hidden` | Gleiches Vorgehen wie bei Kontext und Link-Vorschau. | MDN hidden |
| Fokus auf den Titel des Banners (`h2`, `tabindex="-1"`) | Der Knopf, der gerade gedrückt wurde, verschwindet. Ohne neuen Fokus wüssten Screenreader nicht, dass ein Ergebnis da ist. So wird «Richtig erkannt!» bzw. «Leider falsch» sofort vorgelesen. | – |
| Doppelklick-Schutz auch für «Weiter» | Auf dem Handy liegt «Weiter» an derselben Stelle wie die Antwort-Knöpfe. Ein Doppelklick hätte sonst die Auswertung übersprungen (oder bei «Weiter» die nächste Situation beantwortet). | – |
| Nachricht auf dem Handy in der Auswertung ausgeblendet | So im Handy-Wireframe. Sonst wird der Bildschirm sehr lang und «Weiter» liegt weit unten. Im Resultat kann man jede Nachricht nochmals ansehen. | – |
| Richtig/falsch über Symbol, Text und Farbe | Nie nur über Farbe (Vorgabe im Design). | – |
| «Zum Resultat» statt «Weiter» bei der letzten Situation | Man weiss vor dem Klick, was als Nächstes kommt. | – |

## Entscheid: Zufälliges Verhältnis Phishing/echt

Bisher sind es immer 7 Phishing- und 3 echte Nachrichten. Wer immer «Phishing» wählt, hätte 70 % richtig
(offener Punkt aus [01](01_planung-und-technologie.md) und [03](03_situationen-und-kanaele.md)).

**Entscheid (16.11.2026):** Das Verhältnis soll künftig **zufällig** sein, damit man es nicht mehr erraten kann.
Noch nicht umgesetzt. Dafür braucht es mehr Situationen (vor allem mehr echte), aus denen pro Durchgang zufällig
ausgewählt wird. Die genaue Umsetzung wird festgelegt, wenn die Muss-Funktionen getestet sind.

## Tests

Automatisch getestet mit Chrome (Headless) über einen lokalen Webserver, Handy (390 px) und Desktop (1440 px).
Durchgang mit allen 10 Situationen, jede dritte Antwort absichtlich falsch (7 richtig, 3 falsch). 155 Prüfungen pro Breite.

| Test | Ergebnis |
|---|---|
| Nach jeder Antwort erscheint die Auswertung, Frage und Antwort-Knöpfe sind ausgeblendet | erfüllt |
| Banner «Richtig erkannt!» / «Leider falsch» passend zur Antwort, Text «Phishing» / «echt» passend zur Situation | erfüllt (alle 10) |
| Anzahl Merkmale und Reaktionen wie in den Daten, Titel «Woran du es erkennst» / «Darum ist die Nachricht echt» | erfüllt (alle 10) |
| Punkte in der Kopfzeile sofort nachgeführt, Zähler bleibt bei der aktuellen Situation | erfüllt |
| Fokus: Auswertung → Banner-Titel, nächste Situation → Nachricht, Resultat → Titel | erfüllt |
| Handy: Nachricht in der Auswertung ausgeblendet; Desktop: Nachricht sichtbar | erfüllt |
| Kopfzeile bleibt über alle Situationen und Auswertungen dasselbe Element | erfüllt |
| Letzte Situation: Knopf «Zum Resultat», danach Resultat 7/10 | erfüllt |
| Doppelklick auf «Echt» überspringt die Auswertung nicht | erfüllt |
| Doppelklick auf «Weiter» beantwortet die nächste Situation nicht | erfüllt |
| Keine JavaScript-Fehler in der Konsole | erfüllt |
| Handy und Desktop, hell und dunkel, mit den Wireframes «Erklärung» verglichen | geprüft |

## Offene Punkte

- Auf dem Desktop-Wireframe sind die Merkmale in der Nachricht mit Nummern markiert. Dafür müsste in den Daten
  stehen, welche Textstelle zu welchem Merkmal gehört. Noch nicht umgesetzt.
- Zufälliges Verhältnis Phishing/echt (siehe oben).
- Test auf echten Geräten (Android, iPhone) steht weiterhin aus.
