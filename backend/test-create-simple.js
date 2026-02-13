const axios = require('axios');

async function testCreateSimple() {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'ali@sharehub.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');

    // Create a simple item without images
    const itemData = {
      title: 'Test Item Simple',
      description: 'This is a simple test item without images',
      category: 'clothes',
      listing_type: 'sell',
      price: '50',
      item_condition: 'good',
      address: 'Test Location, Lahore',
      latitude: '31.5204',
      longitude: '74.3587'
    };

    const createResponse = await axios.post('http://localhost:5000/api/items', itemData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Item created successfully!');
    console.log('📋 Item ID:', createResponse.data.data.id);
    console.log('📋 Item Title:', createResponse.data.data.title);

    // Verify it appears in user's items
    const myItemsResponse = await axios.get('http://localhost:5000/api/users/my-items', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const newItem = myItemsResponse.data.data.find(item => item.title === 'Test Item Simple');
    if (newItem) {
      console.log('✅ Item appears in user\'s items list');
    } else {
      console.log('❌ Item NOT found in user\'s items list');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCreateSimple();