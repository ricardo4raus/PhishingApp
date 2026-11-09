export function erstelleAusVorlage(vorlagenId) {
  const vorlage = document.getElementById(vorlagenId);
  return document.importNode(vorlage.content.firstElementChild, true);
}
