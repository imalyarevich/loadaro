import { useTelegram } from './hooks/useTelegram';
import { LoadList } from './components/LoadList';
import { Header } from './components/Header';
import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const { user, isReady } = useTelegram();
  const [remaining, setRemaining] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const updateRemaining = useCallback(() => {
    if (user) {
      const key = `loadaro_seen_${user.id}`;
      const seen = JSON.parse(localStorage.getItem(key) || '[]');
      setRemaining(Math.max(0, 10 - seen.length));
    }
  }, [user]);

  useEffect(() => {
    updateRemaining();
  }, [updateRemaining, resetKey]);

  const handleReset = () => {
    if (user) {
      localStorage.removeItem(`loadaro_seen_${user.id}`);
    }
    setResetKey((k) => k + 1);
  };

  if (!isReady) {
    return <div className="app loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      <Header user={user} remaining={remaining} onReset={handleReset} />
      <main className="main">
        <LoadList userId={String(user?.id ?? '')} key={resetKey} />
      </main>
    </div>
  );
}

export default App;