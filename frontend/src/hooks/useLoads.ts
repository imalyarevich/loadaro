import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PROJECT_ID } from '../lib/firebase';

export interface Load {
  id: string;
  orderId: number;
  pickUp: { city: string; state: string; zip: string; datetime: string };
  delivery: { city: string; state: string; zip: string; datetime: string };
  route: { stops: number; distanceMiles: number };
  broker: { name: string; company: string; phone: string; email: string };
  load: { vehicleRequired: string; weightLbs: number; pieces: number; hazmat: boolean; dockLevel: boolean };
  notes: string | null;
}

export function useLoads(user: User | null) {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !PROJECT_ID) {
      setLoading(false);
      return;
    }

    user.getIdToken().then((token) => {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/loads`;

      fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const loadsData = (data.documents || []).map((doc: any) => {
            const fields = doc.fields;
            const get = (path: string) => {
              const parts = path.split('.');
              let current = fields;
              for (const part of parts) {
                if (current === null || current === undefined) return null;
                if (current.mapValue && current.mapValue.fields) {
                  current = current.mapValue.fields[part];
                } else {
                  current = current[part];
                }
              }
              if (current === null || current === undefined) return null;
              return current.stringValue ?? current.integerValue ?? current.doubleValue ?? current.booleanValue ?? null;
            };
            return {
              id: doc.name.split('/').pop()!,
              orderId: get('order_id') || 0,
              pickUp: { city: get('pick_up.city') || '', state: get('pick_up.state') || '', zip: get('pick_up.zip') || '', datetime: get('pick_up.datetime') || '' },
              delivery: { city: get('delivery.city') || '', state: get('delivery.state') || '', zip: get('delivery.zip') || '', datetime: get('delivery.datetime') || '' },
              route: { stops: get('route.stops') || 0, distanceMiles: get('route.distance_miles') || 0 },
              broker: { name: get('broker.name') || '', company: get('broker.company') || '', phone: get('broker.phone') || '', email: get('broker.email') || '' },
              load: { vehicleRequired: get('load.vehicle_required') || '', weightLbs: get('load.weight_lbs') || 0, pieces: get('load.pieces') || 0, hazmat: get('load.hazmat') || false, dockLevel: get('load.dock_level') || false },
              notes: get('notes'),
            } as Load;
          });
          setLoads(loadsData);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    });
  }, [user]);

  return { loads, loading, error };
}