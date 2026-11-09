import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleLink } from "./link.js";

export function erstelleWhatsapp(situation) {
  const chat = erstelleAusVorlage("vorlage-whatsapp");

  chat.querySelector(".whatsapp__absender").textContent = situation.absender;

  if (!situation.unbekannterKontakt) {
    chat.querySelector(".whatsapp__hinweis").remove();
  }

  const verlauf = chat.querySelector(".whatsapp__verlauf");
  for (const text of situation.text) {
    verlauf.append(erstelleBlase(text, situation.zeit));
  }

  if (situation.link) {
    const uhrzeit = verlauf.lastElementChild.querySelector(".whatsapp__zeit");
    uhrzeit.before(" ", erstelleLink(situation.link));
  }

  return chat;
}

function erstelleBlase(text, zeit) {
  const blase = document.createElement("p");
  blase.className = "whatsapp__blase";
  blase.textContent = text;

  const uhrzeit = document.createElement("span");
  uhrzeit.className = "whatsapp__zeit";
  uhrzeit.textContent = zeit;
  blase.append(uhrzeit);

  return blase;
}
