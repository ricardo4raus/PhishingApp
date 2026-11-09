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

  bildschirm.querySelector(".situation__echt").addEventListener("click", () => beiAntwort("echt"));
  bildschirm.querySelector(".situation__phishing").addEventListener("click", () => beiAntwort("phishing"));
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
  bildschirm.querySelector(".situation__nachricht").replaceChildren(erstelleNachricht(situation));
  bereiteLinkVorschauVor(bildschirm.querySelector(".linkvorschau"), situation.link);
}
