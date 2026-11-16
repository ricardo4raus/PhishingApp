import { ladeSituationen } from "./daten.js";
import { erstelleAusVorlage } from "./vorlagen.js";
import { erstelleStartBildschirm } from "./bildschirme/start.js";
import { erstelleSituationBildschirm, aktualisiereSituation, aktualisiereAuswertung } from "./bildschirme/situation.js";
import { erstelleResultatBildschirm } from "./bildschirme/resultat.js";

const app = document.querySelector("#app");

const zustand = {
  situationen: [],
  index: 0,
  punkte: 0,
  antworten: [],
};

let situationsBildschirm;

function zeige(bildschirm) {
  app.replaceChildren(bildschirm);
  window.scrollTo(0, 0);
  bildschirm.querySelector("h1")?.focus({ preventScroll: true });
}

function zeigeStart() {
  zeige(
    erstelleStartBildschirm({
      anzahlSituationen: zustand.situationen.length,
      beimStarten: starteTraining,
    }),
  );
}

function starteTraining() {
  zustand.index = 0;
  zustand.punkte = 0;
  zustand.antworten = [];

  situationsBildschirm = erstelleSituationBildschirm({
    beiAntwort: werteAntwortAus,
    beiWeiter: zeigeNaechsteSituation,
    beimBeenden: beendeTraining,
  });
  zeige(situationsBildschirm);
  zeigeSituation();
}

function zeigeSituation() {
  aktualisiereSituation(situationsBildschirm, {
    situation: zustand.situationen[zustand.index],
    nummer: zustand.index + 1,
    anzahl: zustand.situationen.length,
    punkte: zustand.punkte,
  });
  window.scrollTo(0, 0);
  situationsBildschirm.querySelector(".situation__nachricht").focus({ preventScroll: true });
}

function werteAntwortAus(antwort) {
  const situation = zustand.situationen[zustand.index];
  const richtigeAntwort = situation.istPhishing ? "phishing" : "echt";
  const istRichtig = antwort === richtigeAntwort;

  const neueAntwort = { situation, antwort, istRichtig };
  zustand.antworten.push(neueAntwort);
  if (istRichtig) {
    zustand.punkte += 1;
  }

  zeigeAuswertung(neueAntwort);
}

function zeigeAuswertung(antwort) {
  aktualisiereAuswertung(situationsBildschirm, {
    antwort,
    punkte: zustand.punkte,
    istLetzteSituation: zustand.index === zustand.situationen.length - 1,
  });
  window.scrollTo(0, 0);
  situationsBildschirm.querySelector(".ergebnis__titel").focus({ preventScroll: true });
}

function zeigeNaechsteSituation() {
  zustand.index += 1;
  const istLetzteSituation = zustand.index >= zustand.situationen.length;

  if (istLetzteSituation) {
    zeigeResultat();
  } else {
    zeigeSituation();
  }
}

function zeigeResultat() {
  zeige(
    erstelleResultatBildschirm({
      antworten: zustand.antworten,
      beimNochmalsSpielen: zeigeStart,
    }),
  );
}

function beendeTraining() {
  const willBeenden = window.confirm("Willst du das Training wirklich beenden?");
  if (willBeenden) {
    zeigeStart();
  }
}

function zeigeFehler() {
  zeige(erstelleAusVorlage("vorlage-fehler"));
}

try {
  zustand.situationen = await ladeSituationen();
  zeigeStart();
} catch (fehler) {
  console.error(fehler);
  zeigeFehler();
}
