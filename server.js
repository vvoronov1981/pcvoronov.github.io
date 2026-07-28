const express = require('express');
const app = express();
const PORT = 5001;

// API Key for authentication
const API_KEY = 'shark';

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for browser clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Middleware for API key authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-Api-Key');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }
  
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Sample controls data
const controls = [
  {
    id: 1,
    name: 'Temperature Sensor',
    type: 'sensor',
    status: 'active',
    value: 22.5,
    unit: '°C'
  },
  {
    id: 2,
    name: 'Light Switch',
    type: 'switch',
    status: 'active',
    value: 'on',
    unit: null
  },
  {
    id: 3,
    name: 'Door Lock',
    type: 'lock',
    status: 'active',
    value: 'locked',
    unit: null
  },
  {
    id: 4,
    name: 'Humidity Sensor',
    type: 'sensor',
    status: 'active',
    value: 65,
    unit: '%'
  },
  {
    id: 5,
    name: 'Fan Controller',
    type: 'controller',
    status: 'inactive',
    value: 0,
    unit: 'rpm'
  }
];

// GET /controls endpoint
app.get('/controls', authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    count: controls.length,
    data: controls
  });
});

// GET /controls/:id endpoint - get specific control
app.get('/controls/:id', authenticateApiKey, (req, res) => {
  const id = parseInt(req.params.id);
  const control = controls.find(c => c.id === id);
  
  if (!control) {
    return res.status(404).json({
      success: false,
      error: 'Control not found'
    });
  }
  
  res.json({
    success: true,
    data: control
  });
});

// POST /controls/:id/action - perform action on control
app.post('/controls/:id/action', authenticateApiKey, (req, res) => {
  const id = parseInt(req.params.id);
  const control = controls.find(c => c.id === id);
  
  if (!control) {
    return res.status(404).json({
      success: false,
      error: 'Control not found'
    });
  }
  
  const { action, value } = req.body;
  
  if (!action) {
    return res.status(400).json({
      success: false,
      error: 'Action is required'
    });
  }
  
  // Update control value
  if (value !== undefined) {
    control.value = value;
  }
  
  res.json({
    success: true,
    message: `Action '${action}' executed on control '${control.name}'`,
    data: control
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Use API key: ${API_KEY}`);
  console.log(`Test with: curl -X GET "http://localhost:${PORT}/controls" -H "X-Api-Key: ${API_KEY}"`);
});
