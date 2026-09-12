import { supabase } from "./supabase.js";

/**
 * clockState.js — persistance de l'état de l'horloge (niveau, temps
 * restant, en cours/pause) directement sur la ligne du tournoi, pour que
 * l'horloge continue correctement même après un changement d'onglet, un
 * rechargement de page, ou depuis un autre appareil.
 */
export async function saveClockState(tournamentId, { levelIndex, secondsLeft, isRunning }) {
  const { error } = await supabase
    .from("tournaments")
    .update({
      clock_level_index: levelIndex,
      clock_seconds_left: secondsLeft,
      clock_is_running: isRunning,
      clock_updated_at: new Date().toISOString(),
    })
    .eq("id", tournamentId);
  if (error) throw error;
}
