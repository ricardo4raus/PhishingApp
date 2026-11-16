# 09 – Planung: mehr Situationen und zufällige Auswahl

Autor: Ricardo Kraus · Stand: 16.11.2026

> Dieser Schritt ist eine **Planung**. Es wurde noch nichts umgesetzt.

## Ausgangslage

- Die App hat 10 Situationen: 7 Phishing, 3 echt. Alle 10 kommen in jedem Durchgang vor, immer in derselben Reihenfolge.
- Wer immer «Phishing» wählt, hat 70 % richtig (offener Punkt seit [01](01_planung-und-technologie.md)).
- Entscheid vom 16.11.2026 (siehe [08](08_auswertung-nach-jeder-antwort.md#entscheid-zufälliges-verhältnis-phishingecht)):
  Das Verhältnis soll zufällig sein.

## Ziel

Eine **grosse Sammlung** von Situationen (Wunsch: mehrere hundert), aus der pro Durchgang **10 zufällig** ausgewählt werden.
So kann man das Verhältnis nicht erraten, und «Nochmals spielen» zeigt neue Situationen.

## Varianten für die Auswahl

| Variante | Vorgehen | Bewertung |
|---|---|---|
| A | 10 Situationen zufällig aus der ganzen Sammlung | Am einfachsten. Das Verhältnis hängt nur vom Zufall ab, in seltenen Fällen fehlen echte Nachrichten ganz («Echte erkannt 0 von 0»). |
| **B (empfohlen)** | Zuerst die Anzahl Phishing zufällig zwischen 3 und 7 wählen, dann so viele Phishing- und den Rest echte Situationen ziehen, zum Schluss mischen | Verhältnis bleibt unvorhersehbar, jeder Durchgang hat beide Arten. Nur wenige Zeilen mehr als A. |

**Berechnung für Variante A** (Ziehen ohne Zurücklegen, hypergeometrische Verteilung), Sammlung mit 15 Phishing und 15 echten:

| Ergebnis eines Durchgangs | Wahrscheinlichkeit |
|---|---|
| 3 bis 7 Phishing | 95.0 % |
| 0–2 oder 8–10 Phishing | 5.0 % |
| keine echte Nachricht | 0.01 % |
| Durchschnitt bei «immer Phishing» | 50 % (statt heute 70 %) |

Bei einer Sammlung mit 18 Phishing und 12 echten wären es 88 % für 3 bis 7 Phishing und durchschnittlich 60 % bei «immer Phishing».

## Mischen

- Bekannte Abkürzung `liste.sort(() => Math.random() - 0.5)`: **nicht verwenden**, sie mischt ungleichmässig
  (manche Reihenfolgen kommen häufiger vor).
- Stattdessen der **Fisher-Yates-Algorithmus**: Man geht die Liste von hinten durch und tauscht jedes Element mit
  einem zufälligen Element davor (oder mit sich selbst). Kurz und gut erklärbar.

## Geplanter Aufbau

| Datei | Änderung |
|---|---|
| `data/situationen.json` | Wird zur Sammlung, Datenmodell bleibt. Neue Felder `thema` (z. B. «paket», «bank») und `schwierigkeit` («einfach», «mittel», «schwer») |
| `js/daten.js` | Unverändert, lädt weiterhin alle Situationen |
| `js/auswahl.js` (neu) | `mische()` und `waehleSituationen()`, ohne Bildschirm und ohne Zustand |
| `js/app.js` | Zustand mit `alleSituationen` (Sammlung) und `situationen` (Durchgang). `starteTraining()` wählt bei jedem Start neu aus |
| `js/bildschirme/start.js` | «Du siehst 10 Nachrichten» zeigt die Anzahl pro Durchgang, nicht die Grösse der Sammlung |
| `werkzeuge/` (neu, optional) | Prüfskript ohne npm: Pflichtfelder, eindeutige `id`, gültige Werte für `kanal` und `art`, kein «ß», erfundene Domains per DNS |

Resultat, «Deine Antworten» und Tipps arbeiten schon mit den gespielten Situationen und brauchen keine Änderung.
Mit `thema` kann pro Durchgang höchstens eine Situation pro Thema gewählt werden (z. B. nicht drei Paket-SMS).
Mit `schwierigkeit` wird die Kann-Funktion «Schwierigkeitsstufen» später zu einem Filter.

## Grösse der Sammlung

| Punkt | Einschätzung |
|---|---|
| Technik | Eine Situation braucht heute ca. 1.4 KB. 300 Situationen wären ca. 420 KB, komprimiert ca. 100 KB. Für `fetch` auf dem Handy kein Problem. Kein Backend nötig. |
| Inhalt | Es gibt ca. 20–25 typische Phishing-Maschen. Mit Kanälen, Firmen und Formulierungen sind ca. 100–150 wirklich verschiedene Situationen realistisch. Darüber hinaus entstehen vor allem Umformulierungen, die man schnell wiedererkennt. |
| Aufwand | Eine gute Situation braucht 15–30 Minuten (Merkmale, Reaktion, Kontext, Domain-Prüfung). |
| Risiko | Jede Situation muss inhaltlich stimmen, sonst lernt man etwas Falsches (vgl. Situation 9 in [07](07_code-review.md)). |
| Zeit und Umfang | Abgabe am 07.12.2026. Das Grobkonzept nennt «etwa 10 Situationen», eine grosse Sammlung ist eine Änderung des Umfangs und mit der Lehrperson zu besprechen. |

## Empfehlung

1. Vor der Abgabe: Auswahl (Variante B mit Fisher-Yates), Felder `thema` und `schwierigkeit` und Prüfskript umsetzen.
   Sammlung auf ca. 40–60 geprüfte Situationen erweitern, vor allem echte.
2. In der Dokumentation festhalten, dass die App für viele Situationen gebaut ist: Neue Situationen brauchen keine Code-Änderung.
3. Nach der Abgabe oder bei genügend Zeit: Sammlung weiter ausbauen.

## Frage: Echte Firmenlogos

Gefragt wurde, ob die App-Symbole auf der Startseite durch echte Logos (z. B. Instagram, WhatsApp) ersetzt werden können.

| Punkt | Einschätzung |
|---|---|
| Namen | Einen Dienst beim Namen zu nennen (z. B. Kanal «Instagram») ist üblich. |
| Logos | Logos sind stärker geschützt (Marken- und Urheberrecht). Die Richtlinien der Firmen erlauben sie meist nur unverändert und ohne den Eindruck einer Verbindung zur Firma. Neben gefälschten Nachrichten auf einer öffentlichen Seite ist das heikel. |
| Lerninhalt | Ein Logo ist kein Echtheitsmerkmal, Betrüger kopieren es. Neutrale Symbole passen zur Botschaft der App. |

Stand: Die Symbole bleiben neutral. Ob echte Logos verwendet werden dürfen, ist mit der Lehrperson zu klären.

## Quellen

- javascript.info: Shuffle an array (Fisher-Yates, Fehler der `sort`-Abkürzung)
- MDN Web Docs: `Math.random()`

## Offene Punkte

- Umfang (Anzahl Situationen) und echte Logos mit der Lehrperson klären (Zwischenbesprechung 23.11.2026).
- Liste aller Maschen mit Kanal und Schwierigkeit erstellen, daraus die nächsten Situationen auswählen.
