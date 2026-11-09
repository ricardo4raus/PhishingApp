# Aufbau der App (aktueller Stand)

Autor: Ricardo Kraus · Stand: 09.11.2026

Diese Datei beschreibt immer den **aktuellen** Stand der App. Sie wird bei jeder Änderung nachgeführt.
Was wann geändert wurde, steht im [Änderungsprotokoll](aenderungsprotokoll.md).

## Was die App kann

| Funktion | Stand |
|---|---|
| Startseite mit Einführung, Anzahl Situationen und geschätzter Dauer | umgesetzt |
| 10 Situationen nacheinander, dargestellt wie echte SMS, E-Mails, WhatsApp- und Instagram-Nachrichten | umgesetzt |
| Entscheidung «Echt» oder «Phishing», Punkte werden gezählt | umgesetzt |
| Links zeigen beim Darüberfahren oder Antippen, wohin sie wirklich führen | umgesetzt |
| Kontext-Hinweis, wenn eine Situation Vorwissen braucht (z. B. «Du hast gestern bestellt») | umgesetzt |
| «Beenden» mit Rückfrage, zurück zum Start | umgesetzt |
| Hell- und Dunkelmodus: zuerst nach Geräteeinstellung, mit Schalter oben rechts umschaltbar, Wahl wird gespeichert | umgesetzt |
| Handy- und Desktop-Layout | umgesetzt |
| Fehlermeldung, wenn die Situationen nicht geladen werden können | umgesetzt |
| Auswertung mit Erklärung der Merkmale und der richtigen Reaktion | **noch offen** (Daten sind schon vorhanden) |
| Resultat am Ende: Ring mit Punktzahl, Bewertung, Phishing erkannt x von y, Echte erkannt x von y, Tipps aus den Fehlern, «Nochmals spielen» | umgesetzt |
| «Deine Antworten»: alle Situationen nochmals ansehen, richtig/falsch, bei Fehlern Merkmale und richtige Reaktion | umgesetzt |
| Tipps-Seite «Woran erkenne ich Phishing?» (Kann-Funktion) | **noch offen**, darum kein Knopf «Tipps ansehen» |

Solange die Auswertung fehlt, springt die App nach einer Antwort direkt zur nächsten Situation.
Nach der letzten Situation erscheint das Resultat.

## Ablauf im Code

```
Seite lädt → ladeSituationen() → zeigeStart()
«Training starten» → starteTraining() → erstelleSituationBildschirm() (einmal) → zeigeSituation()
«Echt» / «Phishing» → werteAntwortAus() → zeigeNaechsteSituation()
                       → weitere Situation? Ja: zeigeSituation() / Nein: zeigeResultat()
«Nochmals spielen» → zeigeStart()
«Beenden» → Rückfrage → zeigeStart()
Schalter oben rechts → wechsleFarbschema() (in farbschema.js, unabhängig vom Ablauf)
```

Der Zustand steht in einem einzigen Objekt in `js/app.js`: `{ situationen, index, punkte, antworten }`.
Nur `app.js` entscheidet, welcher Bildschirm gezeigt wird. Den Situationsbildschirm merkt sich `app.js` in der
Variable `situationsBildschirm`, damit er für jede Situation aktualisiert werden kann.

**Situationsbildschirm wird nicht neu aufgebaut:** `erstelleSituationBildschirm()` baut Kopfzeile, Spalten und Knöpfe
einmal beim Start des Trainings. `zeigeSituation()` ruft danach nur `aktualisiereSituation()` auf, das Zähler,
Fortschritt, Punkte, Kanal, Kontext, Nachricht und Link-Vorschau ersetzt. Dadurch läuft der Fortschrittsbalken
animiert weiter (`transition: width 400ms`), und die neue Nachricht wird kurz eingeblendet.
Bei «Bewegung reduzieren» (`prefers-reduced-motion`) sind alle Animationen aus.

## Dateien

