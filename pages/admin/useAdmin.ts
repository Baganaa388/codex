import { useState, useCallback } from 'react';
import { ApiResponse } from '../../types';

const TOKEN_KEY = 'codex_admin_token';

export function useAdmin() {
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );

  const setToken = useCallback((t: string | null) => {
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(t);
  }, []);

  const isLoggedIn = token !== null;

  const authFetch = useCallback(
    async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });
      return res.json();
    },
    [token],
  );

  const logout = useCallback(() => setToken(null), [setToken]);

  return { token, setToken, isLoggedIn, authFetch, logout };
}
