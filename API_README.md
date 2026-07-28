# Controls API Server

This is a Node.js Express server that provides an API for managing controls (sensors, switches, locks, etc.).

## Installation

```bash
npm install
```

## Running the Server

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5001`

## Testing

To run the automated test suite:

1. Start the server in one terminal:
   ```bash
   npm start
   ```

2. In another terminal, run the tests:
   ```bash
   npm test
   ```

The test suite will verify:
- API key authentication (valid, missing, invalid)
- GET /controls endpoint
- GET /controls/:id endpoint
- POST /controls/:id/action endpoint
- Health check endpoint

## API Documentation

### Authentication

All endpoints (except `/health`) require API key authentication using the `X-Api-Key` header.

**API Key:** `shark`

### Endpoints

#### 1. Get All Controls

Get a list of all available controls.

**Request:**
```bash
curl -X GET "http://localhost:5001/controls" -H "X-Api-Key: shark"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Temperature Sensor",
      "type": "sensor",
      "status": "active",
      "value": 22.5,
      "unit": "°C"
    },
    ...
  ]
}
```

#### 2. Get Specific Control

Get details of a specific control by ID.

**Request:**
```bash
curl -X GET "http://localhost:5001/controls/1" -H "X-Api-Key: shark"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Temperature Sensor",
    "type": "sensor",
    "status": "active",
    "value": 22.5,
    "unit": "°C"
  }
}
```

#### 3. Perform Action on Control

Execute an action on a specific control.

**Request:**
```bash
curl -X POST "http://localhost:5001/controls/2/action" \
  -H "X-Api-Key: shark" \
  -H "Content-Type: application/json" \
  -d '{"action": "toggle", "value": "off"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Action 'toggle' executed on control 'Light Switch'",
  "data": {
    "id": 2,
    "name": "Light Switch",
    "type": "switch",
    "status": "active",
    "value": "off",
    "unit": null
  }
}
```

#### 4. Health Check

Check if the server is running (no authentication required).

**Request:**
```bash
curl -X GET "http://localhost:5001/health"
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T13:58:16.914Z"
}
```

## Error Responses

### 401 Unauthorized
Missing API key:
```json
{
  "error": "API key is missing"
}
```

### 403 Forbidden
Invalid API key:
```json
{
  "error": "Invalid API key"
}
```

### 404 Not Found
Control not found:
```json
{
  "success": false,
  "error": "Control not found"
}
```

### 400 Bad Request
Missing required parameters:
```json
{
  "success": false,
  "error": "Action is required"
}
```

## Available Controls

The server provides the following sample controls:

1. **Temperature Sensor** (sensor) - Monitors temperature in °C
2. **Light Switch** (switch) - Controls lights (on/off)
3. **Door Lock** (lock) - Controls door lock (locked/unlocked)
4. **Humidity Sensor** (sensor) - Monitors humidity in %
5. **Fan Controller** (controller) - Controls fan speed in RPM

## Notes

- The API key is currently hardcoded as `shark`
- Controls data is stored in memory and will reset when the server restarts
- For production use, consider using environment variables for the API key and a database for persistent storage
