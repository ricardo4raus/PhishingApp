import { erstelleAusVorlage } from "../vorlagen.js";

export function erstelleSms(situation) {
  const sms = erstelleAusVorlage("vorlage-sms");

  sms.querySelector(".nachricht__absender").textContent = situation.absender;
  sms.querySelector(".nachricht__zeit").textContent = situation.zeit;
  sms.querySelector(".nachricht__text").textContent = situation.text;

  const link = sms.querySelector(".nachricht__link");
  if (situation.link) {
    link.textContent = situation.link;
  } else {
    link.remove();
  }

  return sms;
}
