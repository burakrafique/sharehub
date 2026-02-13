// ============================================
// ShareHub Backend - Authentication Test Script
// Tests all authentication endpoints
// ============================================

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
  email: 'testuser@example.com',
  username: 'testuser123',
  password: 'password123',
  full_name: 'Test User',
  phone_number: '+1234567890',
  address: 'Test Address, Test City'
};

let authToken = '';

// Helper function to make API requests
const apiRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...(data && { data })
    };

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: error.message }
    };
  }
};

// Test functions
const testRegister = async () => {
  console.log('\n🧪 Testing User Registration...');
  const result = await apiRequest('POST', '/register', testUser);
  
  if (result.success) {
    console.log('✅ Registration successful');
    console.log(`   User ID: ${result.data.user.id}`);
    console.log(`   Username: ${result.data.user.username}`);
    console.log(`   Email: ${result.data.user.email}`);
    console.log(`   Role: ${result.data.user.role}`);
    authToken = result.data.token;
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Registration failed');
    console.log(`   Error: ${result.error.message}`);
  }
  
  return result.success;
};

const testLogin = async () => {
  console.log('\n🧪 Testing User Login...');
  const result = await apiRequest('POST', '/login', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (result.success) {
    console.log('✅ Login successful');
    console.log(`   User ID: ${result.data.user.id}`);
    console.log(`   Username: ${result.data.user.username}`);
    console.log(`   Email: ${result.data.user.email}`);
    authToken = result.data.token;
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Login failed');
    console.log(`   Error: ${result.error.message}`);
  }
  
  return result.success;
};

const testGetCurrentUser = async () => {
  console.log('\n🧪 Testing Get Current User...');
  const result = await apiRequest('GET', '/me', null, authToken);
  
  if (result.success) {
    console.log('✅ Get current user successful');
    console.log(`   User ID: ${result.data.user.id}`);
    console.log(`   Username: ${result.data.user.username}`);
    console.log(`   Full Name: ${result.data.user.full_name}`);
    console.log(`   Stats: ${JSON.stringify(result.data.user.stats)}`);
  } else {
    console.log('❌ Get current user failed');
    console.log(`   Error: ${result.error.message}`);
  }
  
  return result.success;
};

const testUpdateProfile = async () => {
  console.log('\n🧪 Testing Update Profile...');
  const updateData = {
    full_name: 'Updated Test User',
    phone_number: '+9876543210',
    address: 'Updated Address, Updated City'
  };
  
  const result = await apiRequest('PUT', '/profile', updateData, authToken);
  
  if (result.success) {
    console.log('✅ Profile update successful');
    console.log(`   Updated Full Name: ${result.data.user.full_name}`);
    console.log(`   Updated Phone: ${result.data.user.phone_number}`);
    console.log(`   Updated Address: ${result.data.user.address}`);
  } else {
    console.log('❌ Profile update failed');
    console.log(`   Error: ${result.error.message}`);
  }
  
  return result.success;
};

const testChangePassword = async () => {
  console.log('\n🧪 Testing Change Password...');
  const passwordData = {
    currentPassword: testUser.password,
    newPassword: 'newpassword123',
    confirmPassword: 'newpassword123'
  };
  
  const result = await apiRequest('POST', '/change-password', passwordData, authToken);
  
  if (result.success) {
    console.log('✅ Password change successful');
    console.log(`   Message: ${result.data.message}`);
  } else {
    console.log('❌ Password change failed');
    console.log(`   Error: ${result.error.message}`);
  }
  
  return result.success;
};

const testInvalidLogin = async () => {
  console.log('\n🧪 Testing Invalid Login...');
  const result = await apiRequest('POST', '/login', {
    email: testUser.email,
    password: 'wrongpassword'
  });
  
  if (!result.success) {
    console.log('✅ Invalid login correctly rejected');
    console.log(`   Error: ${result.error.message}`);
  } else {
    console.log('❌ Invalid login was accepted (this should not happen)');
  }
  
  return !result.success; // Success means the invalid login was rejected
};

const testUnauthorizedAccess = async () => {
  console.log('\n🧪 Testing Unauthorized Access...');
  const result = await apiRequest('GET', '/me', null, 'invalid-token');
  
  if (!result.success) {
    console.log('✅ Unauthorized access correctly rejected');
    console.log(`   Error: ${result.error.message}`);
  } else {
    console.log('❌ Unauthorized access was allowed (this should not happen)');
  }
  
  return !result.success; // Success means unauthorized access was rejected
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting ShareHub Authentication Tests');
  console.log('==========================================');
  
  const tests = [
    { name: 'User Registration', fn: testRegister },
    { name: 'User Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Update Profile', fn: testUpdateProfile },
    { name: 'Change Password', fn: testChangePassword },
    { name: 'Invalid Login', fn: testInvalidLogin },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test "${test.name}" threw an error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n==========================================');
  console.log('🏁 Test Results Summary');
  console.log('==========================================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please check the output above.');
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health');
    if (response.data.success) {
      console.log('✅ Server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    console.log('   Run: npm start or node server.js');
    return false;
  }
};

// Start tests
const main = async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
};

main();