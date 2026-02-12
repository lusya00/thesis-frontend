// Script to test the updated authentication with correct credentials
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Variables to store auth data
let authToken = null;
let userData = null;

// Test login with the provided test credentials
const testLogin = async () => {
  try {
    console.log('Testing login with provided test credentials...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful!');
    console.log('Auth response format:', response.data);
    
    // Save token and user data in variables
    if (response.data.status === 'success') {
      authToken = response.data.data.token;
      userData = response.data.data.user;
      console.log('✅ Token and user data saved');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

// Test login with username instead of email
const testLoginWithUsername = async () => {
  try {
    console.log('Testing login with username...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
    console.log('✅ Login successful!');
    console.log('Auth response format:', response.data);
    
    // Save token and user data in variables
    if (response.data.status === 'success') {
      authToken = response.data.data.token;
      userData = response.data.data.user;
      console.log('✅ Token and user data saved');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

// Test registration with the correct fields
const testRegistration = async () => {
  // Generate a unique username and email
  const timestamp = Date.now();
  const userData = {
    username: `testuser${timestamp}`,
    password: 'Password123!',
    email: `test${timestamp}@example.com`,
    name: 'Test User',
    role: 'homestay_owner'
  };

  try {
    console.log('Testing registration with correct fields...');
    console.log('Registration data:', userData);
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    console.log('✅ Registration successful!');
    console.log('Registration response:', response.data);
    
    // Save token and user data if registration successful
    if (response.data.status === 'success') {
      authToken = response.data.data.token;
      userData = response.data.data.user;
      console.log('✅ Token and user data saved from registration');
    }
    
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

// Test authenticated request
const testAuthenticatedRequest = async () => {
  if (!authToken) {
    console.error('❌ No auth token available. Run login or registration test first.');
    return null;
  }

  try {
    console.log('Testing authenticated request...');
    const response = await axios.get(`${API_BASE_URL}/homestays`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Authenticated request successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Authenticated request failed!');
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
  console.log('== TESTING UPDATED AUTHENTICATION ==\n');
  
  // 1. Test login with email
  console.log('1. Testing login with email...');
  await testLogin();
  console.log('\n');
  
  // 2. Test login with username if email login failed
  if (!authToken) {
    console.log('2. Testing login with username...');
    await testLoginWithUsername();
    console.log('\n');
  }
  
  // 3. Try registration if both logins failed
  if (!authToken) {
    console.log('3. Testing registration...');
    await testRegistration();
    console.log('\n');
  }
  
  // 4. Test authenticated request if we have a token
  if (authToken) {
    console.log('4. Testing authenticated request...');
    await testAuthenticatedRequest();
    console.log('\n');
  }
};

// Run all tests
runTests().then(() => {
  console.log('Authentication testing completed');
});

export { testLogin, testLoginWithUsername, testRegistration, testAuthenticatedRequest, runTests }; 