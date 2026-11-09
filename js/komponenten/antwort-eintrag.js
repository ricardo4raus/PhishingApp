import { erstelleAusVorlage } from "../vorlagen.js";
import { erstelleNachricht } from "./nachricht.js";
import { erstelleErklaerung } from "./erklaerung.js";
import { zeigeKontext } from "./kontext.js";
import { erstelleLinkVorschau, verbindeLinkVorschau, bereiteLinkVorschauVor } from "./link.js";

export function erstelleAntwortEintrag(antwort, nummer) {
  const { situation, istRichtig } = antwort;
  const eintrag = erstelleAusVorlage("vorlage-antwort-eintrag");

  eintrag.classList.add(istRichtig ? "antwort-eintrag--richtig" : "antwort-eintrag--falsch");
  eintrag.querySelector(".antwort-eintrag__titel").textContent = `${nummer}. ${situation.kanal}: ${situation.betreff ?? situation.absender}`;
  eintrag.querySelector(".antwort-eintrag__ergebnis").textContent = beschreibeErgebnis(antwort);

  zeigeKontext(eintrag.querySelector(".antwort-eintrag__kontext"), situation.kontext);
  zeigeNachrichtMitLinkVorschau(eintrag, situation);

  if (!istRichtig) {
    eintrag.querySelector(".antwort-eintrag__inhalt").append(erstelleErklaerung(situation));
  }

  return eintrag;
}

function beschreibeErgebnis({ situation, istRichtig }) {
  if (istRichtig) {
    return situation.istPhishing
      ? "Richtig: Du hast Phishing erkannt."
      : "Richtig: Du hast erkannt, dass die Nachricht echt ist.";
  }

  return situation.istPhishing
    ? "Falsch: Du hast «Echt» gewählt, es war Phishing."
    : "Falsch: Du hast «Phishing» gewählt, die Nachricht war echt.";
}

function zeigeNachrichtMitLinkVorschau(eintrag, situation) {
  const nachricht = eintrag.querySelector(".antwort-eintrag__nachricht");
  nachricht.append(erstelleNachricht(situation));

  if (situation.link) {
    const vorschau = erstelleLinkVorschau();
    nachricht.after(vorschau);
    verbindeLinkVorschau(nachricht, vorschau);
    bereiteLinkVorschauVor(nachricht, vorschau, situation.link);
  }
}
