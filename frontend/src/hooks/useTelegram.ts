import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const webApp = window.Telegram?.WebApp;

      if (webApp) {
        webApp.ready();
        webApp.expand();
        if (webApp.initDataUnsafe?.user) {
          setUser(webApp.initDataUnsafe.user);
        }
      }
    } catch {
      // Telegram SDK not available
    }

    // Always set a user so the app works standalone
    setUser((prev) => prev ?? {
      id: 123456789,
      first_name: 'Dev User',
      username: 'dev',
    });
    setIsReady(true);
  }, []);

  return { user, isReady };
}