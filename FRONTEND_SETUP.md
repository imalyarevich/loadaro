# Firebase Configuration Guide

## Option 1: Environment Variables (.env) - RECOMMENDED

**Why use .env files?**
- Separate code from configuration
- Easy to add/remove secrets
- Docker-friendly
- Git-safe (add to .gitignore)

**File: frontend/.env**
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=loadaro-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=loadaro-app
VITE_FIREBASE_STORAGE_BUCKET=loadaro-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Ignore in git:**
```
# frontend/.gitignore
.env
.env.local
.env.*.local
```

## Option 2: Config File (JSON)

**File: frontend/firebase-config.json**
```json
{
  "apiKey": "your_api_key_here",
  "authDomain": "loadaro-app.firebaseapp.com",
  "projectId": "loadaro-app",
  igin": "loadaro-app.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc123def456"
}
```

**Load in App:**
```tsx
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Load config from file (you'd need to add file reading logic)
import('./firebase-config.json').then(config => {
  const app = initializeApp(config);
  export const db = getFirestore(app);
});
```

## Option 3: Vite Config (define)

**File: frontend/vite.config.ts**
```ts
import { defineConfig } from 'vite';

const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "loadaro-app.firebaseapp.com",
  projectId: "loadaro-app",
  storageBucket: "loadaro-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};

export default defineConfig({
  define: {
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(firebaseConfig.apiKey),
    // ... other env vars
  }
});
```

## Backend Firebase Config

For the functions, you need to set up the Firebase Admin SDK:

```bash
# In functions/index.ts
const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}
```

The Firebase Admin SDK uses service account credentials, not the web API key.

## Best Practice Recommendation

**Use .env files for the frontend** because:
- Vite is built around the .env pattern
- Better for different environments (dev, staging, prod)
- Easy to share credentials
- Standard approach

Only use JSON config file if you have a specific requirement for a single config file setup.

**Key distinction:**
- **Firebase Config** = Project settings from Firebase Console
- **Environment Variables** = Configuration for your app deployment