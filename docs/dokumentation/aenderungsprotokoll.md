# Änderungsprotokoll

Autor: Ricardo Kraus

Kurze, chronologische Übersicht aller Änderungen an der App. Neueste Einträge zuoberst.
Details stehen in den verlinkten Dateien.

| Datum | Änderung | Betroffene Dateien | Details |
|---|---|---|---|
| 09.11.2026 | Code-Review Teil 1, Fehler und Barrierefreiheit: Doppelklick beantwortet nicht mehr zwei Situationen, Fokus beim Bildschirmwechsel, Hover nur mit Maus, Link-Ziel per `aria-describedby`, Prüfung auf leere Daten, «Punkte» für Screenreader, Listen-Rolle, Fortschritt als Text. | `index.html`, `css/style.css`, `js/app.js`, `js/daten.js`, `js/bildschirme/situation.js`, `js/komponenten/link.js`, `antwort-eintrag.js` | [07](07_code-review.md) |
| 09.11.2026 | Im Resultat können alle Situationen nochmals angesehen werden: richtig/falsch mit Symbol und Text, Nachricht aufklappbar, bei Fehlern Merkmale und richtige Reaktion. Gemeinsame Module für Nachricht, Kontext und Link-Vorschau. Commit `c8896d6`. | neu: `js/komponenten/antwort-eintrag.js`, `erklaerung.js`, `nachricht.js`, `kontext.js`; `index.html`, `css/style.css`, `js/bildschirme/resultat.js`, `situation.js`, `js/komponenten/link.js` | [06](06_antworten-im-resultat.md) |
| 09.11.2026 | Resultat-Bildschirm nach Wireframe (Ring mit Punktzahl, Bewertung, Phishing/Echte erkannt, Tipps aus den Fehlern, «Nochmals spielen»). Schalter für Hell-/Dunkelmodus oben rechts auf allen Bildschirmen, Wahl wird gespeichert. Commit `d47c77b`. | neu: `js/farbschema.js`, `js/bildschirme/resultat.js`; `index.html`, `css/style.css`, `js/app.js`, `data/situationen.json` | [05](05_resultat-und-farbschema.md) |
| 09.11.2026 | Flüssiger Ablauf: Situationsbildschirm wird nur einmal aufgebaut, pro Situation werden nur die veränderten Teile ersetzt. Fortschrittsbalken läuft animiert weiter. Link-Vorschau ändert ihre Höhe beim Darüberfahren nicht mehr. Knöpfe auf dem Desktop immer an derselben Stelle. Animationen aus bei «Bewegung reduzieren». Commit `d47c77b`. | `index.html`, `css/style.css`, `js/app.js`, `js/bildschirme/situation.js`, `js/komponenten/link.js` | [04](04_fluessiger-ablauf.md) |
| 09.11.2026 | Alle 10 Situationen umgesetzt. Eigene Darstellung für SMS, E-Mail, WhatsApp und Instagram. Links zeigen beim Darüberfahren oder Antippen ihr echtes Ziel. Kontext-Hinweis für Situationen, die ohne Vorwissen nicht lösbar sind. «1 Punkt» statt «1 Punkte». Commit `d47c77b`. | `data/situationen.json`, `index.html`, `css/style.css`, `js/bildschirme/situation.js`, `js/komponenten/sms.js`, neu: `js/komponenten/email.js`, `whatsapp.js`, `instagram.js`, `link.js` | [03](03_situationen-und-kanaele.md) |
| 09.11.2026 | Grundgerüst der App: Start- und Situationsbildschirm, SMS-Darstellung, Laden der Situationen aus JSON, Hell-/Dunkelmodus, Handy- und Desktop-Layout. Commit `1247918`. | `index.html`, `css/style.css`, `js/`, `data/situationen.json` | [02](02_erste-komponenten.md) |
| 09.11.2026 | Technologie festgelegt (HTML, CSS, JavaScript ohne Framework, JSON, GitHub Pages). Repository auf GitHub eingerichtet. Farben und Wireframes überprüft. | `.gitignore`, `docs/wireframes/` | [01](01_planung-und-technologie.md) |
