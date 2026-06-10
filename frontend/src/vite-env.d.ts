/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      initData: string;
      initDataUnsafe: {
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
        };
      };
      ready: () => void;
      expand: () => void;
      close: () => void;
      MainButton: {
        show: () => void;
        hide: () => void;
        setText: (text: string) => void;
        onClick: (callback: () => void) => void;
      };
      BackButton: {
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
      };
      setHeaderColor: (color: string) => void;
      setBackgroundColor: (color: string) => void;
    };
  };
}