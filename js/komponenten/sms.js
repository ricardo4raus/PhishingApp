import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleLink } from "./link.js";

export function erstelleSms(situation) {
  const sms = erstelleAusVorlage("vorlage-sms");

  sms.querySelector(".sms__absender").textContent = situation.absender;
  sms.querySelector(".sms__zeit").textContent = situation.zeit;

  const verlauf = sms.querySelector(".sms__verlauf");
  for (const text of situation.text) {
    verlauf.append(erstelleBlase(text));
  }

  if (situation.link) {
    verlauf.lastElementChild.append(" ", erstelleLink(situation.link));
  }

  return sms;
}

function erstelleBlase(text) {
  const blase = document.createElement("p");
  blase.className = "sms__blase";
  blase.textContent = text;
  return blase;
}
