const SITUATIONEN_URL = "data/situationen.json";

export async function ladeSituationen() {
  const serverAntwort = await fetch(SITUATIONEN_URL);

  if (!serverAntwort.ok) {
    throw new Error(`Situationen konnten nicht geladen werden (Status ${serverAntwort.status})`);
  }

  return serverAntwort.json();
}
