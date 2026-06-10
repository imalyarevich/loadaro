import { useSwipeLoads } from '../hooks/useSwipeLoads';
import { LoadCard } from './LoadCard';
import { useState } from 'react';

interface LoadListProps {
  userId: string;
}

export function LoadList({ userId }: LoadListProps) {
  const { loads, loading, acceptLoad, skipLoad } = useSwipeLoads(userId);
  const [sentId, setSentId] = useState<string | null>(null);

  // const current = sentId ? null : loads[0];

  if (loading) {
    return (
      <div className="status-screen">
        <div className="spinner" />
        <p>Finding loads...</p>
      </div>
    );
  }

  if (sentId) {
    return (
      <div className="swipe-stack">
        <div className="swipe-container">
          <div className="swipe-card sent-card">
            <div className="sent-check">✓</div>
            <p className="sent-text">Email sent</p>
            <p className="sent-sub">{sentId}</p>
          </div>
          <div className="swipe-actions">
            <button className="action-btn ok-btn" onClick={() => setSentId(null)}>
              <span className="action-icon">✓</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loads.length === 0) {
    return (
      <div className="status-screen empty">
        <span className="empty-icon">📦</span>
        <p>No more loads</p>
        <span className="empty-sub">Check back later</span>
      </div>
    );
  }

  return (
    <div className="swipe-stack">
      <LoadCard
        load={loads[0]}
        onAccept={async (load, name, phone) => {
          const result = await acceptLoad(load, name, phone);
          if (result?.success) setSentId(`${load.broker.company} — ${load.broker.email}`);
          return result;
        }}
        onSkip={() => skipLoad(loads[0].id)}
      />
    </div>
  );
}