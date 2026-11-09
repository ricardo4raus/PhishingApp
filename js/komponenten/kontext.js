export function zeigeKontext(element, kontext) {
  element.hidden = !kontext;
  element.querySelector(".kontext__text").textContent = kontext ?? "";
}
