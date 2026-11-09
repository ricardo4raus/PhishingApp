import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleNachricht } from "../komponenten/nachricht.js";
import { zeigeKontext } from "../komponenten/kontext.js";
import { erstelleLinkVorschau, verbindeLinkVorschau, bereiteLinkVorschauVor } from "../komponenten/link.js";

export function erstelleSituationBildschirm({ beiAntwort, beimBeenden }) {
  const bildschirm = erstelleAusVorlage("vorlage-situation");

  const nachricht = bildschirm.querySelector(".situation__nachricht");
  const vorschau = erstelleLinkVorschau();
  nachricht.after(vorschau);
  verbindeLinkVorschau(nachricht, vorschau);

  function beantworte(event, antwort) {
    const istZweiterKlick = event.detail > 1;
    if (!istZweiterKlick) {
      beiAntwort(antwort);
    }
  }

  bildschirm.querySelector(".situation__echt").addEventListener("click", (event) => beantworte(event, "echt"));
  bildschirm.querySelector(".situation__phishing").addEventListener("click", (event) => beantworte(event, "phishing"));
  bildschirm.querySelector(".situation__beenden").addEventListener("click", beimBeenden);

  return bildschirm;
}

export function aktualisiereSituation(bildschirm, { situation, nummer, anzahl, punkte }) {
  zeigeFortschritt(bildschirm, nummer, anzahl);
  zeigePunkte(bildschirm, punkte);
  zeigeKanal(bildschirm, situation.kanal);
  zeigeKontext(bildschirm.querySelector(".situation__kontext"), situation.kontext);
  zeigeNachricht(bildschirm, situation);
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