| Datei | Aufgabe |
|---|---|
| `index.html` | Grundgerüst und alle Vorlagen (`<template id="vorlage-…">`) für Bildschirme und Nachrichten |
| `css/style.css` | Farben (hell/dunkel), Grundlagen, Seitenaufbau, Komponenten, Bildschirme, Desktop-Layout |
| `data/situationen.json` | Alle Situationen mit Nachricht, Merkmalen und richtiger Reaktion |
| `js/farbschema.js` | Setzt das Farbschema (hell/dunkel) vor dem Zeichnen der Seite, Schalter, Speichern der Wahl. Normales Script im `<head>`, kein Modul |
| `js/app.js` | Zustand und Ablauf |
| `js/daten.js` | Lädt die Situationen mit `fetch` (einzige Stelle, an der Daten geladen werden) |
| `js/vorlagen.js` | Erstellt eine Kopie einer Vorlage aus `index.html` und gibt ihr Wurzelelement zurück |
| `js/bildschirme/start.js` | Startbildschirm |
| `js/bildschirme/situation.js` | Situationsbildschirm: `erstelleSituationBildschirm()` (einmal) und `aktualisiereSituation()` (pro Situation), wählt die passende Nachrichten-Komponente nach Kanal |
| `js/bildschirme/resultat.js` | Resultat-Bildschirm: Bewertung, Ring, Statistik, Tipps, Liste «Deine Antworten» |
| `js/komponenten/nachricht.js` | Wählt die Darstellung nach Kanal (`NACHRICHT_PRO_KANAL`), verwendet von Situation und Resultat |
| `js/komponenten/kontext.js` | Zeigt oder versteckt die Kontext-Box |
| `js/komponenten/erklaerung.js` | Merkmale («Woran du es erkennst») und richtige Reaktion |
| `js/komponenten/antwort-eintrag.js` | Ein aufklappbarer Eintrag in «Deine Antworten» |
| `js/komponenten/sms.js` | Darstellung einer SMS |
| `js/komponenten/email.js` | Darstellung einer E-Mail |
| `js/komponenten/whatsapp.js` | Darstellung eines WhatsApp-Chats |
| `js/komponenten/instagram.js` | Darstellung einer Instagram-Direktnachricht |
| `js/komponenten/link.js` | Link in einer Nachricht, Vorschauzeile mit dem echten Link-Ziel (eigene Vorlage `vorlage-linkvorschau`) |

## Wie eine Komponente aufgebaut ist

1. Das HTML steht als `<template>` in `index.html`.
2. Die JavaScript-Datei kopiert die Vorlage mit `erstelleAusVorlage(…)` und bekommt ihr Wurzelelement zurück.
   Jede Vorlage hat genau ein Wurzelelement, bei Bildschirmen `<div class="bildschirm">`.
3. Texte werden nur mit `textContent` oder `append(text)` eingefügt, nie mit `innerHTML` (Schutz vor XSS).
4. Wiederholte Teile (Sprechblasen, Absätze) werden mit `document.createElement` erzeugt.
5. Die Funktion gibt das fertige Element zurück. Bildschirme bekommen Funktionen wie `beiAntwort` übergeben
   und kennen den Ablauf selbst nicht.

## Datenmodell einer Situation (`data/situationen.json`)

