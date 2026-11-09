# 03 – Situationen und Kanäle

Autor: Ricardo Kraus · Stand: 09.11.2026

## Ziel dieses Schritts

- Alle 10 geplanten Situationen in die App bringen.
- Jede Nachricht so darstellen, wie sie im echten Leben aussieht: SMS wie in der Nachrichten-App,
  E-Mails wie in einem E-Mail-Programm, WhatsApp wie ein Chat, Instagram wie eine Direktnachricht.
- Links prüfbar machen: Beim Darüberfahren oder Antippen sieht man, wohin ein Link wirklich führt.
  Bei manchen Situationen weicht das echte Ziel vom angezeigten Text ab.

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| Situationen | Alle 10 Situationen aus dem Grobkonzept in `data/situationen.json`, gemischte Reihenfolge (echt und Phishing abwechselnd) |
| SMS | Überarbeitet: Kontakt oben in der Mitte, Zeitangabe, graue Sprechblase wie in der Nachrichten-App |
| E-Mail | Neu: Werkzeugleiste, Betreff, Absender mit Initiale, Name und Adresse, Empfänger, Zeit, Absätze, Link als Knopf oder Text, Gruss |
| WhatsApp | Neu: farbige Kopfzeile, Chat-Hintergrund, Sprechblasen mit Uhrzeit, Hinweis bei unbekannter Nummer |
| Instagram | Neu: Profilbild mit Farbverlauf-Ring, Name und Kontoname, runde Sprechblasen |
| Link-Prüfung | Neu: Vorschauzeile unter der Nachricht zeigt «Führt zu: …» mit dem echten Ziel |
| Kontext | Neu: Hinweisbox über der Nachricht, z. B. «Du hast gestern im Onlineshop bestellt». Damit sind echte Nachrichten wie der Login-Code lösbar (offener Punkt aus Schritt 02). |
| Kanal-Anzeige | Symbol passt sich an: Briefumschlag bei E-Mail, Sprechblase bei SMS und Chats |
| Punkte | Desktop zeigt «1 Punkt» statt «1 Punkte» |

## Entscheide und Begründungen

| Entscheid | Begründung | Quelle |
|---|---|---|
| Eine Komponente pro Kanal (`sms.js`, `email.js`, `whatsapp.js`, `instagram.js`) | Jede Datei beschreibt genau ein Aussehen und bleibt kurz und verständlich. | – |
| Auswahl der Komponente über eine Tabelle `NACHRICHT_PRO_KANAL` in `situation.js` | Ein neuer Kanal braucht nur eine neue Zeile, keine verschachtelten `if`-Abfragen. | – |
| Link als `<button>` statt `<a href>` | Die App soll nie auf eine Phishing-Adresse führen, auch nicht aus Versehen. Ein Knopf löst eine Aktion aus (Ziel anzeigen) und navigiert nicht. | – |
| Echtes Ziel in `data-ziel` | Text und Ziel sind getrennt gespeichert, so kann das Ziel vom Text abweichen wie bei echten Phishing-Mails. | – |
| Vorschauzeile unter der Nachricht statt schwebendem Tooltip | Funktioniert auf dem Handy zuverlässig, wird nie vom Bildschirmrand abgeschnitten und erinnert an die Statusleiste im E-Mail-Programm, wo man das Link-Ziel sieht. | – |
| Ereignisdelegation (ein Listener auf der Nachricht) | Ein Listener für alle Links statt einer pro Link. | MDN Event bubbling |
| `aria-live="polite"` auf der Vorschauzeile | Screenreader lesen das Link-Ziel vor, ohne den Benutzer zu unterbrechen. Die Zeile ist schon da, bevor sich ihr Text ändert. | MDN aria-live |
| Zusätzlich `click` als Auslöser | Safari auf dem iPhone fokussiert Knöpfe beim Antippen nicht, darum reicht `focusin` allein nicht. | – |
| E-Mail-Gruss als eigenes Feld `gruss` | So steht der Link natürlich zwischen Text und Gruss, ohne Platzhalter im Text. | – |
| Erfundene Firmen (Limmatbank, Pixelwerk, Berufsschule bs-zentrum) | Keine echten Firmen oder Logos (Abgrenzung im Grobkonzept). Alle Domains wurden geprüft und sind nicht registriert. | – |
| Neutrale Nachbildung der Apps | Farben und Aufbau erinnern an die echten Apps, damit man die Situation sofort erkennt. Es werden keine echten Logos verwendet. | – |

