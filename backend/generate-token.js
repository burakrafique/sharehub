// Generate JWT Token for Testing
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// User ID jiske liye token chahiye (database mein existing user ka ID)
const userId = 1; // Change this to your user ID

// Generate token
const token = jwt.sign(
  { id: userId },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE || '7d' }
);

console.log('\n='.repeat(50));
console.log('🔑 Generated JWT Token for User ID:', userId);
console.log('='.repeat(50));
console.log('\nToken:');
console.log(token);
console.log('\n' + '='.repeat(50));
console.log('\n📋 Copy this token and use in Postman:');
console.log(`Authorization: Bearer ${token}`);
console.log('\n' + '='.repeat(50) + '\n');
