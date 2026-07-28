/**
 * Simple API test script
 * Run this after starting the server with: node server.js
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('Starting API tests...\n');
  
  let passed = 0;
  let failed = 0;

  // Test 1: GET /controls with valid API key
  try {
    console.log('Test 1: GET /controls with valid API key');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/controls',
      method: 'GET',
      headers: {
        'X-Api-Key': 'shark'
      }
    });
    
    if (response.statusCode === 200 && response.body.success && response.body.data.length === 5) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected 200 and 5 controls\n');
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 2: GET /controls without API key (should fail)
  try {
    console.log('Test 2: GET /controls without API key (should fail)');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/controls',
      method: 'GET'
    });
    
    if (response.statusCode === 401 && response.body.error === 'API key is missing') {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected 401 and error message\n');
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 3: GET /controls with invalid API key (should fail)
  try {
    console.log('Test 3: GET /controls with invalid API key (should fail)');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/controls',
      method: 'GET',
      headers: {
        'X-Api-Key': 'wrong-key'
      }
    });
    
    if (response.statusCode === 403 && response.body.error === 'Invalid API key') {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected 403 and error message\n');
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 4: GET /controls/1 (specific control)
  try {
    console.log('Test 4: GET /controls/1 (specific control)');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/controls/1',
      method: 'GET',
      headers: {
        'X-Api-Key': 'shark'
      }
    });
    
    if (response.statusCode === 200 && response.body.success && response.body.data.id === 1) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected 200 and control with id 1\n');
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 5: POST /controls/2/action
  try {
    console.log('Test 5: POST /controls/2/action');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/controls/2/action',
      method: 'POST',
      headers: {
        'X-Api-Key': 'shark',
        'Content-Type': 'application/json'
      }
    }, {
      action: 'toggle',
      value: 'off'
    });
    
    if (response.statusCode === 200 && response.body.success && response.body.data.value === 'off') {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected 200 and value "off"\n');
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 6: GET /health (no auth required)
  try {
    console.log('Test 6: GET /health (no auth required)');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/health',
      method: 'GET'
    });
    
    if (response.statusCode === 200 && response.body.status === 'ok') {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected 200 and status "ok"\n');
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Summary
  console.log('=====================================');
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log('=====================================');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
http.get('http://localhost:5001/health', (res) => {
  if (res.statusCode === 200) {
    runTests();
  }
}).on('error', (err) => {
  console.error('Error: Server is not running on port 5001');
  console.error('Please start the server first with: node server.js');
  process.exit(1);
});
