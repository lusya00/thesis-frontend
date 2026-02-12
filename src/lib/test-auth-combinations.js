// Script to test multiple login combinations to find what works
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Array of login combinations to try
const loginCombinations = [
  { email: 'admin@example.com', password: 'admin' },
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'admin@untungjawa.com', password: 'admin123' },
  { email: 'admin@untungjawa.com', password: 'password' },
  { email: 'admin@untungjawa.com', password: 'admin' },
  { email: 'test@example.com', password: 'password' },
  { email: 'budi@example.com', password: 'password' },
  { email: 'user@untungjawa.com', password: 'user123' }
];

// Function to try a login combination
const tryLogin = async (credentials) => {
  try {
    console.log(`Trying login with: ${credentials.email} / ${credentials.password}`);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    console.log('✅ SUCCESS! Login worked with:', credentials);
    console.log('Response:', response.data);
    return { success: true, credentials, response: response.data };
  } catch (error) {
    console.log(`❌ Failed with: ${credentials.email} / ${credentials.password}`);
    if (error.response) {
      console.log(`  Status: ${error.response.status}, Message: ${error.response.data.message}`);
    } else {
      console.log(`  Error: ${error.message}`);
    }
    return { success: false, credentials, error };
  }
};

// Test to see if we can get a list of users (unlikely, but worth a try)
const tryGetUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    console.log('✅ Users list accessible!');
    console.log('Users:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Users list not accessible (expected)');
    return null;
  }
};

// Test a simple user registration
const tryRegister = async () => {
  const userData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`, // Use timestamp to make email unique
    password: 'password123',
    phone_number: '+1234567890',
    type: 'user'
  };

  try {
    console.log('Trying to register user:', userData);
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    return { success: true, userData, response: response.data };
  } catch (error) {
    console.log('❌ Registration failed');
    if (error.response) {
      console.log(`  Status: ${error.response.status}, Message:`, error.response.data);
    } else {
      console.log(`  Error: ${error.message}`);
    }
    return { success: false, userData, error };
  }
};

// Run all the tests
const runTests = async () => {
  console.log('TESTING AUTHENTICATION OPTIONS\n');
  
  console.log('1. Checking if users list is accessible:');
  await tryGetUsers();
  console.log('\n');
  
  console.log('2. Trying registration:');
  const registrationResult = await tryRegister();
  console.log('\n');
  
  console.log('3. Trying login combinations:');
  
  // If registration was successful, add those credentials to our test list
  if (registrationResult.success) {
    loginCombinations.push({
      email: registrationResult.userData.email,
      password: registrationResult.userData.password
    });
  }
  
  // Try all login combinations
  for (const credentials of loginCombinations) {
    await tryLogin(credentials);
    console.log('------------------------------');
  }
};

// Run all the tests
runTests().then(() => {
  console.log('\nAuth testing completed.');
});

export { tryLogin, tryGetUsers, tryRegister, runTests }; 