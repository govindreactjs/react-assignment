<<<<<<< HEAD
# Flight Explorer Web App

React.js interview assignment implementing:

- React + JavaScript
- Material UI (MUI) for the complete UI
- Redux Toolkit
- React Router
- Axios
- LocalStorage persistence
- Web Crypto API password hashing
- AviationStack flight search
- One-way, round-trip and multi-city search
- Advanced filters
- User/Admin role-based navigation
- 5-minute inactivity logout
- Booking + fake payment workflow
- Admin flight CRUD and booking management
- Responsive desktop/tablet/mobile UI

## Run locally

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` and add:

```env
VITE_AVIATIONSTACK_KEY=your_aviationstack_access_key
```

## Assignment seed data

The app seeds this flight on first load:

- Route: Pune (PNQ) -> Mumbai (BOM)
- Total seats: 50
- Booked seats: 12
- Available seats: 38

Flights and bookings are persisted in LocalStorage.

## Authentication note

The assignment asks for passwords to be protected before local persistence. This implementation uses the browser Web Crypto API with PBKDF2 + random salt to hash passwords before storing the credential record.

For a real production system, password hashing must happen on the backend and the frontend should never store raw passwords.

## Demo payment

The payment screen simulates success/failure. Use a passenger phone number ending in `0000` to force a payment failure; any other valid phone number simulates success.

## Deployment

The project is Vite-based and can be deployed to Netlify, Vercel, or GitHub Pages after installing dependencies and running:

```bash
npm run build
```

Then publish the generated `dist` directory according to the selected hosting provider.
=======
# react-assignment
Flight-explorer-app
>>>>>>> 4e59288ed909437ba5eb36f4526b85a9cec11955
