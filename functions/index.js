require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const ingestEmail = functions.https.onRequest(async (req, res) => {
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
      order_id: data.order_id,
      pick_up: {
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
        distance_miles: data.route?.distance_miles ?? 0,
      },
      broker: {
        name: data.broker.name,
        company: data.broker.company,
        phone: data.broker.phone,
        email: data.broker.email,
      },
      load: {
        type: data.load?.type ?? '',
        vehicle_required: data.load?.vehicle_required ?? '',
        dock_level: data.load?.dock_level ?? false,
        hazmat: data.load?.hazmat ?? false,
        pieces: data.load?.pieces ?? 0,
        weight_lbs: data.load?.weight_lbs ?? 0,
        stackable: data.load?.stackable ?? false,
      },
      notes: data.notes ?? null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('loads').add(loadData);

    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const contactBroker = functions.https.onRequest(async (req, res) => {
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

const telegramAuth = functions.https.onRequest(async (req, res) => {
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
    const { initData } = req.body;

    if (!initData) {
      res.status(400).json({ error: 'Missing initData' });
      return;
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      res.status(500).json({ error: 'Bot token not configured' });
      return;
    }

    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    const dataCheckString = initData
      .split('&')
      .filter((pair) => !pair.startsWith('hash='))
      .sort()
      .join('\n');

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const params = Object.fromEntries(new URLSearchParams(initData));
    const hash = params.hash;

    if (hmac !== hash) {
      res.status(403).json({ error: 'Invalid initData' });
      return;
    }

    const user = JSON.parse(params.user || '{}');

    if (!user.id) {
      res.status(400).json({ error: 'Missing user data' });
      return;
    }

    const firebaseToken = await admin.auth().createCustomToken(String(user.id), {
      telegramId: user.id,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      username: user.username || '',
    });

    res.status(200).json({ token: firebaseToken, user });
  } catch (error) {
    console.error('Telegram auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { ingestEmail, contactBroker, telegramAuth };
