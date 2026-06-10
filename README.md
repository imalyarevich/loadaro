# Telegram Load Board Mini App

A simple MVP for managing and viewing loads in a Telegram Mini App.

## Features

- Ingest load data via JSON webhook (from Cloudflare Email Routing)
- Store loads in Firebase Firestore
- View loads in a clean Telegram Mini App interface
- Filter loads by pickup/delivery states
- Simple Telegram authentication

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Firebase Functions (Node.js)
- Database: Firebase Firestore
- Hosting: GitHub Pages

## Project Structure

```
/loadaro
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Library code
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx      # App entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── functions/            # Firebase Functions
│   ├── index.ts         # Main backend code
│   └── package.json
└── ...other configs
```

## Setup

### 1. Initialize Firebase

Create `firebase.json` (or use Firebase CLI):

```bash
firebase init
```

Select:
- Functions
- Firestore

### 2. Deploy Backend

```bash
cd functions
npm install
firebase deploy --only functions
```

### 3. Build and Deploy Frontend

```bash
cd frontend
npm install
npm run build
```

Deploy to GitHub Pages:
```bash
npm install -g gh-pages
gh-pages -d dist
```

### 4. Configure Environment Variables

Set up these environment variables in Firebase Console for functions:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Local Development

### Backend (Firebase Emulators)

```bash
cd functions
npm run serve
```

### Frontend

```bash
cd frontend
npm run dev
```

## API Endpoints

### POST /ingest-email

Ingest a new load from email routing:

**Request Body:**
```json
{
  "pickup": "City, State",
  "delivery": "City, State",
  "broker": "Name",
  "phone": "Number"
}
```

**Response:**
```json
{
  "success": true,
  "id": "load-id",
  "data": {
    "id": "load-id",
    "pickupCity": "City",
    "pickupState": "State",
    "deliveryCity": "City",
    "deliveryState": "State",
    "brokerName": "Name",
    "brokerPhone": "Number",
    "createdAt": "timestamp"
  }
}
```

## Development Notes

- Telegram authentication uses `Telegram.WebApp.initData` for basic user validation
- No complex authentication or validation in MVP
- Simple state filtering by pickup/delivery state
- Clean, readable code following best practices
- No Redux, microservices, or complex architecture
- Clean separation between frontend and backend

## Todo

- [x] Setup project structure
- [x] Create frontend with React + TypeScript
- [x] Create backend with Firebase Functions
- [x] Implement Firestore integration
- [x] Build LoadCard, LoadList, Filter, Header components
- [x] Add Telegram WebApp SDK integration
- [x] Create simple loading, error, and empty states
- [ ] Test API endpoint
- [ ] Deploy to production
- [ ] Add tests