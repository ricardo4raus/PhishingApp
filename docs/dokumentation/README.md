# Entwicklungsdokumentation Phishing-Simulator

Autor: Ricardo Kraus, AP23e, TBZ

Diese Dokumentation hält fest, wie die App aufgebaut ist und was wann gemacht und entschieden wurde.
Sie dient als Nachschlagewerk und als Grundlage, um die Begleitdokumentation (Word) inhaltlich zu überprüfen.

## Wo finde ich was?

| Frage | Datei |
|---|---|
| Wie funktioniert die App **jetzt**? (Dateien, Datenmodell, Komponenten, Situationen) | [app-aufbau.md](app-aufbau.md) |
| **Was** wurde **wann** geändert? (kurz, chronologisch) | [aenderungsprotokoll.md](aenderungsprotokoll.md) |
| Warum wurde etwas so gemacht? (ausführlich pro Arbeitsschritt) | Nummerierte Dateien, siehe unten |
| Welche Quellen wurden verwendet? | [quellen.md](quellen.md) |

## Arbeitsschritte im Detail

| Datei | Inhalt | Passt zu Kapitel der Begleitdokumentation |
|---|---|---|
| [01_planung-und-technologie.md](01_planung-und-technologie.md) | Funktionsumfang, Wahl der Technologie, Repository, Überprüfung von Farben und Wireframes | 4.1 Planung und Konzept, 4.2 Entwürfe |
| [02_erste-komponenten.md](02_erste-komponenten.md) | Grundgerüst, Start- und Situationsbildschirm, erste SMS-Darstellung, Tests | 4.3 Umsetzung, 4.5 Tests |
| [03_situationen-und-kanaele.md](03_situationen-und-kanaele.md) | Alle 10 Situationen, Darstellung als SMS, E-Mail, WhatsApp und Instagram, Link-Prüfung, Kontext | 4.3 Umsetzung, 4.4 Phishing-Situationen, 4.5 Tests |
| [04_fluessiger-ablauf.md](04_fluessiger-ablauf.md) | Kein Neuaufbau pro Situation, animierter Fortschrittsbalken, kein Springen des Layouts | 4.3 Umsetzung (Problem und Lösung), 4.5 Tests |
| [05_resultat-und-farbschema.md](05_resultat-und-farbschema.md) | Resultat-Bildschirm mit Bewertung und Tipps, Schalter für Hell-/Dunkelmodus | 4.3 Umsetzung, 5 Produkt, 4.5 Tests |

## Regeln für diese Dokumentation

- Jede Änderung am Code oder an den Daten bekommt einen Eintrag im [Änderungsprotokoll](aenderungsprotokoll.md).
- [app-aufbau.md](app-aufbau.md) beschreibt immer den **aktuellen** Stand und wird bei jeder Änderung nachgeführt.
- Grössere Arbeitsschritte bekommen eine eigene nummerierte Datei mit Entscheiden, Begründungen und Tests.
  Ältere nummerierte Dateien bleiben unverändert, sie zeigen den Stand von damals.
- Neue Quellen kommen mit Aufrufdatum in [quellen.md](quellen.md).
