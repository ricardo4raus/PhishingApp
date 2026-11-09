# 04 – Flüssiger Ablauf ohne Springen

Autor: Ricardo Kraus · Stand: 09.11.2026

## Ausgangslage (zwei Probleme)

1. **Layout springt beim Darüberfahren über einen Link.** Die Vorschauzeile unter der Nachricht wechselte vom Hinweis
   zum Link-Ziel. Der neue Text war unterschiedlich lang und in einer anderen Schrift, dadurch änderte sich die Höhe
   der Zeile und alles darunter verschob sich. Auf dem Desktop bewegte sich zusätzlich die rechte Spalte (Frage und
   Knöpfe), weil sie senkrecht zur linken Spalte zentriert war.
2. **Bei jeder neuen Situation wurde der ganze Bildschirm neu aufgebaut.** `app.js` ersetzte Kopfzeile,
   Fortschrittsbalken, Nachricht und Knöpfe komplett. Darum konnte der Fortschrittsbalken nicht flüssig weiterlaufen,
   er sprang einfach auf den neuen Wert.

## Lösung

| Problem | Lösung |
|---|---|
| Vorschauzeile ändert ihre Höhe | Hinweis und Link-Ziel liegen beide im HTML in **derselben Rasterzelle** (`grid-area: 1 / 1`). Es ist immer nur einer sichtbar (`visibility`). Die Zeile ist dadurch immer so hoch wie der längere der beiden Texte und ändert ihre Höhe beim Darüberfahren nicht mehr. |
| Rechte Spalte wandert mit (Desktop) | Auf dem Situationsbildschirm sind die Spalten oben ausgerichtet statt zentriert (`.inhalt--situation`). Frage und Knöpfe bleiben beim Scrollen sichtbar (`position: sticky`). Die Knöpfe sind dadurch bei jeder Situation an derselben Stelle. |
| Ganzer Bildschirm wird neu aufgebaut | Der Situationsbildschirm wird **einmal** beim Start des Trainings aufgebaut (`erstelleSituationBildschirm`). Für jede weitere Situation werden nur die veränderten Teile ersetzt (`aktualisiereSituation`): Zähler, Fortschritt, Punkte, Kanal, Kontext, Nachricht und Link-Vorschau. Kopfzeile und Knöpfe bleiben dieselben Elemente. |
| Fortschrittsbalken springt | Der Balken ist ein `<div>` mit einer Breite in Prozent. Die Breite ändert sich mit `transition: width 400ms`, der Balken läuft also flüssig zum nächsten Punkt. |
| Neue Nachricht erscheint abrupt | Die neue Nachricht wird kurz eingeblendet (250 ms, leicht von unten). |
| Bewegung kann stören | Wer in den Systemeinstellungen «Bewegung reduzieren» eingeschaltet hat, sieht keine Animationen (`prefers-reduced-motion`). |

## Entscheide und Begründungen

| Entscheid | Begründung | Quelle |
|---|---|---|
| Fortschritt als `<div role="progressbar">` statt `<progress>` | MDN empfiehlt eigentlich das HTML-Element `<progress>`. Dessen Wert lässt sich aber nicht in allen Browsern flüssig animieren. Darum ein `<div>`, bei dem die nötigen Angaben für Screenreader von Hand ergänzt werden: `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`. | MDN progressbar role |
| Animationen ausschalten bei «Bewegung reduzieren» | Bewegungen können bei manchen Menschen Schwindel auslösen. | MDN prefers-reduced-motion |
| Globale Regel `[hidden] { display: none !important; }` | Kontext und Link-Vorschau werden jetzt mit dem Attribut `hidden` ein- und ausgeblendet. Eine CSS-Regel mit `display: flex` würde `hidden` sonst überschreiben. | MDN hidden |
| Link-Vorschau einmal verbinden (`verbindeLinkVorschau`) und pro Situation vorbereiten (`bereiteLinkVorschauVor`) | Weil der Bildschirm bestehen bleibt, dürfen die Ereignis-Listener nur einmal angehängt werden, sonst würden sie sich bei jeder Situation verdoppeln. | – |
| Kanal-Symbol über `data-kanal` und CSS umschalten | Beide Symbole (Sprechblase, Briefumschlag) stehen im HTML. CSS zeigt je nach `data-kanal` das passende. Vorher wurde das unpassende Symbol gelöscht, das geht nicht mehr, wenn der Bildschirm bestehen bleibt. | – |

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `index.html` | Fortschritt als `div` mit `role="progressbar"`, Link-Vorschau fest im Situationsbildschirm (mit Hinweis und Ziel), Kontext mit `hidden`, Klasse `inhalt--situation`. Die separate Vorlage `vorlage-linkvorschau` wurde entfernt. |
| `js/app.js` | `starteTraining()` baut den Bildschirm einmal auf, `zeigeSituation()` ruft nur noch `aktualisiereSituation()` auf. |
| `js/bildschirme/situation.js` | Aufgeteilt in `erstelleSituationBildschirm()` (einmal) und `aktualisiereSituation()` (pro Situation) mit kleinen Hilfsfunktionen. |
| `js/komponenten/link.js` | `verbindeLinkVorschau()` und `bereiteLinkVorschauVor()` statt `erstelleLinkVorschau()`. |
| `css/style.css` | `[hidden]`-Regel, Fortschrittsbalken mit `transition`, Link-Vorschau mit Rasterzelle, Kanal-Symbol per `data-kanal`, Einblenden der Nachricht, `prefers-reduced-motion`, Desktop-Ausrichtung des Situationsbildschirms. |

## Tests

Automatisch getestet mit Chrome (Headless), alle 10 Situationen:

| Test | Ergebnis |
|---|---|
| Kopfzeile und Knöpfe bleiben über alle 10 Situationen dieselben Elemente (kein Neuaufbau) | erfüllt |
| Position und Höhe von Link-Vorschau, Frage und Knopf «Echt» vor und während des Darüberfahrens gleich, Desktop (1440 px) | erfüllt, keine Verschiebung |
| Dasselbe auf dem Handy (390 px) | erfüllt, keine Verschiebung |
| Fortschrittsbalken: 10 %, 20 %, … 100 %, Übergang `width 0.4s` | erfüllt |
| Kontext und Link-Vorschau nur bei den passenden Situationen sichtbar | erfüllt |
| Nach der letzten Situation zurück zum Start | erfüllt |
