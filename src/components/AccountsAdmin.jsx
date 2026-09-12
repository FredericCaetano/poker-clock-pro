import { useEffect, useState } from "react";
import { fetchAllAccounts, updateAccountRole, deleteAccount, ROLE_LABELS } from "../lib/auth.js";

/**
 * AccountsAdmin — gestion des comptes et attribution des rôles (admin uniquement).
 */
export default function AccountsAdmin() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setAccounts(await fetchAllAccounts());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleRoleChange(id, role) {
    try {
      await updateAccountRole(id, role);
      setAccounts((list) => list.map((a) => (a.id === id ? { ...a, role } : a)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id, pseudo) {
    if (!confirm(`Supprimer le compte de ${pseudo} ?`)) return;
    try {
      await deleteAccount(id);
      setAccounts((list) => list.filter((a) => a.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) {
    return <div className="p-6 text-felt-cream/60 font-body">Chargement…</div>;
  }

  return (
    <div className="p-4 sm:p-6 font-body text-felt-cream h-full overflow-y-auto">
      <div className="font-display text-xl mb-4">Comptes ({accounts.length})</div>
      {error && <div className="text-felt-alert text-sm mb-3">{error}</div>}

      <div className="space-y-2">
        {accounts.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center gap-3 bg-felt-panel border border-felt-cream/10 rounded-md px-4 py-3"
          >
            {a.avatar_data ? (
              <img src={a.avatar_data} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-felt-bg flex items-center justify-center text-felt-cream/40 font-display">
                {a.pseudo?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {a.pseudo}{" "}
                <span className="text-felt-cream/40 text-sm font-normal">
                  ({a.first_name} {a.last_name})
                </span>
              </div>
              <div className="text-xs text-felt-cream/40 truncate">{a.email || "—"}</div>
            </div>
            <select
              value={a.role}
              onChange={(e) => handleRoleChange(a.id, e.target.value)}
              className="bg-felt-bg border border-felt-cream/10 rounded-md px-2 py-1.5 text-sm text-felt-cream"
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleDelete(a.id, a.pseudo)}
              className="text-xs px-2 py-1 text-felt-alert/70 hover:text-felt-alert"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
