import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleSms } from "../komponenten/sms.js";
import { erstelleEmail } from "../komponenten/email.js";
import { erstelleWhatsapp } from "../komponenten/whatsapp.js";
import { erstelleInstagram } from "../komponenten/instagram.js";
import { verbindeLinkVorschau, bereiteLinkVorschauVor } from "../komponenten/link.js";

const NACHRICHT_PRO_KANAL = {
  "SMS": erstelleSms,
  "E-Mail": erstelleEmail,
  "WhatsApp": erstelleWhatsapp,
  "Instagram": erstelleInstagram,
};

export function erstelleSituationBildschirm({ beiAntwort, beimBeenden }) {
  const bildschirm = erstelleAusVorlage("vorlage-situation");

  verbindeLinkVorschau(
    bildschirm.querySelector(".situation__nachricht"),
    bildschirm.querySelector(".linkvorschau"),
  );

  bildschirm.querySelector(".situation__echt").addEventListener("click", () => beiAntwort("echt"));
  bildschirm.querySelector(".situation__phishing").addEventListener("click", () => beiAntwort("phishing"));
  bildschirm.querySelector(".situation__beenden").addEventListener("click", beimBeenden);

  return bildschirm;
}

export function aktualisiereSituation(bildschirm, { situation, nummer, anzahl, punkte }) {
  zeigeFortschritt(bildschirm, nummer, anzahl);
  zeigePunkte(bildschirm, punkte);
  zeigeKanal(bildschirm, situation.kanal);
  zeigeKontext(bildschirm, situation.kontext);
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

function zeigeKontext(bildschirm, kontext) {
  const element = bildschirm.querySelector(".situation__kontext");
  element.hidden = !kontext;
  element.querySelector(".situation__kontext-text").textContent = kontext ?? "";
}

function zeigeNachricht(bildschirm, situation) {
  const erstelleNachricht = NACHRICHT_PRO_KANAL[situation.kanal];
  bildschirm.querySelector(".situation__nachricht").replaceChildren(erstelleNachricht(situation));
  bereiteLinkVorschauVor(bildschirm.querySelector(".linkvorschau"), situation.link);
}