| Feld | Pflicht | Kanal | Bedeutung |
|---|---|---|---|
| `id` | ja | alle | Nummer aus der Inhaltstabelle des Grobkonzepts |
| `kanal` | ja | alle | `"SMS"`, `"E-Mail"`, `"WhatsApp"` oder `"Instagram"`, bestimmt die Darstellung |
| `kontext` | nein (`null`) | alle | Hinweis zur Situation, z. B. «Du hast gestern bestellt». Wird über der Nachricht angezeigt |
| `absender` | ja | alle | Angezeigter Name oder Nummer |
| `absenderAdresse` | ja bei E-Mail und Instagram | E-Mail, Instagram | E-Mail-Adresse bzw. Kontoname |
| `unbekannterKontakt` | nein | WhatsApp | `true` zeigt «Diese Nummer ist nicht in deinen Kontakten gespeichert» |
| `betreff` | ja bei E-Mail | E-Mail | Betreffzeile |
| `zeit` | ja | alle | Zeitangabe, z. B. «Heute, 09:14» |
| `text` | ja | alle | Liste von Texten: bei E-Mails Absätze, bei SMS und Chats Sprechblasen |
| `link` | nein (`null`) | alle | `{ "text", "ziel", "alsKnopf" }`, siehe unten |
| `gruss` | nein (`null`) | E-Mail | Grussformel am Schluss, Zeilenumbruch mit `\n` |
| `istPhishing` | ja | alle | `true` oder `false`, daraus wird die richtige Antwort bestimmt |
| `merkmale` | ja | alle | Liste mit `titel`, `text` und bei Phishing `art`: woran man es erkennt |
| `reaktion` | ja | alle | Liste: wie man richtig reagiert |

**Merkmal-Art (`art`, nur bei Phishing):** `absender`, `link`, `zeitdruck`, `daten`, `geld`, `anrede`, `angebot`, `bitte`.
Daraus entstehen die Tipps auf dem Resultat-Bildschirm (Tabelle in [05](05_resultat-und-farbschema.md)).

**Link-Objekt:**
- `text`: was in der Nachricht steht (kann eine Adresse oder ein Satz wie «Konto jetzt bestätigen» sein)
- `ziel`: wohin der Link wirklich führen würde. Bei Phishing kann es vom Text abweichen.
- `alsKnopf`: nur bei E-Mails. `true` = Link als Knopf, `false` = Link als Text.

Wo der Link erscheint: bei SMS, WhatsApp und Instagram am Ende der letzten Sprechblase,
bei E-Mails nach den Absätzen und vor dem Gruss.

## Darstellung der Kanäle

Alle Kanäle sind neutral nachgebildet: keine echten Logos, erfundene Namen, Nummern und Adressen.

| Kanal | Aussehen |
|---|---|
| SMS | Wie die Nachrichten-App eines Handys: Kontakt oben in der Mitte, Zeitangabe, graue Sprechblasen links |
| E-Mail | Wie ein E-Mail-Programm (z. B. Outlook, Gmail): Werkzeugleiste (Antworten, Löschen), Betreff, Absender mit Initiale, Name und Adresse, «An: mich», Zeit, Text mit Absätzen, Link als Knopf oder Text, Gruss |
| WhatsApp | Wie ein Chat: farbige Kopfzeile mit Nummer, Video- und Telefon-Symbol, beiger Chat-Hintergrund, weisse Sprechblasen mit Uhrzeit, optional Hinweis «nicht in deinen Kontakten» |
| Instagram | Wie eine Direktnachricht: Profilbild mit Farbverlauf-Ring, Name und Kontoname, runde graue Sprechblasen |

## Link-Prüfung

Ziel: Man soll üben, vor dem Klicken zu prüfen, wohin ein Link wirklich führt.

- Ein Link ist ein `<button class="link">` und kein echter `<a>`-Link. So kann die App nie auf eine Phishing-Adresse führen.
- Das echte Ziel steht in der Vorschauzeile (`.linkvorschau__ziel`, eindeutige `id`). Der Link verweist mit
  `aria-describedby` darauf, so lesen Screenreader das Ziel beim Link vor.
- Unter jeder Nachricht mit Link steht eine Vorschauzeile (`.linkvorschau`, Vorlage `vorlage-linkvorschau`).
  Sie ist fest im Situationsbildschirm und wird bei Situationen ohne Link mit `hidden` ausgeblendet.
- Sie enthält zwei Texte in derselben Rasterzelle: den Hinweis «Fahre über den Link oder tippe darauf …» und
  «Führt zu: …» mit dem echten Ziel. Sichtbar ist immer nur einer. Die Zeile ist so hoch wie der längere Text
  und ändert ihre Höhe beim Darüberfahren nicht, das Layout springt also nicht.
