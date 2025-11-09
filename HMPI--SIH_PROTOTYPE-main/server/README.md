# HMPI Backend API

Backend server for the Heavy Metal Pollution Index monitoring application.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get single location
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Measurements
- `GET /api/measurements` - Get all measurements
- `GET /api/measurements/location/:locationId` - Get measurements for location
- `POST /api/measurements` - Create measurement
- `POST /api/measurements/import` - Import CSV file
- `GET /api/measurements/export` - Export data as CSV
- `DELETE /api/measurements/:id` - Delete measurement

### Analytics
- `GET /api/analytics/stats` - Get overall statistics
- `GET /api/analytics/leaderboard/polluted` - Most polluted locations
- `GET /api/analytics/leaderboard/clean` - Cleanest locations
- `GET /api/analytics/trends?days=30` - Pollution trends
- `GET /api/analytics/metals/distribution` - Metal distribution stats
- `GET /api/analytics/health-risk/distribution` - Health risk distribution

### Health Check
- `GET /api/health` - Server health status

## Database

SQLite database (`hmpi.db`) with two tables:
- `locations` - Monitoring locations
- `measurements` - Water quality measurements with calculated indices

## Features

- Automatic HPI, HEI, and Cd calculation
- CSV import/export
- Health risk assessment
- Analytics and trends
- CORS enabled for frontend integration
