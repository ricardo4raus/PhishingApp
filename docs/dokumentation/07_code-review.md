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

## Teil 2: Code vereinfacht und CSS aufgeräumt

| Befund | Lösung |
|---|---|
| `aktualisiereSituation(app, …)` bekam den ganzen Seitencontainer statt den Bildschirm. Das funktionierte nur, weil die eingefügte Vorlage danach leer war, und war schwer zu erklären. | Jede Bildschirm-Vorlage hat jetzt genau ein Wurzelelement (`<div class="bildschirm">`). `erstelleAusVorlage()` gibt dieses Element zurück, und `app.js` merkt sich den Situationsbildschirm in der Variable `situationsBildschirm`. |
| `erstelleAusVorlage()` baute einen Selektor mit `#` zusammen | Einfacher mit `document.getElementById()` |
| Regeln für Antwort-Knöpfe und Fehlermeldung standen unter der Überschrift «Instagram» | Eigene Abschnitte im CSS |
| Desktop-Block durcheinander (Resultat, Situation, Start gemischt) | Gleiche Reihenfolge wie der Rest der Datei: Seitenaufbau, Start, Situation, Resultat |
| Gleiche Rundungen mehrfach als Zahl (12px, 999px) | Variablen `--radius-klein` und `--radius-rund` |
| Vorschau-Karten auf der Startseite über `:nth-of-type(1/2/3)` gestaltet | Sprechende Modifikatoren `vorschau--links`, `vorschau--eingerueckt`, `vorschau--rechts` |
| Selektor für das dunkle Farbschema beim Schalter anders geschrieben als bei den Farben | Überall `:root[data-farbschema="dunkel"]` |
| Bei 320 px Breite rutschte der Schalter unter das Logo und «4 von 7» brach um | Unter 360 px kleinere Logo-Schrift und Statistik untereinander |

### Tests Teil 2

| Test | Ergebnis |
|---|---|
| Ganzer Ablauf mit allen 10 Situationen, Kopfzeile bleibt dasselbe Element | erfüllt |
| Link-Vorschau ohne Layout-Verschiebung, Fokus auf der Nachricht | erfüllt |
| Resultat mit 10 Einträgen, Erklärung beim falschen Eintrag, «Nochmals spielen» | erfüllt |
| Farbschema-Schalter | erfüllt |
| Startseite Desktop (gekippte Vorschau-Karten) unverändert | geprüft |
| Resultat bei 320 px: Kopfzeile auf einer Zeile, Statistik untereinander | geprüft |

## Teil 3: Texte, Daten und Tipps

| Befund | Lösung |
|---|---|
| Situation 9 (echte Paket-SMS) lehrte «Bekannter Absender, kommt vom Paketdienst selbst». Absendernamen von SMS können aber gefälscht werden, und gefälschte SMS landen oft im selben Verlauf wie echte. Die App hätte etwas Falsches beigebracht. | Merkmal ersetzt durch «Erwartete Nachricht: Du wartest tatsächlich auf ein Paket. Der Absendername allein beweist aber nichts, denn er kann gefälscht werden.» |
| Situation 2 (Bank-E-Mail): Fremder Absender und fremder Link standen nur versteckt im Merkmal «Dateneingabe». Darum wurde der Tipp «Absender prüfen» nie vorgeschlagen. | Eigenes Merkmal «Fremde Adressen» (Art `absender`). Die Situation hat jetzt 4 Merkmale. |
| Situation 3: «kaputt gegangen» und «dass man nachprüft» (nicht in Du-Form) | «kaputtgegangen» und «dass deine Mutter zuerst nachprüft» |
| `alsKnopf` stand auch bei SMS- und Instagram-Links, wirkt aber nur bei E-Mails | Bei SMS und Instagram entfernt |
| Resultat-Texte sprachen von «Phishing-Versuchen», auch wenn die Fehler bei echten Nachrichten passierten. «Die meisten» passte nicht zu 5 von 10. | Neutrale Texte: «Du hast fast alle Nachrichten richtig eingeschätzt» (ab 80 %), «Du hast schon viele Nachrichten richtig eingeschätzt» (ab 50 %) |
| Beschreibung der Seite sprach von «echten Alltagsnachrichten», die Nachrichten sind aber nachgebildet | «realistischen Alltagsnachrichten» |
| Beim Test gefunden: Hatte eine falsch beantwortete Phishing-Situation 4 Merkmale, verdrängten diese den Tipp «Echte nicht verdächtigen» einer falsch eingeschätzten echten Nachricht. | Dieser Tipp steht immer zuerst, weil es für einen Fehler bei echten Nachrichten nur diesen einen Tipp gibt. Danach folgen die übrigen Tipps nach Häufigkeit. |

**Bewusst nicht geändert:**
- Situation 1: Das Merkmal «Verdächtiger Link» erwähnt auch den kleinen Betrag. Der Text stammt so aus dem Wireframe «Erklärung».
- Der Ring zeigt «7/10» und die Statistik «4 von 7»: Beides entspricht dem Wireframe «Resultat».

### Tests Teil 3

| Test (falsch beantwortete Situationen) | Ergebnis |
|---|---|
| 2 und 9 falsch: 8/10 «Sehr gut!», neuer Text, Tipps «Echte nicht verdächtigen, Bei Zeitdruck misstrauisch sein, Auf die Anrede achten, Absender prüfen» | erfüllt |
| 1, 4, 6 falsch: 7/10, Tipps «Absender prüfen, Bei Zeitdruck misstrauisch sein, Links prüfen» | erfüllt |
| 7, 8, 9 falsch (nur echte): Tipp «Echte nicht verdächtigen» | erfüllt |
| Keine falsch: 10/10 «Perfekt!», Tipps ausgeblendet | erfüllt |
| Alle falsch: 0/10 «Übe noch etwas», 4 Tipps, «Echte nicht verdächtigen» zuerst | erfüllt |
| Erklärung bei Situation 2 mit 4 Merkmalen, bei Situation 9 mit «Erwartete Nachricht» | erfüllt |
| Kein «ß» in Daten, HTML und JavaScript | erfüllt |
