import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleAntwortEintrag } from "../komponenten/antwort-eintrag.js";

const BEWERTUNGEN = [
  {
    abAnteil: 1,
    titel: "Perfekt!",
    text: "Du hast alle Nachrichten richtig eingeschätzt. Damit bist du gut vor Phishing geschützt.",
  },
  {
    abAnteil: 0.8,
    titel: "Sehr gut!",
    text: "Du erkennst fast alle Phishing-Versuche. Mit den Tipps unten klappt es beim nächsten Mal ganz.",
  },
  {
    abAnteil: 0.5,
    titel: "Gut gemacht!",
    text: "Du erkennst die meisten Phishing-Versuche. Mit den Tipps unten wirst du noch sicherer.",
  },
  {
    abAnteil: 0,
    titel: "Übe noch etwas",
    text: "Phishing ist oft schwer zu erkennen. Achte auf die Tipps unten und versuche es nochmals.",
  },
];

const TIPP_PRO_ART = {
  absender: "Absender prüfen",
  link: "Links prüfen",
  zeitdruck: "Bei Zeitdruck misstrauisch sein",
  daten: "Keine Daten herausgeben",
  geld: "Bei Geldforderungen nachfragen",
  anrede: "Auf die Anrede achten",
  angebot: "Zu gute Angebote hinterfragen",
  bitte: "Ungewöhnliche Bitten prüfen",
};

const TIPP_ECHTE_NACHRICHTEN = "Echte nicht verdächtigen";

const MAXIMALE_ANZAHL_TIPPS = 4;

export function erstelleResultatBildschirm({ antworten, beimNochmalsSpielen }) {
  const bildschirm = erstelleAusVorlage("vorlage-resultat");

  const anzahlRichtig = antworten.filter((antwort) => antwort.istRichtig).length;
  const anteilRichtig = anzahlRichtig / antworten.length;
  const bewertung = BEWERTUNGEN.find((stufe) => anteilRichtig >= stufe.abAnteil);

  bildschirm.querySelector(".resultat__zahl").textContent = `${anzahlRichtig}/${antworten.length}`;
  bildschirm.querySelector(".resultat__titel").textContent = bewertung.titel;
  bildschirm.querySelector(".resultat__text").textContent = bewertung.text;

  zeigeRing(bildschirm, anteilRichtig);
  zeigeErkannte(bildschirm, ".resultat__phishing-erkannt", antworten.filter((antwort) => antwort.situation.istPhishing));
  zeigeErkannte(bildschirm, ".resultat__echte-erkannt", antworten.filter((antwort) => !antwort.situation.istPhishing));
  zeigeTipps(bildschirm, sammleTipps(antworten));
  zeigeAntworten(bildschirm, antworten);

  bildschirm.querySelector(".resultat__nochmals").addEventListener("click", beimNochmalsSpielen);

  return bildschirm;
}

function zeigeRing(bildschirm, anteilRichtig) {
  const ringWert = bildschirm.querySelector(".resultat__ring-wert");

  if (anteilRichtig === 0) {
    ringWert.remove();
  } else {
    ringWert.style.setProperty("--anteil", anteilRichtig * 100);
  }
}

function zeigeErkannte(bildschirm, selektor, antworten) {
  const anzahlErkannt = antworten.filter((antwort) => antwort.istRichtig).length;
  bildschirm.querySelector(selektor).textContent = `${anzahlErkannt} von ${antworten.length}`;
}

function sammleTipps(antworten) {
  const anzahlProTipp = new Map();
  const falscheAntworten = antworten.filter((antwort) => !antwort.istRichtig);

  for (const antwort of falscheAntworten) {
    for (const tipp of tippsZurSituation(antwort.situation)) {
      anzahlProTipp.set(tipp, (anzahlProTipp.get(tipp) ?? 0) + 1);
    }
  }

  return [...anzahlProTipp.entries()]
    .sort(([, anzahlA], [, anzahlB]) => anzahlB - anzahlA)
    .slice(0, MAXIMALE_ANZAHL_TIPPS)
    .map(([tipp]) => tipp);
}

function tippsZurSituation(situation) {
  if (!situation.istPhishing) {
    return [TIPP_ECHTE_NACHRICHTEN];
  }
  return situation.merkmale.map((merkmal) => TIPP_PRO_ART[merkmal.art]);
}

function zeigeTipps(bildschirm, tipps) {
  const bereich = bildschirm.querySelector(".resultat__tipps");
  bereich.hidden = tipps.length === 0;

  const liste = bereich.querySelector(".resultat__tipps-liste");
  for (const tipp of tipps) {
    const eintrag = document.createElement("li");
    eintrag.className = "chip chip--lila";
    eintrag.textContent = tipp;
    liste.append(eintrag);
  }
}

function zeigeAntworten(bildschirm, antworten) {
  const liste = bildschirm.querySelector(".antworten__liste");
  antworten.forEach((antwort, index) => {
    liste.append(erstelleAntwortEintrag(antwort, index + 1));
  });
}
