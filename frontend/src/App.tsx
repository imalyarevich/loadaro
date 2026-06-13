import { useState } from 'react';
import { useLoads, Load } from './hooks/useLoads';
import { useAuth } from './hooks/useAuth';
import './App.css';

function LoadCard({ load, onAccept, onSkip }: { load: Load; onAccept: () => void; onSkip: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleAccept = () => {
    if (!name.trim()) return;
    console.log('--- EMAIL TO BROKER ---');
    console.log(`To: ${load.broker.email}`);
    console.log(`Subject: Offers - Load #${load.orderId} ${load.pickUp.city}, ${load.pickUp.state} → ${load.delivery.city}, ${load.delivery.state}`);
    console.log(`Driver: ${name}\nPhone: ${phone}`);
    console.log(`Pickup: ${load.pickUp.city}, ${load.pickUp.state} ${load.pickUp.zip}`);
    console.log(`Delivery: ${load.delivery.city}, ${load.delivery.state} ${load.delivery.zip}`);
    console.log(`Distance: ${load.route.distanceMiles} miles`);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card-wrapper">
        <div className="swipe-card sent-card">
          <div className="sent-check">✓</div>
          <p className="sent-text">Email sent to {load.broker.company}</p>
          <p className="sent-sub">{load.broker.email}</p>
        </div>
        <div className="swipe-actions">
          <button className="action-btn ok-btn" onClick={onAccept}>
            <span className="action-icon">✓</span>
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-wrapper">
              <div className="card-header">
          <span className="card-order">#{load.orderId}</span>
          <span className="card-type">{load.load.vehicleRequired}</span>
        </div>

        <div className="card-route">
          <div className="route-point pickup">
            <div className="route-dot pickup-dot" />
            <div className="route-info">
              <span className="route-label">Pickup</span>
              <span className="route-city">{load.pickUp.city}, {load.pickUp.state}</span>
              <span className="route-zip">ZIP: {load.pickUp.zip}</span>
              <span className="route-date">{load.pickUp.datetime}</span>
            </div>
          </div>
          <div className="route-line">→</div>
          <div className="route-point delivery">
            <div className="route-dot delivery-dot" />
            <div className="route-info">
              <span className="route-label">Delivery</span>
              <span className="route-city">{load.delivery.city}, {load.delivery.state}</span>
              <span className="route-zip">ZIP: {load.delivery.zip}</span>
              <span className="route-date">{load.delivery.datetime}</span>
            </div>
          </div>
        </div>

        <div className="card-stats">
          <div className="stat"><span className="stat-value">{load.route.distanceMiles}</span><span className="stat-label">miles</span></div>
          <div className="stat"><span className="stat-value">{load.route.stops}</span><span className="stat-label">stops</span></div>
          <div className="stat"><span className="stat-value">{load.load.weightLbs}</span><span className="stat-label">lbs</span></div>
          <div className="stat"><span className="stat-value">{load.load.pieces}</span><span className="stat-label">pcs</span></div>
        </div>
      <div className="swipe-card">

        <div className="card-broker">
          <span className="broker-name">{load.broker.company}</span>
          <span className="broker-contact">{load.broker.name} · {load.broker.phone}</span>
        </div>

        {load.load.hazmat && <div className="card-badge hazmat">HAZMAT</div>}

        <div className="driver-form">
          <input type="text" placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} className="driver-input" />
          <input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="driver-input" />
        </div>


      </div>
        <div className="swipe-actions">
          <button className="action-btn skip-btn" onClick={onSkip}>
            <span className="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
              <path d="M26.61 2H10.74a3 3 0 0 0-.6.07A7 7 0 0 0 9.21 2a6.62 6.62 0 0 0-1.27 13.12V27.2a2.8 2.8 0 0 0 2.8 2.8h15.87a2.8 2.8 0 0 0 2.8-2.8V4.8a2.8 2.8 0 0 0-2.8-2.8M4.46 8.62a4.76 4.76 0 1 1 4.75 4.76 4.75 4.75 0 0 1-4.75-4.76M27.54 27.2a.93.93 0 0 1-.93.93H10.74a.93.93 0 0 1-.93-.93v-12a6.6 6.6 0 0 0 4.14-2h9.24a.87.87 0 1 0 0-1.74h-8a6.6 6.6 0 0 0-1.34-7.67h12.8a.93.93 0 0 1 .93.93Z"/><path d="M10.42 11.15a.94.94 0 0 0 1.32 0 .94.94 0 0 0 0-1.32l-1.21-1.21 1.21-1.2a.94.94 0 0 0 0-1.32.9.9 0 0 0-1.32 0L9.21 7.3 8 6.1a.9.9 0 0 0-1.32 0 .94.94 0 0 0 0 1.32l1.21 1.2-1.21 1.21a.94.94 0 0 0 0 1.32 1 1 0 0 0 .66.27 1 1 0 0 0 .66-.27l1.21-1.21ZM23.16 15.13h-9a.87.87 0 0 0 0 1.74h9a.87.87 0 1 0 0-1.74M23.16 18.72h-9a.87.87 0 1 0 0 1.74h9a.87.87 0 0 0 0-1.74"/>
              </svg>
            </span>
          </button>
          <button className="action-btn accept-btn" onClick={handleAccept} disabled={!name.trim()}>
            <span className="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
                <path d="M26.61 2H10.74a3 3 0 0 0-.6.07A7 7 0 0 0 9.21 2a6.62 6.62 0 0 0-1.27 13.12V27.2a2.8 2.8 0 0 0 2.8 2.8h15.87a2.8 2.8 0 0 0 2.8-2.8V4.8a2.8 2.8 0 0 0-2.8-2.8M4.46 8.62a4.76 4.76 0 1 1 4.75 4.76 4.75 4.75 0 0 1-4.75-4.76M27.54 27.2a.93.93 0 0 1-.93.93H10.74a.93.93 0 0 1-.93-.93v-12a6.6 6.6 0 0 0 4.14-2h9.24a.87.87 0 1 0 0-1.74h-8a6.6 6.6 0 0 0-1.34-7.67h12.8a.93.93 0 0 1 .93.93Z"/><path d="M12.2 6.41a.9.9 0 0 0-1.32 0L8.44 8.86 7.54 8a.93.93 0 1 0-1.32 1.28l1.56 1.56a1 1 0 0 0 .66.27 1 1 0 0 0 .66-.27l3.1-3.11a.9.9 0 0 0 0-1.32M23.16 15.13h-9a.87.87 0 0 0 0 1.74h9a.87.87 0 1 0 0-1.74M23.16 18.72h-9a.87.87 0 1 0 0 1.74h9a.87.87 0 0 0 0-1.74"/>
              </svg>
            </span>
          </button>
        </div>

    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, signIn, logout } = useAuth();
  const { loads, loading, error } = useLoads(user);
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => i + 1);

  if (authLoading) {
    return <div className="app"><div className="status-screen"><div className="spinner" /><p>Loading...</p></div></div>;
  }

  if (!user) {
    return (
      <div className="app">
        <header className="header">
          <h1>Loadaro</h1>
        </header>
        <main className="main">
          <div className="auth-screen">
            <span className="auth-logo">📦</span>
            <h2>Welcome to Loadaro</h2>
            <p className="auth-sub">Sign in to find available loads</p>
            <button className="auth-btn" onClick={signIn}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="google-icon" />
              Sign in with Google
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (loading) return <div className="app"><div className="status-screen"><div className="spinner" /><p>Finding loads...</p></div></div>;
  if (error) return <div className="app"><div className="status-screen error"><span className="error-icon">!</span><p>{error}</p></div></div>;

  const remaining = Math.max(0, loads.length - idx);

  return (
    <div className="app">
      <header className="header">
        <h1>Loadaro</h1>
        <div className="header-right">
          <span className="user-name">{user.displayName}</span>
          <span className="remaining-count">{remaining} left</span>
          <button className="reset-btn" onClick={() => setIdx(0)} title="Reset">↺</button>
          <button className="reset-btn" onClick={logout} title="Sign out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16">
              <g fill="currentColor"><path d="M14.95 1.25c-1.37 0-2.47 0-3.34.12-.9.12-1.66.38-2.26.98a3.5 3.5 0 0 0-.93 1.93C8.28 5 8.26 5.9 8.25 7a.75.75 0 0 0 1.5 0c0-1.09.04-1.86.14-2.45.1-.57.28-.9.52-1.14.28-.28.66-.46 1.4-.56.75-.1 1.75-.1 3.19-.1h1c1.44 0 2.44 0 3.2.1.73.1 1.11.28 1.4.56.27.28.45.66.55 1.4.1.75.1 1.75.1 3.19v8c0 1.44 0 2.44-.1 3.2-.1.73-.28 1.11-.56 1.4-.28.27-.66.45-1.4.55-.75.1-1.75.1-3.19.1h-1c-1.44 0-2.44 0-3.2-.1-.73-.1-1.11-.28-1.4-.56a2 2 0 0 1-.5-1.14c-.11-.59-.14-1.36-.15-2.45a.75.75 0 1 0-1.5 0q-.02 1.63.17 2.72c.14.76.4 1.4.93 1.93.6.6 1.36.86 2.26.98.87.12 1.97.12 3.34.12h1.1c1.37 0 2.47 0 3.34-.12.9-.12 1.66-.38 2.26-.98s.86-1.36.98-2.26c.12-.87.12-1.97.12-3.34v-8.1c0-1.37 0-2.47-.12-3.34a3.7 3.7 0 0 0-.98-2.26c-.6-.6-1.36-.86-2.26-.98-.87-.12-1.97-.12-3.33-.12z"/><path d="M15 11.25a.75.75 0 0 1 0 1.5H4.03l1.96 1.68A.75.75 0 1 1 5 15.57l-3.5-3a.75.75 0 0 1 0-1.14l3.5-3A.75.75 0 1 1 6 9.57l-1.96 1.68z"/></g>            </svg>
          </button>
        </div>
      </header>

      <main className="main">
        {idx >= loads.length ? (
          <div className="status-screen empty">
            <span className="empty-icon">📦</span>
            <p>No more loads</p>
            <span className="empty-sub">Check back later</span>
          </div>
        ) : (
          <div className="swipe-stack">
            {idx + 1 < loads.length}
            <LoadCard load={loads[idx]} onAccept={next} onSkip={next} />
          </div>
        )}
      </main>
    </div>
  );
}