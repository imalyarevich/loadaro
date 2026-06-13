import { useState, useEffect } from 'react';
import { signInWithCustomToken, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

const AUTH_FUNCTION_URL = import.meta.env.VITE_FIREBASE_TELEGRAM_AUTH_FUNCTION;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tgUser, setTgUser] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setLoading(false);
      return;
    }

    tg.ready();
    tg.expand();

    const initData = tg.initData;
    const userData = tg.initDataUnsafe?.user;

    if (!initData || !userData) {
      setLoading(false);
      return;
    }

    setTgUser({ id: userData.id, name: userData.first_name });

    const authenticate = async () => {
      try {
        const res = await fetch(AUTH_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const { token } = await res.json();
        await signInWithCustomToken(auth, token);
      } catch (err) {
        console.error('[Auth] Telegram auth failed:', err);
        setLoading(false);
      }
    };

    authenticate();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return { user, loading, tgUser, logout };
}
