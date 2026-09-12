// Tournoi actuellement sélectionné, partagé entre les onglets Horloge/Structure/Joueurs.
const KEY = "pcp_current_tournament_id";

export function getCurrentTournamentId() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setCurrentTournamentId(id) {
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
  } catch {
    // ignore (mode privé, etc.)
  }
}
