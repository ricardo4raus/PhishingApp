import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleNachricht } from "../komponenten/nachricht.js";
import { zeigeKontext } from "../komponenten/kontext.js";
import { erstelleLinkVorschau, verbindeLinkVorschau, bereiteLinkVorschauVor } from "../komponenten/link.js";
import { erstelleErklaerung } from "../komponenten/erklaerung.js";

export function erstelleSituationBildschirm({ beiAntwort, beiWeiter, beimBeenden }) {
  const bildschirm = erstelleAusVorlage("vorlage-situation");

  const nachricht = bildschirm.querySelector(".situation__nachricht");
  const vorschau = erstelleLinkVorschau();
  nachricht.after(vorschau);
  verbindeLinkVorschau(nachricht, vorschau);

  function nurBeimErstenKlick(event, aktion) {
    const istZweiterKlick = event.detail > 1;
    if (!istZweiterKlick) {
      aktion();
    }
  }

  bildschirm.querySelector(".situation__echt").addEventListener("click", (event) => nurBeimErstenKlick(event, () => beiAntwort("echt")));
  bildschirm.querySelector(".situation__phishing").addEventListener("click", (event) => nurBeimErstenKlick(event, () => beiAntwort("phishing")));
  bildschirm.querySelector(".situation__weiter").addEventListener("click", (event) => nurBeimErstenKlick(event, beiWeiter));
  bildschirm.querySelector(".situation__beenden").addEventListener("click", beimBeenden);

  return bildschirm;
}

export function aktualisiereSituation(bildschirm, { situation, nummer, anzahl, punkte }) {
  zeigeSchritt(bildschirm, "entscheidung");
  zeigeFortschritt(bildschirm, nummer, anzahl);
  zeigePunkte(bildschirm, punkte);
  zeigeKanal(bildschirm, situation.kanal);
  zeigeKontext(bildschirm.querySelector(".situation__kontext"), situation.kontext);
  zeigeNachricht(bildschirm, situation);
}

export function aktualisiereAuswertung(bildschirm, { antwort, punkte, istLetzteSituation }) {
  zeigeSchritt(bildschirm, "auswertung");
  zeigePunkte(bildschirm, punkte);
  zeigeErgebnis(bildschirm, antwort);
  bildschirm.querySelector(".situation__erklaerung").replaceChildren(erstelleErklaerung(antwort.situation));
  bildschirm.querySelector(".situation__weiter-text").textContent = istLetzteSituation ? "Zum Resultat" : "Weiter";
}

function zeigeSchritt(bildschirm, schritt) {
  const istAuswertung = schritt === "auswertung";
  bildschirm.querySelector(".inhalt--situation").classList.toggle("inhalt--auswertung", istAuswertung);
  bildschirm.querySelector(".situation__ergebnis").hidden = !istAuswertung;
  bildschirm.querySelector(".situation__auswertung").hidden = !istAuswertung;
  bildschirm.querySelector(".situation__entscheidung").hidden = istAuswertung;
}

function zeigeErgebnis(bildschirm, { situation, istRichtig }) {
  const ergebnis = bildschirm.querySelector(".situation__ergebnis");
  ergebnis.classList.toggle("ergebnis--richtig", istRichtig);
  ergebnis.classList.toggle("ergebnis--falsch", !istRichtig);

  ergebnis.querySelector(".ergebnis__titel").textContent = istRichtig ? "Richtig erkannt!" : "Leider falsch";
  ergebnis.querySelector(".ergebnis__text").textContent = situation.istPhishing
    ? "Diese Nachricht ist Phishing."
    : "Diese Nachricht ist echt.";
}

function zeigeFortschritt(bildschirm, nummer, anzahl) {
  bildschirm.querySelector(".situation__nummer").textContent = nummer;
  bildschirm.querySelector(".situation__anzahl").textContent = anzahl;

  const fortschritt = bildschirm.querySelector(".situation__fortschritt");
  fortschritt.setAttribute("aria-valuenow", nummer);
  fortschritt.setAttribute("aria-valuemax", anzahl);
  fortschritt.setAttribute("aria-valuetext", `Situation ${nummer} von ${anzahl}`);
  fortschritt.querySelector(".fortschritt__balken").style.width = `${(nummer / anzahl) * 100}%`;
}

function zeigePunkte(bildschirm, punkte) {
  bildschirm.querySelector(".situation__punkte").textContent = punkte;
  bildschirm.querySelector(".situation__punkte-wort").textContent = punkte === 1 ? "Punkt" : "Punkte";
}

function zeigeKanal(bildschirm, kanal) {
  const anzeige = bildschirm.querySelector(".situation__kanal");
  anzeige.dataset.kanal = kanal;
  anzeige.querySelector(".situation__kanal-name").textContent = kanal;
}

function zeigeNachricht(bildschirm, situation) {
  const nachricht = bildschirm.querySelector(".situation__nachricht");
  nachricht.replaceChildren(erstelleNachricht(situation));
  bereiteLinkVorschauVor(nachricht, bildschirm.querySelector(".linkvorschau"), situation.link);
}
