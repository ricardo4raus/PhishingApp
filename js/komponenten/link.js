import { erstelleAusVorlage } from "../vorlagen.js";

const AKTIV = "linkvorschau--aktiv";

let naechsteVorschauNummer = 1;

export function erstelleLink(link) {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "link";
  knopf.textContent = link.text;
  return knopf;
}

export function erstelleLinkVorschau() {
  const vorschau = erstelleAusVorlage("vorlage-linkvorschau").firstElementChild;
  vorschau.querySelector(".linkvorschau__ziel").id = `linkziel-${naechsteVorschauNummer}`;
  naechsteVorschauNummer += 1;
  return vorschau;
}

export function verbindeLinkVorschau(nachricht, vorschau) {
  function zeigeZiel(event) {
    if (event.target.closest(".link")) {
      vorschau.classList.add(AKTIV);
    }
  }

  function zeigeHinweis(event) {
    if (event.target.closest(".link")) {
      vorschau.classList.remove(AKTIV);
    }
  }

  nachricht.addEventListener("mouseover", zeigeZiel);
  nachricht.addEventListener("focusin", zeigeZiel);
  nachricht.addEventListener("click", zeigeZiel);
  nachricht.addEventListener("mouseout", zeigeHinweis);
  nachricht.addEventListener("focusout", zeigeHinweis);
}

export function bereiteLinkVorschauVor(nachricht, vorschau, link) {
  const ziel = vorschau.querySelector(".linkvorschau__ziel");

  vorschau.hidden = !link;
  vorschau.classList.remove(AKTIV);
  ziel.textContent = link ? `Führt zu: ${link.ziel}` : "";

  const knopf = nachricht.querySelector(".link");
  if (knopf) {
    knopf.setAttribute("aria-describedby", ziel.id);
  }
}
