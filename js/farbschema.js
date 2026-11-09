const SPEICHER_SCHLUESSEL = "farbschema";
const systemIstDunkel = window.matchMedia("(prefers-color-scheme: dark)");

function gespeichertesFarbschema() {
  try {
    return localStorage.getItem(SPEICHER_SCHLUESSEL);
  } catch {
    return null;
  }
}

function speichereFarbschema(farbschema) {
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, farbschema);
  } catch {
    console.warn("Das Farbschema konnte nicht gespeichert werden und gilt nur bis zum Neuladen.");
  }
}

function farbschemaDesSystems() {
  return systemIstDunkel.matches ? "dunkel" : "hell";
}

function setzeFarbschema(farbschema) {
  document.documentElement.dataset.farbschema = farbschema;
}

function wechsleFarbschema() {
  const neuesFarbschema = document.documentElement.dataset.farbschema === "dunkel" ? "hell" : "dunkel";
  setzeFarbschema(neuesFarbschema);
  speichereFarbschema(neuesFarbschema);
}

setzeFarbschema(gespeichertesFarbschema() ?? farbschemaDesSystems());

systemIstDunkel.addEventListener("change", () => {
  if (!gespeichertesFarbschema()) {
    setzeFarbschema(farbschemaDesSystems());
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".farbschema-knopf")) {
    wechsleFarbschema();
  }
});