- Beim Darüberfahren (`mouseover`), Antippen (`click`) oder mit der Tastatur (`focusin`) wird das Ziel sichtbar.
  Beim Verlassen (`mouseout`, `focusout`) erscheint wieder der Hinweis.
- Die Ereignisse werden einmal auf der ganzen Nachricht abgefangen (Ereignisdelegation, `verbindeLinkVorschau()`),
  pro Situation setzt `bereiteLinkVorschauVor(nachricht, vorschau, link)` das neue Ziel und `aria-describedby`.
- `click` ist zusätzlich nötig, weil Safari auf dem iPhone Knöpfe beim Antippen nicht fokussiert.

## Situationen (Spielreihenfolge)

| # | id | Kanal | Echt/Phishing | Link: angezeigter Text → echtes Ziel | Kontext |
|---|---|---|---|---|---|
| 1 | 1 | SMS | Phishing | paket-zustellung-ch.info/z8841 → gleiche Adresse | – |
| 2 | 8 | E-Mail | Echt | «Bestellung ansehen» → www.pixelwerk-shop.ch/… (passt zum Absender) | ja |
| 3 | 3 | WhatsApp | Phishing | – | ja |
| 4 | 7 | SMS | Echt | – | ja |
| 5 | 2 | E-Mail | Phishing | «Konto jetzt bestätigen» → limmatbank-sicherheit.info/… | – |
| 6 | 4 | Instagram | Phishing | help-instagram-support.info/einspruch → …/einspruch/login | – |
| 7 | 9 | SMS | Echt | – | ja |
| 8 | 5 | E-Mail | Phishing | «Gewinn jetzt abholen» → gewinn-zentrale24.com/… | – |
| 9 | 6 | E-Mail | Phishing | **https://portal.bs-zentrum.ch/…** → **bs-passwort-service.com/login.php** (Text und Ziel unterschiedlich) | ja |
| 10 | 10 | E-Mail | Phishing | – | ja |

Verhältnis: 7 Phishing, 3 echt. Alle Domains sind erfunden und wurden am 09.11.2026 geprüft (nicht registriert / ohne DNS-Eintrag).
Telefonnummern: reservierte Fiktiv-Nummern (+44 7700 900xxx).

## Farben der Nachrichten (zusätzlich zu den App-Farben)

| Variable | Hell | Dunkel |
|---|---|---|
| `--farbe-sms-blase` | #E9E9EB | #262E42 |
| `--farbe-email-knopf` / `-text` | #374151 / #FFFFFF | #D1D5DB / #111827 |
| `--farbe-whatsapp-kopf` / `-kopf-text` | #075E54 / #FFFFFF | #1F2C34 / #E9EDEF |
| `--farbe-whatsapp-hintergrund` | #EFEAE2 | #0B141A |
| `--farbe-whatsapp-blase` | #FFFFFF | #202C33 |
| `--farbe-whatsapp-hinweis` | #FFF3C4 | #2A3036 |
| `--farbe-instagram-blase` | #EFEFEF | #262626 |

Alle Text-Hintergrund-Kombinationen erfüllen den Kontrast-Standard WCAG AA (mind. 4.5 : 1), geprüft am 09.11.2026.

## Testen

- Lokal immer über einen Webserver öffnen (VS Code «Live Server» oder `python -m http.server`),
  nicht per Doppelklick, sonst lädt `fetch` die JSON-Datei nicht.
- Getestet: Handy (390 px) und Desktop (1440 px), hell und dunkel, alle 10 Situationen, Link-Vorschau mit Maus, Antippen und Tastatur.
- Getestet: kein Neuaufbau zwischen Situationen, keine Layout-Verschiebung beim Darüberfahren, Fortschrittsbalken 10 % bis 100 % animiert.

## Layout des Situationsbildschirms

- Handy: eine Spalte (Kanal, Kontext, Nachricht, Link-Vorschau, Frage, Knöpfe).
- Desktop (ab 900 px): zwei Spalten, oben ausgerichtet. Frage und Knöpfe rechts bleiben beim Scrollen sichtbar
  (`position: sticky`) und stehen bei jeder Situation an derselben Stelle.
