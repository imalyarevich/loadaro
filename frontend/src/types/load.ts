export interface Load {
  id: string;
  orderId: number;
  pickUp: {
    city: string;
    state: string;
    zip: string;
    datetime: string;
  };
  delivery: {
    city: string;
    state: string;
    zip: string;
    datetime: string;
  };
  route: {
    stops: number;
    distanceMiles: number;
  };
  broker: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  postInfo: {
    postedAt: string;
    expiresAt: string;
    postedAmountUsd: number;
  };
  load: {
    type: string;
    vehicleRequired: string;
    dockLevel: boolean;
    hazmat: boolean;
    pieces: number;
    weightLbs: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    stackable: boolean;
    csaFastLoad: boolean;
  };
  notes: string | null;
  createdAt: number;
}

export interface LoadInput {
  order_id: number;
  pick_up: {
    city: string;
    state: string;
    zip: string;
    datetime: string;
  };
  delivery: {
    city: string;
    state: string;
    zip: string;
    datetime: string;
  };
  route: {
    stops: number;
    distance_miles: number;
  };
  broker: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  post_info: {
    posted_at: string;
    expires_at: string;
    posted_amount_usd: number;
  };
  load: {
    type: string;
    vehicle_required: string;
    dock_level: boolean;
    hazmat: boolean;
    pieces: number;
    weight_lbs: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    stackable: boolean;
    csa_fast_load: boolean;
  };
  notes: string | null;
}

export interface Rating {
  id: string;
  userId: string;
  loadId: string;
  rating: 'accepted' | 'skipped';
  createdAt: number;
}