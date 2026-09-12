import { useEffect, useState } from "react";
import { useAccount } from "../context/AccountContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { canManageTournaments, ROLE_LABELS, fetchClubSettings } from "../lib/auth.js";
import ProfileModal from "./ProfileModal.jsx";
import ChatPanel from "./ChatPanel.jsx";

const NAV = [
  { key: "tournaments", icon: "🏆", label: "Tournois", show: () => true },
  { key: "eliminate", icon: "🎯", label: "Éliminer", show: (a) => a.role === "floor" || a.role === "table_captain" },
  { key: "championship", icon: "📊", label: "Championnats", show: () => true },
  { key: "templates", icon: "▦", label: "Gérer les modèles", show: (a) => canManageTournaments(a.role) },
  { key: "accounts", icon: "👥", label: "Membres", show: (a) => canManageTournaments(a.role) },
  { key: "settings", icon: "⚙️", label: "Paramètres du club", show: (a) => canManageTournaments(a.role) },
];

const COLLAPSE_KEY = "pcp_sidebar_collapsed";

/**
 * Sidebar — navigation latérale façon BlindValet : bandeau club (logo/nom +
 * code du club) en haut, navigation, chat du club intégré (messages +
 * envoi), puis carte profil + déconnexion en bas. Teintée avec la couleur
 * de fond choisie dans Paramètres du club, repliable vers la droite.
 *
 * Sur mobile (< sm), remplacée par une barre supérieure fixe (☰ + logo) et
 * un tiroir latéral en superposition — l'affichage desktop (>= sm) reste
 * inchangé, cette variante n'apparaît qu'en dessous du breakpoint sm.
 */
export default function Sidebar({ tab, setTab }) {
  const { account, logout } = useAccount();
  const { theme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [clubCode, setClubCode] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    fetchClubSettings()
      .then((s) => setClubCode(s?.registration_code || ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const bg = theme.background;
  const sidebarColor = bg?.type === "color" ? bg.value : "#1B2027";
  const logoData = theme.logoData;

  function handleNav(key) {
    setTab(key);
    setMobileOpen(false);
  }

  function NavList({ onNavigate }) {
    return (
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.filter((item) => item.show(account)).map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-body text-left ${
              tab === item.key
                ? "bg-felt-gold/10 text-felt-gold border-r-2 border-felt-gold"
                : "text-felt-cream/60 hover:text-felt-cream hover:bg-black/20"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    );
  }

  function ClubHeader() {
    return (
      <div className="flex items-center gap-3 px-5 py-4 border-b border-felt-gold/10">
        {logoData ? (
          <img src={logoData} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-felt-gold/15 border border-felt-gold/40 flex items-center justify-center text-felt-gold text-lg shrink-0">
            ♠
          </div>
        )}
        <div className="min-w-0">
          <div className="font-display text-base text-felt-cream tracking-wide truncate">19PokerClub</div>
          {clubCode && <div className="text-[11px] text-felt-cream/40">ID · {clubCode}</div>}
        </div>
      </div>
    );
  }

  function ChatSection() {
    return (
      <div className="shrink-0 border-t border-felt-gold/10 flex flex-col">
        <div className="px-5 pt-3 pb-1 text-xs font-display text-felt-cream/50 uppercase tracking-wide">
          💬 Chat du club
        </div>
        <div className="h-64 px-4 pb-2">
          <ChatPanel />
        </div>
      </div>
    );
  }

  function ProfileFooter({ onNavigate }) {
    return (
      <>
        <button
          onClick={() => {
            setShowProfile(true);
            onNavigate?.();
          }}
          className="flex items-center gap-3 px-5 py-3 border-t border-felt-gold/10 hover:bg-black/20 text-left"
        >
          {account.avatar_data ? (
            <img src={account.avatar_data} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center text-felt-cream/50 font-display text-sm">
              {account.pseudo?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm text-felt-cream truncate">{account.pseudo}</div>
            <div className="text-xs text-felt-cream/40 truncate">{ROLE_LABELS[account.role]}</div>
          </div>
        </button>
        <button onClick={logout} className="px-5 py-2 text-xs text-felt-cream/40 hover:text-felt-cream text-left">
          ↪ Déconnexion
        </button>
      </>
    );
  }

  return (
    <>
      {/* Barre supérieure mobile (< sm uniquement) */}
      <div
        style={{ backgroundColor: sidebarColor }}
        className="sm:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-felt-gold/10"
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="text-felt-cream text-xl leading-none px-1"
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
        {logoData ? (
          <img src={logoData} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-felt-gold/15 border border-felt-gold/40 flex items-center justify-center text-felt-gold text-sm shrink-0">
            ♠
          </div>
        )}
        <div className="font-display text-sm text-felt-cream tracking-wide truncate">19PokerClub</div>
      </div>

      {/* Fond assombri + tiroir mobile */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}
      <div
        style={{ backgroundColor: sidebarColor }}
        className={`sm:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] flex flex-col transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <ClubHeader />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-felt-cream/50 hover:text-felt-cream text-lg px-4"
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>
        <NavList onNavigate={handleNav} />
        <ChatSection />
        <ProfileFooter onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Barre latérale desktop (>= sm), comportement inchangé */}
      <div className="hidden sm:flex h-full shrink-0">
        <div
          style={{ width: collapsed ? 0 : 240, backgroundColor: sidebarColor, transition: "width 300ms ease" }}
          className="h-full overflow-hidden flex flex-col"
        >
          <div style={{ width: 240 }} className="h-full flex flex-col">
            <ClubHeader />
            <NavList onNavigate={(key) => setTab(key)} />
            <ChatSection />
            <ProfileFooter />
          </div>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Déployer le menu" : "Réduire le menu"}
          className="h-full w-3 shrink-0 bg-felt-gold/20 hover:bg-felt-gold/40 flex items-center justify-center text-felt-cream/60 hover:text-felt-cream"
        >
          <span className="text-[10px]">{collapsed ? "›" : "‹"}</span>
        </button>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