- Fortschrittsbalken: `<div role="progressbar">` mit `aria-valuenow` / `aria-valuemax`, weil sich `<progress>` nicht
  in allen Browsern flüssig animieren lässt.

## Resultat-Bildschirm

- Ring: SVG-Kreis mit `pathLength="100"`, der blaue Bogen ist so lang wie der Anteil richtiger Antworten in Prozent.
  Er füllt sich beim Erscheinen (0.9 s), bei «Bewegung reduzieren» ohne Animation.
- Bewertung: 100 % «Perfekt!», ab 80 % «Sehr gut!», ab 50 % «Gut gemacht!», darunter «Übe noch etwas».
  Die Texte dazu stehen in `BEWERTUNGEN` in `js/bildschirme/resultat.js` und sprechen von «Nachrichten», nicht nur von Phishing.
- Tipps: aus den falsch beantworteten Situationen (Merkmal-Art → Tipp, echte Nachricht als Phishing → «Echte nicht verdächtigen»),
  nach Häufigkeit sortiert, höchstens 4. «Echte nicht verdächtigen» steht immer zuerst, wenn eine echte Nachricht
  falsch eingeschätzt wurde, weil es dafür nur diesen einen Tipp gibt. Bei 10 von 10 ausgeblendet.
- Handy: eine Spalte wie im Wireframe. Desktop: links Ring mit Bewertung, rechts Statistik, Tipps und Knopf.

## Farbschema

- `js/farbschema.js` setzt `data-farbschema="hell"` oder `"dunkel"` auf `<html>`, bevor die Seite gezeichnet wird.
- Reihenfolge: gespeicherte eigene Wahl (`localStorage`, Schlüssel `farbschema`) → sonst Geräteeinstellung.
- Der Schalter (`.farbschema-knopf`) steht in jeder Kopfzeile. Ein Klick-Listener auf dem Dokument wechselt das Schema.
- Im CSS stehen die hellen Farben in `:root`, die dunklen in `:root[data-farbschema="dunkel"]` (inkl. `color-scheme`).

## «Deine Antworten» im Resultat

- Eine `<ol>` mit einem Eintrag pro Situation, in der gespielten Reihenfolge (`erstelleAntwortEintrag`).
- Jeder Eintrag ist ein `<details>`: Die Zusammenfassung zeigt ✓ oder ✗, Titel (Kanal und Betreff bzw. Absender) und das
  Ergebnis als Text. Aufgeklappt: Kontext, die Nachricht mit Link-Prüfung und bei Fehlern die Erklärung (`erstelleErklaerung`).
- Richtig/falsch wird über Symbol, Text und Randfarbe gezeigt (`.antwort-eintrag--richtig` / `--falsch`).
- Desktop: aufgeklappter Eintrag in zwei Spalten (Nachricht links, Erklärung rechts).

## Fokus und Bedienung

- Neuer Bildschirm: Die Hauptüberschrift (`h1` mit `tabindex="-1"`) bekommt den Fokus, ohne zu scrollen.
- Neue Situation: Die Nachricht (`.situation__nachricht`, `tabindex="-1"`) bekommt den Fokus.
  Screenreader lesen so die neue Nachricht vor, und eine gedrückte Enter-Taste beantwortet keine weiteren Situationen.
- Doppelklick auf «Echt» oder «Phishing»: Der zweite Klick (`event.detail > 1`) wird ignoriert.
- Hover-Farben der Antwort-Knöpfe nur bei Geräten mit Maus (`@media (hover: hover)`), damit auf dem Handy nichts eingefärbt hängen bleibt.
- `.nur-desktop`: auf dem Handy nur optisch versteckt, für Screenreader weiterhin lesbar.
- Daten: `ladeSituationen()` wirft einen Fehler, wenn die Datei keine Situationen enthält → Fehlermeldung.
