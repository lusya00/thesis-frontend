// Simple script to test API connection
import axios from 'axios';

// Test the connection to your backend server
const testConnection = async () => {
  try {
    // Try to fetch homestays
    const response = await axios.get('http://localhost:5000/api/homestays');
    console.log('✅ Connection successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

// Test the authentication endpoint
const testAuth = async () => {
  try {
    // Log all the users on the system (for testing only)
    try {
      // This is just for testing to see what users exist
      const usersResponse = await axios.get('http://localhost:5000/api/users');
      console.log('Available users:', usersResponse.data);
    } catch (e) {
      console.log('Could not get users list (this is probably restricted)');
    }

    // Try to log in with test credentials
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password'
    });
    console.log('✅ Authentication successful!');
    console.log('Auth response format:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Authentication failed!');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

// Let's try to register a test user
const testRegistration = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      phone_number: '+1234567890',
      type: 'user'
    });
    console.log('✅ Registration successful!');
    console.log('Registration response format:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Registration failed!');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

// Run the tests
const runTests = async () => {
  console.log('Testing API connection...');
  await testConnection();
  
  console.log('\nTesting registration...');
  await testRegistration();
  
  console.log('\nTesting authentication...');
  await testAuth();
};

runTests();

export { testConnection, testAuth, testRegistration, runTests }; 