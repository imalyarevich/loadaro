import { Load } from '../types/load';
import { useState } from 'react';

interface LoadCardProps {
  load: Load;
  onAccept: (load: Load, name: string, phone: string) => Promise<{ success: boolean }>;
  onSkip: () => void;
}

export function LoadCard({ load, onAccept, onSkip }: LoadCardProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const handleAccept = async () => {
    if (!name.trim()) return;
    setSending(true);
    await onAccept(load, name, phone);
    setSending(false);
  };

  return (
    <div className="swipe-container">
      <div className="swipe-card">
        <div className="card-header">
          <span className="card-order">#{load.orderId}</span>
          <span className="card-type">{load.load.vehicleRequired}</span>
        </div>

        <div className="card-route">
          <div className="route-point pickup">
            <div className="route-dot pickup-dot" />
            <div className="route-info">
              <span className="route-label">Pickup</span>
              <span className="route-city">{load.pickUp.city}, {load.pickUp.state} {load.pickUp.zip}</span>
              <span className="route-date">{load.pickUp.datetime}</span>
            </div>
          </div>
          <div className="route-line">→</div>
          <div className="route-point delivery">
            <div className="route-dot delivery-dot" />
            <div className="route-info">
              <span className="route-label">Delivery</span>
              <span className="route-city">{load.delivery.city}, {load.delivery.state} {load.delivery.zip}</span>
              <span className="route-date">{load.delivery.datetime}</span>
            </div>
          </div>
        </div>

        <div className="card-stats">
          <div className="stat">
            <span className="stat-value">{load.route.distanceMiles}</span>
            <span className="stat-label">miles</span>
          </div>
          <div className="stat">
            <span className="stat-value">{load.route.stops}</span>
            <span className="stat-label">stops</span>
          </div>
          <div className="stat">
            <span className="stat-value">{load.load.weightLbs}</span>
            <span className="stat-label">lbs</span>
          </div>
          <div className="stat">
            <span className="stat-value">{load.load.pieces}</span>
            <span className="stat-label">pcs</span>
          </div>
        </div>

        <div className="card-broker">
          <span className="broker-name">{load.broker.company}</span>
          <span className="broker-contact">{load.broker.name} · {load.broker.phone}</span>
        </div>

        {load.load.hazmat && <div className="card-badge hazmat">HAZMAT</div>}
        {load.load.dockLevel && <div className="card-badge dock">DOCK</div>}

        <div className="driver-form">
          <input
            type="text"
            placeholder="Your name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="driver-input"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="driver-input"
          />
        </div>

        <div className="swipe-actions">
        <button className="action-btn skip-btn" onClick={onSkip}>
          <span className="action-icon">✕</span>
        </button>
        <button
          className="action-btn accept-btn"
          onClick={handleAccept}
          disabled={!name.trim() || sending}
        >
          <span className="action-icon">{sending ? '...' : '♥'}</span>
        </button>
      </div>
      </div>


    </div>
  );
}