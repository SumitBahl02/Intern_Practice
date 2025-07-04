#!/usr/bin/env node

/**
 * API Testing Script
 * This script tests all the API endpoints to ensure they're working correctly
 */

const baseUrl = 'http://localhost:3000';
let authToken = '';

/**
 * Helper function to make HTTP requests
 * @param {string} url - The endpoint URL
 * @param {object} options - Request options
 * @returns {Promise<{response: Response, data: any}>}
 */
async function makeRequest(url, options = {}) {
  const fullUrl = `${baseUrl}${url}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    },
  };
  
  const response = await fetch(fullUrl, { ...defaultOptions, ...options });
  const data = await response.json();
  
  console.log(`${options.method || 'GET'} ${fullUrl}`);
  console.log(`Status: ${response.status}`);
  console.log(`Response:`, JSON.stringify(data, null, 2));
  console.log('---');
  
  return { response, data };
}

/**
 * Test suite for API endpoints
 */
async function testAPI() {
  console.log('Starting API Tests...\n');

  try {
    // Test 1: Register a new user
    console.log('Test 1: Register new user');
    const registerResponse = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`, // Use timestamp to avoid conflicts
        password: 'test123',
        name: 'Test User'
      }),
    });

    if (registerResponse.response.status === 201) {
      console.log('SUCCESS: Registration successful');
      authToken = registerResponse.data.data.accessToken;
    } else {
      console.log('FAILED: Registration failed');
    }

    // Test 2: Login with existing user
    console.log('Test 2: Login with existing user');
    const loginResponse = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'user123'
      }),
    });

    if (loginResponse.response.status === 200 || loginResponse.response.status === 201) {
      console.log('SUCCESS: Login successful');
      authToken = loginResponse.data.data.accessToken;
    } else {
      console.log('FAILED: Login failed');
      // Try with a different user
      console.log('Retrying with test user...');
      const testLoginResponse = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        }),
      });
      
      if (testLoginResponse.response.status === 200 || testLoginResponse.response.status === 201) {
        console.log('SUCCESS: Test user login successful');
        authToken = testLoginResponse.data.data.accessToken;
      }
    }

    // Test 3: Get all tasks (authenticated)
    console.log('Test 3: Get all tasks');
    await makeRequest('/tasks');

    // Test 4: Create a new task
    console.log('Test 4: Create new task');
    await makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'PENDING',
        priority: 'MEDIUM'
      }),
    });

    // Test 5: Get all projects
    console.log('Test 5: Get all projects');
    await makeRequest('/projects');

    // Test 6: Create a new project
    console.log('Test 6: Create new project');
    await makeRequest('/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Project',
        description: 'This is a test project',
        status: 'PLANNING'
      }),
    });

    // Test 7: Login as admin and test admin endpoints
    console.log('Test 7: Login as admin');
    const adminLoginResponse = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      }),
    });

    if (adminLoginResponse.response.status === 200 || adminLoginResponse.response.status === 201) {
      console.log('SUCCESS: Admin login successful');
      authToken = adminLoginResponse.data.data.accessToken;

      // Test admin-only endpoint
      console.log('Test 8: Get all users (admin only)');
      await makeRequest('/users');

      console.log('Test 9: Create new user (admin only)');
      await makeRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          email: `newuser${Date.now()}@example.com`, // Use timestamp to avoid conflicts
          name: 'New User',
          password: 'newuser123',
          role: 'USER'
        }),
      });
    } else {
      console.log('FAILED: Admin login failed');
    }

    console.log('\nAPI testing completed successfully!');

  } catch (error) {
    console.error('FAILED: Test failed:', error.message);
  }
}

// Run the tests
testAPI();
