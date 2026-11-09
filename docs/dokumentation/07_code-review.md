# 07 – Code-Review und Überarbeitung

Autor: Ricardo Kraus · Stand: 09.11.2026

## Vorgehen

Der gesamte Code (HTML, CSS, JavaScript, Daten) wurde in einem Code-Review systematisch auf Fehler, Barrierefreiheit,
Lesbarkeit und Best Practices geprüft. Jeder Befund wurde vor dem Beheben im Code nachgeprüft und nach dem Beheben
getestet. Die Überarbeitung ist in drei Teile aufgeteilt, jeder Teil hat einen eigenen Commit.

## Teil 1: Fehler und Barrierefreiheit

| Befund | Auswirkung | Lösung | Quelle |
|---|---|---|---|
| Doppelklick auf «Echt» oder «Phishing» beantwortete auch die nächste Situation | Weil der Bildschirm nicht mehr neu aufgebaut wird, bleiben die Knöpfe an derselben Stelle. Der zweite Klick traf schon die nächste Situation, bevor man sie gesehen hatte. | Ein zweiter Klick derselben Klickfolge (`event.detail > 1`) wird ignoriert. | – |
| Kein Fokus beim Bildschirmwechsel | Nach einem Klick lag der Fokus im Nichts. Screenreader merkten nicht, dass eine neue Nachricht da ist. Gedrückt gehaltene Enter-Taste konnte mehrere Situationen beantworten. | Bei jedem neuen Bildschirm bekommt die Hauptüberschrift den Fokus, bei jeder neuen Situation die Nachricht (`tabindex="-1"`, `focus({ preventScroll: true })`). Ohne sichtbaren Rahmen, weil man diese Elemente nicht selbst anklicken kann. | – |
| Hover-Farbe blieb auf dem Handy nach dem Antippen hängen | In der nächsten Situation sah «Echt» oder «Phishing» schon eingefärbt aus, wie vorausgewählt. Das Design hätte die Antwort beeinflussen können. | Hover-Farben nur noch bei Geräten mit Maus (`@media (hover: hover)`). | MDN hover |
| «Punkte» auf dem Handy für Screenreader unsichtbar | Vorgelesen wurde nur die Zahl, z. B. «3». | `.nur-desktop` versteckt den Text auf dem Handy jetzt nur optisch, Screenreader lesen ihn weiterhin. | – |
| Link-Ziel wurde nicht zuverlässig vorgelesen | Die Vorschauzeile änderte ihren Text nicht wirklich, darum reagierte die Live-Region nicht. | Der Link verweist mit `aria-describedby` auf das Ziel. Screenreader lesen «Führt zu: …» beim Link vor, auch wenn es optisch versteckt ist. Die Live-Region und das Attribut `data-ziel` werden nicht mehr gebraucht. | MDN aria-describedby |
| Initiale im E-Mail-Avatar wurde vorgelesen | Screenreader las «P Pixelwerk». | `aria-hidden="true"` am Avatar. | – |
| Leere Datendatei führte zu einem Absturz | Bei `[]` startete das Training mit «0 Situationen» und blieb hängen. | `ladeSituationen()` prüft, ob mindestens eine Situation vorhanden ist, sonst erscheint die Fehlermeldung. | – |
| Listen ohne Aufzählungszeichen verloren in Safari ihre Listen-Rolle | VoiceOver las die Chips und Einträge nicht als Liste vor. | `role="list"` an diesen Listen. | – |
| Fortschritt für Screenreader nur als Prozent | Vorgelesen wurde «20 %». | `aria-valuetext="Situation 2 von 10"`. | – |

### Tests Teil 1

| Test | Ergebnis |
|---|---|
| Doppelklick auf «Echt» bei Situation 1 → Situation 2 erscheint, nicht Situation 3 | erfüllt |
| Fokus: Start → Überschrift, Situation → Nachricht, Resultat → Titel | erfüllt |
| Link hat `aria-describedby`, das Element enthält «Führt zu: …» (Situation und Resultat) | erfüllt |
| Darüberfahren zeigt weiterhin das Ziel | erfüllt |
| `aria-valuetext` «Situation 2 von 10» | erfüllt |
| «Punkte» auf dem Handy optisch versteckt, aber im Text vorhanden; auf dem Desktop sichtbar | erfüllt |
| Leere Datendatei → Fehlermeldung statt Absturz | erfüllt |
| Ganzer Ablauf bis zum Resultat | erfüllt |
