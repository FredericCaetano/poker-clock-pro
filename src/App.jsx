import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TournamentsGrid from "./components/TournamentsGrid.jsx";
import TournamentPage from "./components/TournamentPage.jsx";
import LayoutSettings from "./components/LayoutSettings.jsx";
import ChampionshipView from "./components/ChampionshipView.jsx";
import StructureTemplatesManager from "./components/StructureTemplatesManager.jsx";
import AccountsAdmin from "./components/AccountsAdmin.jsx";
import EliminationView from "./components/EliminationView.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { useAccount } from "./context/AccountContext.jsx";
import { canManageTournaments } from "./lib/auth.js";

/**
 * App — les onglets Horloge et Structure autonomes ont été retirés de la
 * barre latérale : la conception de modèles de structure et d'horloge se
 * fait désormais depuis "Gérer les modèles" (StructureTemplatesManager),
 * sans dépendre d'un tournoi actif. L'horloge et la structure d'UN tournoi
 * précis restent accessibles via ses propres onglets dans TournamentPage.
 */
export default function App() {
  const { account } = useAccount();
  const manage = canManageTournaments(account.role);
  const isStaffOnly = account.role === "floor" || account.role === "table_captain";

  const [tab, setTab] = useState(isStaffOnly ? "eliminate" : "tournaments");
  const [openTournamentId, setOpenTournamentId] = useState(null);
  const { theme } = useTheme();

  function goToTab(key) {
    setTab(key);
  }

  const bg = theme.background || { type: "color", value: "#14181C" };
  const bgStyle =
    bg.type === "image"
      ? { backgroundImage: `url(${bg.value})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: bg.value };

  return (
    <div className="h-screen w-screen flex" style={bgStyle}>
      <Sidebar tab={tab} setTab={goToTab} />
      <div className="flex-1 min-w-0 h-full overflow-hidden relative pt-14 sm:pt-0">
        {tab === "tournaments" &&
          (openTournamentId ? (
            <TournamentPage tournamentId={openTournamentId} onBack={() => setOpenTournamentId(null)} />
          ) : (
            <TournamentsGrid onOpen={setOpenTournamentId} />
          ))}
        {tab === "eliminate" && isStaffOnly && <EliminationView />}
        {tab === "championship" && <ChampionshipView />}
        {tab === "templates" && manage && <StructureTemplatesManager />}
        {tab === "accounts" && manage && <AccountsAdmin />}
        {tab === "settings" && manage && <LayoutSettings />}
      </div>
    </div>
  );
}
