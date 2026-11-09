import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleLink } from "./link.js";

export function erstelleInstagram(situation) {
  const direktnachricht = erstelleAusVorlage("vorlage-instagram");

  direktnachricht.querySelector(".instagram__absender").textContent = situation.absender;
  direktnachricht.querySelector(".instagram__konto").textContent = situation.absenderAdresse;
  direktnachricht.querySelector(".instagram__zeit").textContent = situation.zeit;

  const verlauf = direktnachricht.querySelector(".instagram__verlauf");
  for (const text of situation.text) {
    verlauf.append(erstelleBlase(text));
  }

  if (situation.link) {
    verlauf.lastElementChild.append(" ", erstelleLink(situation.link));
  }

  return direktnachricht;
}

function erstelleBlase(text) {
  const blase = document.createElement("p");
  blase.className = "instagram__blase";
  blase.textContent = text;
  return blase;
}
