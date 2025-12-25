#!/usr/bin/env node

/**
 * Example client to demonstrate Alpaca API Server usage
 * This script shows how to authenticate and make trading API calls
 */

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
const username = process.env.API_USERNAME || 'admin';
const password = process.env.API_PASSWORD || 'test123';

let authToken = null;

/**
 * Login and get JWT token
 */
async function login() {
  console.log('🔐 Authenticating...');
  
  const response = await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    authToken = data.data.token;
    console.log('✅ Authentication successful!');
    console.log(`Token expires in: ${data.data.expiresIn}\n`);
    return true;
  } else {
    console.error('❌ Authentication failed:', data.error);
    return false;
  }
}

/**
 * Make authenticated request
 */
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${baseURL}${endpoint}`, options);
  return await response.json();
}

/**
 * Get account information
 */
async function getAccount() {
  console.log('📊 Getting account information...');
  const data = await makeRequest('/api/trading/account');
  
  if (data.success) {
    console.log('Account info:', data.data);
  } else {
    console.error('Error:', data.error);
  }
  console.log();
}

/**
 * Get all positions
 */
async function getPositions() {
  console.log('📈 Getting positions...');
  const data = await makeRequest('/api/trading/positions');
  
  if (data.success) {
    console.log(`Found ${data.data.length} position(s)`);
    data.data.forEach(pos => {
      console.log(`- ${pos.symbol}: ${pos.qty} shares @ $${pos.current_price}`);
    });
  } else {
    console.error('Error:', data.error);
  }
  console.log();
}

/**
 * Get all orders
 */
async function getOrders() {
  console.log('📋 Getting orders...');
  const data = await makeRequest('/api/trading/orders?status=all&limit=10');
  
  if (data.success) {
    console.log(`Found ${data.data.length} order(s)`);
    data.data.forEach(order => {
      console.log(`- ${order.symbol}: ${order.side} ${order.qty} @ ${order.type} [${order.status}]`);
    });
  } else {
    console.error('Error:', data.error);
  }
  console.log();
}

/**
 * Create a market order (example)
 */
async function createOrder(symbol, qty, side) {
  console.log(`📝 Creating ${side} order for ${qty} ${symbol}...`);
  
  const orderData = {
    symbol,
    qty,
    side,
    type: 'market',
    time_in_force: 'day'
  };
  
  const data = await makeRequest('/api/trading/orders', 'POST', orderData);
  
  if (data.success) {
    console.log('✅ Order created successfully!');
    console.log(`Order ID: ${data.data.id}`);
    console.log(`Status: ${data.data.status}`);
  } else {
    console.error('❌ Order creation failed:', data.error);
  }
  console.log();
}

/**
 * Get quote for a symbol
 */
async function getQuote(symbol) {
  console.log(`💰 Getting quote for ${symbol}...`);
  const data = await makeRequest(`/api/trading/quotes/${symbol}`);
  
  if (data.success) {
    console.log('Quote:', data.data);
  } else {
    console.error('Error:', data.error);
  }
  console.log();
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Alpaca API Client Example\n');
  console.log(`Base URL: ${baseURL}\n`);
  
  // Login
  const authenticated = await login();
  if (!authenticated) {
    return;
  }
  
  // Verify token
  console.log('🔍 Verifying token...');
  const verifyData = await makeRequest('/api/auth/verify');
  if (verifyData.success) {
    console.log('✅ Token is valid\n');
  }
  
  // Get account info
  await getAccount();
  
  // Get positions
  await getPositions();
  
  // Get orders
  await getOrders();
  
  // Example: Create an order (commented out to avoid accidental trades)
  // await createOrder('AAPL', 1, 'buy');
  
  // Example: Get quote (commented out as it requires valid Alpaca credentials)
  // await getQuote('AAPL');
  
  console.log('✅ Example completed!');
}

// Run the example
main().catch(console.error);
