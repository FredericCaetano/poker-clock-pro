import { createContext, useContext, useEffect, useState } from "react";
import { getStoredAccountId, fetchAccountById, logout as logoutFn } from "../lib/auth.js";

const AccountContext = createContext({
  account: null,
  loading: true,
  refresh: () => {},
  logout: () => {},
});

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const id = getStoredAccountId();
    if (!id) {
      setAccount(null);
      setLoading(false);
      return;
    }
    try {
      const acc = await fetchAccountById(id);
      setAccount(acc);
    } catch {
      setAccount(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function logout() {
    logoutFn();
    setAccount(null);
  }

  return (
    <AccountContext.Provider value={{ account, loading, refresh, logout }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
