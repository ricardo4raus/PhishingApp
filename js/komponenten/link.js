import { erstelleAusVorlage } from "../vorlagen.js";

const AKTIV = "linkvorschau--aktiv";

export function erstelleLink(link) {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "link";
  knopf.textContent = link.text;
  knopf.dataset.ziel = link.ziel;
  return knopf;
}

export function erstelleLinkVorschau() {
  return erstelleAusVorlage("vorlage-linkvorschau").firstElementChild;
}

export function verbindeLinkVorschau(nachricht, vorschau) {
  const ziel = vorschau.querySelector(".linkvorschau__ziel");

  function zeigeZiel(event) {
    const link = event.target.closest(".link");
    if (link) {
      ziel.textContent = `Führt zu: ${link.dataset.ziel}`;
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

export function bereiteLinkVorschauVor(vorschau, link) {
  vorschau.hidden = !link;
  vorschau.classList.remove(AKTIV);
  vorschau.querySelector(".linkvorschau__ziel").textContent = link ? `Führt zu: ${link.ziel}` : "";
}
