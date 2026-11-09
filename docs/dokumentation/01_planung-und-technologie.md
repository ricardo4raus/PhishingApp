# 01 – Planung und Technologie

Autor: Ricardo Kraus · Stand: 09.11.2026

## Funktionsumfang angepasst

Im Grobkonzept stand «Nutzer müssen Phishing-Situationen selber erstellen und bearbeiten können» als Muss-Funktion.
Das hätte einen Editor und eine Speicherung gebraucht und passt nicht in den Zeitrahmen bis zur Abgabe.

| Änderung | Begründung |
|---|---|
| «Situationen erstellen» von Muss zu Kann verschoben | Zu gross für den Zeitrahmen, noch mit der Lehrperson zu klären |
| «Eigene Nachrichten importieren» von Kann zur Abgrenzung verschoben | Echte Nachrichten können persönliche Daten enthalten |
| Startseite und Resultat bei den Muss-Funktionen ergänzt | Sie sind Teil des Ablaufs und waren nur im Ablauf beschrieben |
| Tipps-Seite bei den Kann-Funktionen ergänzt | Steht in den Wireframes |

**Muss:** Startseite, Situationen anzeigen (SMS, E-Mail, Chat), Entscheidung «Echt/Phishing»,
Auswertung mit Erklärung, Resultat.
**Kann:** Schwierigkeitsstufen, Tipps-Seite, Login, Verlauf, eigene Situationen, reale Fälle.

## Wahl der Technologie

Entscheid: **HTML, CSS und JavaScript ohne Framework**, Daten in einer **JSON-Datei**, Veröffentlichung auf **GitHub Pages**.

| Variante | Bewertung |
|---|---|
| HTML/CSS/JavaScript ohne Framework | Gewählt. Kein Build-Schritt, keine Abhängigkeiten, jede Zeile erklärbar, läuft auf jedem Browser. |
| React oder Angular | In Firmen verbreitet, aber für vier Bildschirme zu gross. Mehr Konzepte (Komponenten-Lebenszyklus, Build-Tools, npm), die erklärt werden müssten. |
| Python mit Server (z. B. Flask) | Braucht ein Hosting mit Server. Gratis-Angebote schlafen ein und starten langsam, das gefährdet Erfolgskriterium 4 (zuverlässig). |
| Python im Browser (PyScript) | Lädt zuerst eine grosse Python-Umgebung herunter, auf dem Handy zu langsam. |

Begründung in einem Satz: Die App hat nur vier Bildschirme und einen einfachen Ablauf.
Die einfachste Lösung, welche die Anforderungen erfüllt, ist auch die zuverlässigste.

Weitere Entscheide:
- **Keine Datenbank, kein Backend in der ersten Version:** Ohne Login gibt es nichts, was gespeichert werden muss.
- **Backend später möglich:** Wenn alle Muss-Funktionen fertig und getestet sind und Zeit bleibt,
  kann ein Backend für Login und eigene Situationen dazukommen. Bevorzugt wird ein Backend-Dienst
  (z. B. Supabase), weil dann kein eigener Server nötig ist und die App auf GitHub Pages bleiben kann.
  Damit das ohne grossen Umbau geht, werden Daten nur in einer Datei (`js/daten.js`) geladen.
  Zu beachten: Datenschutz (Speicherort in der EU/Schweiz) und Zuverlässigkeit (JSON-Datei als Rückfall).
- **GitHub Pages:** Gratis, fester Link für Testpersonen, wird bei jedem Push aktualisiert.

## Repository

- GitHub: https://github.com/ricardo4raus/PhishingApp
- Die Begleitdokumentation (Word) ist nicht im Repository, weil sie später Kontaktdaten der Testpersonen enthält
  und das Repository öffentlich ist.

## Überprüfung von Konzept, Farben und Wireframes

**Farben:** Alle Textfarben erfüllen den Kontrast-Standard WCAG AA (mind. 4.5 : 1).
Ausnahme: Im Dunkelmodus ist weisse Schrift auf dem hellblauen Button zu schwach (2.7 : 1).
Darum ist die Schrift auf blauen Buttons im Dunkelmodus dunkel (7.1 : 1), wie im Wireframe.

**Offene Punkte aus der Überprüfung:**
- Die «festgelegten Nutzungssituationen» aus Erfolgskriterium 4 sind noch nicht definiert
  (z. B. Handy Android/iPhone, Laptop, hell/dunkel).
- Verhältnis Phishing/echt ist 7 : 3. Wer immer «Phishing» drückt, hätte 70 %. Besser 6 : 4 oder 5 : 5.
- Wireframes für E-Mail und Chat fehlen noch.
- Verhalten beim Antippen eines Links in einer Nachricht ist noch nicht festgelegt.
