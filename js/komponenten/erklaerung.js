import { erstelleAusVorlage } from "../vorlagen.js";

export function erstelleErklaerung(situation) {
  const erklaerung = erstelleAusVorlage("vorlage-erklaerung");

  erklaerung.querySelector(".erklaerung__titel").textContent = situation.istPhishing
    ? "Woran du es erkennst"
    : "Darum ist die Nachricht echt";

  const merkmale = erklaerung.querySelector(".erklaerung__merkmale");
  situation.merkmale.forEach((merkmal, index) => {
    merkmale.append(erstelleMerkmal(merkmal, index + 1));
  });

  const reaktionen = erklaerung.querySelector(".reaktion__liste");
  for (const reaktion of situation.reaktion) {
    const eintrag = document.createElement("li");
    eintrag.textContent = reaktion;
    reaktionen.append(eintrag);
  }

  return erklaerung;
}

function erstelleMerkmal(merkmal, nummer) {
  const eintrag = erstelleAusVorlage("vorlage-merkmal");

  eintrag.querySelector(".merkmal__nummer").textContent = nummer;
  eintrag.querySelector(".merkmal__titel").textContent = merkmal.titel;
  eintrag.querySelector(".merkmal__text").textContent = merkmal.text;

  return eintrag;
}