## Die 10 Situationen

| id | Kanal | Echt/Phishing | Merkmale | Besonderheit |
|---|---|---|---|---|
| 1 | SMS | Phishing | Unbekannter Absender, Zeitdruck, verdächtiger Link | Kleiner Betrag soll harmlos wirken |
| 2 | E-Mail | Phishing | Drohung und Zeitdruck, unpersönliche Anrede, Dateneingabe | Link als Knopf «Konto jetzt bestätigen» |
| 3 | WhatsApp | Phishing | Unbekannte Nummer, Bitte um Geld, Zeitdruck | Kontext: Mutter fragt dich um Rat |
| 4 | Instagram | Phishing | Falscher Absender (Häkchen nur im Namen), Drohung, Login-Link auf fremder Seite | Kontoname «help.center.support1» |
| 5 | E-Mail | Phishing | Zu gut, um wahr zu sein, Dateneingabe, Zeitdruck | Gewinn: Smartphone |
| 6 | E-Mail | Phishing | Gefälschte Absenderadresse, Link führt woanders hin, Zeitdruck | **Link-Text zeigt das Schulportal, Ziel ist eine fremde Seite** |
| 7 | SMS | Echt | Erwartet, kein Link, Warnung vor Weitergabe | Kontext: Du meldest dich gerade an |
| 8 | E-Mail | Echt | Erwartet, persönliche Anrede, Adressen passen zum Shop | Link-Ziel gehört zum Absender |
| 9 | SMS | Echt | Bekannter Absender, kein Zahlungsaufruf, kein Link | Kontext: Du wartest auf ein Paket |
| 10 | E-Mail | Phishing | Ungewöhnliche Bitte, Zeitdruck, Geheimhaltung und private Adresse | Absender heisst wie der Chef, Adresse ist privat |

## Tests

Getestet mit Chrome (Headless) über einen lokalen Webserver:

| Test | Ergebnis |
|---|---|
| Alle 10 Situationen durchgespielt, jede zeigt die richtige Komponente | erfüllt |
| Link-Vorschau erscheint genau bei den Situationen mit Link (1, 2, 4, 5, 6, 8) | erfüllt |
| Darüberfahren und Antippen zeigt das echte Ziel, Verlassen zeigt wieder den Hinweis | erfüllt |
| Kontext erscheint genau bei den Situationen mit Kontext | erfüllt |
| Nach der letzten Situation zurück zum Start | erfüllt |
| Keine JavaScript-Fehler in der Konsole | erfüllt |
| Handy (390 px) und Desktop (1440 px), hell und dunkel | Layout geprüft |
| Kontraste aller neuen Farben nach WCAG AA | erfüllt (mind. 4.7 : 1) |

Gefundene und behobene Fehler:
- «1 Punkte» → «1 Punkt» (Einzahl).
- Der Fokusrahmen um Links im Fliesstext überdeckte die Zeile darüber → kleinerer Abstand.

## Offene Punkte

- Auswertung (Erklärung der Merkmale und Reaktion) und Resultat sind noch nicht umgesetzt. Die Daten dafür sind vorhanden.
- Auf dem Desktop sollen in der Erklärung die Merkmale in der Nachricht nummeriert markiert werden (Desktop-Wireframe).
- Verhältnis Phishing/echt ist 7 : 3. Empfehlung bleibt 6 : 4 oder 5 : 5.
- Test auf echten Geräten (Android, iPhone) steht noch aus.
