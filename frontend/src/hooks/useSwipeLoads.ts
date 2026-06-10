import { useState, useEffect } from 'react';
import { Load } from '../types/load';
import { mockLoads } from '../data/mockLoads';

const FUNCTIONS_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || '';

export function useSwipeLoads(userId: string) {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Dev mode — mock
    if (!FUNCTIONS_URL) {
      const seen = JSON.parse(localStorage.getItem(`loadaro_seen_${userId}`) || '[]');
      const unseen = mockLoads.filter((l) => !seen.includes(l.id));
      setLoads(unseen);
      setLoading(false);
      return;
    }

    // Production — fetch from Firestore via function
    setLoading(false);
  }, [userId]);

  const acceptLoad = async (load: Load, driverName: string, driverPhone: string) => {
    // Dev mode — just remove from list
    if (!FUNCTIONS_URL) {
      const key = `loadaro_seen_${userId}`;
      const seen = JSON.parse(localStorage.getItem(key) || '[]');
      seen.push(load.id);
      localStorage.setItem(key, JSON.stringify(seen));
      setLoads((prev) => prev.filter((l) => l.id !== load.id));
      return { success: true };
    }

    const res = await fetch(`${FUNCTIONS_URL}/contactBroker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ load, driverName, driverPhone }),
    });
    const data = await res.json();

    if (data.success) {
      setLoads((prev) => prev.filter((l) => l.id !== load.id));
    }
    return data;
  };

  const skipLoad = (loadId: string) => {
    if (!FUNCTIONS_URL) {
      const key = `loadaro_seen_${userId}`;
      const seen = JSON.parse(localStorage.getItem(key) || '[]');
      seen.push(loadId);
      localStorage.setItem(key, JSON.stringify(seen));
    }
    setLoads((prev) => prev.filter((l) => l.id !== loadId));
  };

  return { loads, loading, acceptLoad, skipLoad };
}