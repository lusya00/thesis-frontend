// Script to test the landing page user authentication
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Variables to store auth data
let authToken = null;
let userData = null;

// Test login with user credentials
const testLogin = async () => {
  try {
    console.log('Testing login with user credentials...');
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email: 'user@example.com',
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
  // Generate a unique email
  const timestamp = Date.now();
  const userData = {
    name: 'John',
    last_name: 'Doe',
    email: `test${timestamp}@example.com`,
    password: 'password123',
    phone_number: '+1234567890',
    type: 'user'
  };

  try {
    console.log('Testing registration with correct fields...');
    console.log('Registration data:', userData);
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
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

// Test getting user profile
const testGetProfile = async () => {
  if (!authToken) {
    console.error('❌ No auth token available. Run login or registration test first.');
    return null;
  }

  try {
    console.log('Testing get user profile...');
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Get profile successful!');
    console.log('User profile:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get profile failed!');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

// Test authenticated request to homestays API
const testGetHomestays = async () => {
  try {
    console.log('Testing get homestays without auth...');
    const response = await axios.get(`${API_BASE_URL}/homestays`);
    console.log('✅ Get homestays successful!');
    console.log('Homestays count:', response.data.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Get homestays failed!');
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
  console.log('== TESTING LANDING PAGE USER AUTHENTICATION ==\n');
  
  // 1. Test login
  console.log('1. Testing login...');
  await testLogin();
  console.log('\n');
  
  // 2. Try registration if login failed
  if (!authToken) {
    console.log('2. Testing registration...');
    await testRegistration();
    console.log('\n');
  }
  
  // 3. Test get profile if we have a token
  if (authToken) {
    console.log('3. Testing get profile...');
    await testGetProfile();
    console.log('\n');
  }
  
  // 4. Test get homestays
  console.log('4. Testing get homestays...');
  await testGetHomestays();
  console.log('\n');
};

// Run all tests
runTests().then(() => {
  console.log('Landing page user authentication testing completed');
});

export { testLogin, testRegistration, testGetProfile, testGetHomestays, runTests }; 