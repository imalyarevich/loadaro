const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const ingestEmail = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const data = req.body;

    if (!data.order_id || !data.pick_up || !data.delivery || !data.broker) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const loadData = {
      orderId: data.order_id,
      pickUp: {
        city: data.pick_up.city,
        state: data.pick_up.state,
        zip: data.pick_up.zip,
        datetime: data.pick_up.datetime,
      },
      delivery: {
        city: data.delivery.city,
        state: data.delivery.state,
        zip: data.delivery.zip,
        datetime: data.delivery.datetime,
      },
      route: {
        stops: data.route?.stops ?? 1,
        distanceMiles: data.route?.distance_miles ?? 0,
      },
      broker: {
        name: data.broker.name,
        company: data.broker.company,
        phone: data.broker.phone,
        email: data.broker.email,
      },
      postInfo: {
        postedAt: data.post_info?.posted_at ?? '',
        expiresAt: data.post_info?.expires_at ?? '',
        postedAmountUsd: data.post_info?.posted_amount_usd ?? 0,
      },
      load: {
        type: data.load?.type ?? '',
        vehicleRequired: data.load?.vehicle_required ?? '',
        dockLevel: data.load?.dock_level ?? false,
        hazmat: data.load?.hazmat ?? false,
        pieces: data.load?.pieces ?? 0,
        weightLbs: data.load?.weight_lbs ?? 0,
        dimensions: {
          length: data.load?.dimensions?.length ?? 0,
          width: data.load?.dimensions?.width ?? 0,
          height: data.load?.dimensions?.height ?? 0,
          unit: data.load?.dimensions?.unit ?? 'in',
        },
        stackable: data.load?.stackable ?? false,
        csaFastLoad: data.load?.csa_fast_load ?? false,
      },
      notes: data.notes ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('loads').add(loadData);

    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const contactBroker = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { load, driverName, driverPhone } = req.body;

    if (!load || !driverName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const subject = `Offers - Load #${load.orderId} ${load.pickUp.city}, ${load.pickUp.state} → ${load.delivery.city}, ${load.delivery.state}`;

    const body = [
      `Driver: ${driverName}`,
      driverPhone ? `Phone: ${driverPhone}` : '',
      '',
      `Load #${load.orderId}`,
      `Pickup: ${load.pickUp.city}, ${load.pickUp.state} ${load.pickUp.zip}`,
      `Delivery: ${load.delivery.city}, ${load.delivery.state} ${load.delivery.zip}`,
      `Distance: ${load.route.distanceMiles} miles`,
      `Vehicle: ${load.load.vehicleRequired}`,
      `Weight: ${load.load.weightLbs} lbs | Pieces: ${load.load.pieces}`,
    ].filter(Boolean).join('\n');

    console.log('--- EMAIL TO BROKER ---');
    console.log(`To: ${load.broker.email}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log('----------------------');

    await db.collection('sent_emails').add({
      to: load.broker.email,
      subject,
      body,
      loadId: load.id,
      orderId: load.orderId,
      driverName,
      driverPhone: driverPhone || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});