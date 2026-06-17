# pms

Built with Boxie - MERN Multi-Tenant Framework

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

## Development

Start both backend and frontend:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:backend  # Terminal 1
npm run dev:frontend # Terminal 2
```

- Backend: http://localhost:5001
- Frontend: http://localhost:3000

## Building

Build both backend and frontend:
```bash
npm run build
```

## Deployment

This app is completely independent and can be deployed:
- Backend: Any Node.js hosting
- Frontend: Any static hosting (Vercel, Netlify, S3, etc.)

## Project Structure

```
pms/
├── backend/          # Express server
├── frontend/         # React application
└── package.json      # Workspace configuration
```
