export function erstelleAusVorlage(vorlagenId) {
  const vorlage = document.querySelector(`#${vorlagenId}`);
  return document.importNode(vorlage.content, true);
}
