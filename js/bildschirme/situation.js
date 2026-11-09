import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleSms } from "../komponenten/sms.js";

export function erstelleSituationBildschirm({ situation, nummer, anzahl, punkte, beiAntwort, beimBeenden }) {
  const bildschirm = erstelleAusVorlage("vorlage-situation");

  bildschirm.querySelector(".situation__nummer").textContent = nummer;
  bildschirm.querySelector(".situation__anzahl").textContent = anzahl;
  bildschirm.querySelector(".situation__punkte").textContent = punkte;

  const fortschritt = bildschirm.querySelector(".situation__fortschritt");
  fortschritt.max = anzahl;
  fortschritt.value = nummer;

  bildschirm.querySelector(".situation__kanal-name").textContent = situation.kanal;
  bildschirm.querySelector(".situation__nachricht").append(erstelleSms(situation));

  bildschirm.querySelector(".situation__echt").addEventListener("click", () => beiAntwort("echt"));
  bildschirm.querySelector(".situation__phishing").addEventListener("click", () => beiAntwort("phishing"));
  bildschirm.querySelector(".situation__beenden").addEventListener("click", beimBeenden);

  return bildschirm;
}
