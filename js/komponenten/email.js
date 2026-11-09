import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleLink } from "./link.js";

export function erstelleEmail(situation) {
  const email = erstelleAusVorlage("vorlage-email");

  email.querySelector(".email__betreff").textContent = situation.betreff;
  email.querySelector(".email__avatar").textContent = situation.absender.charAt(0);
  email.querySelector(".email__absender").textContent = situation.absender;
  email.querySelector(".email__adresse").textContent = `<${situation.absenderAdresse}>`;
  email.querySelector(".email__zeit").textContent = situation.zeit;

  const inhalt = email.querySelector(".email__inhalt");
  for (const text of situation.text) {
    inhalt.append(erstelleAbsatz(text));
  }

  if (situation.link) {
    inhalt.append(erstelleAbsatz(erstelleEmailLink(situation.link)));
  }

  if (situation.gruss) {
    inhalt.append(erstelleAbsatz(situation.gruss));
  }

  return email;
}

function erstelleAbsatz(inhalt) {
  const absatz = document.createElement("p");
  absatz.className = "email__absatz";
  absatz.append(inhalt);
  return absatz;
}

function erstelleEmailLink(link) {
  const knopf = erstelleLink(link);
  if (link.alsKnopf) {
    knopf.classList.add("link--knopf");
  }
  return knopf;
}
