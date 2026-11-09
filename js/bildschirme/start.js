import { erstelleAusVorlage } from "../vorlagen.js";

const SEKUNDEN_PRO_SITUATION = 30;

export function erstelleStartBildschirm({ anzahlSituationen, beimStarten }) {
  const bildschirm = erstelleAusVorlage("vorlage-start");
  const minuten = Math.max(1, Math.round((anzahlSituationen * SEKUNDEN_PRO_SITUATION) / 60));

  bildschirm.querySelector(".start__anzahl").textContent = anzahlSituationen;
  bildschirm.querySelector(".start__chip-anzahl").textContent = `${anzahlSituationen} Situationen`;
  bildschirm.querySelector(".start__chip-dauer").textContent = `ca. ${minuten} Min.`;

  bildschirm.querySelector(".start__button").addEventListener("click", beimStarten);

  return bildschirm;
}
