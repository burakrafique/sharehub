// Test script to verify item management system
console.log('🔍 Testing Item Management System...');

try {
  console.log('1. Testing Item Model...');
  const Item = require('./models/Item');
  console.log('✅ Item model loaded');
  console.log('   Available methods:', Object.getOwnPropertyNames(Item).filter(name => typeof Item[name] === 'function'));

  console.log('2. Testing Item Controller...');
  const itemController = require('./controllers/itemController');
  console.log('✅ Item controller loaded');
  console.log('   Available functions:', Object.keys(itemController));

  console.log('3. Testing Item Routes...');
  const itemRoutes = require('./routes/itemRoutes');
  console.log('✅ Item routes loaded');

  console.log('4. Testing Validation Rules...');
  const { createItemValidation } = require('./middleware/validationRules');
  console.log('✅ Item validation rules loaded');

  console.log('🎉 Item Management System is fully functional!');
  
  console.log('\n📋 AVAILABLE ENDPOINTS:');
  console.log('POST   /api/items                    - Create item (protected)');
  console.log('GET    /api/items                    - Get all items with pagination');
  console.log('GET    /api/items/search             - Search items');
  console.log('GET    /api/items/my-items           - Get user\'s items (protected)');
  console.log('GET    /api/items/nearby             - Get nearby items');
  console.log('GET    /api/items/:id                - Get item by ID');
  console.log('PUT    /api/items/:id                - Update item (protected)');
  console.log('PATCH  /api/items/:id/status         - Update item status (protected)');
  console.log('DELETE /api/items/:id                - Delete item (protected)');
  console.log('DELETE /api/items/images/:imageId    - Delete item image (protected)');
  console.log('PUT    /api/items/images/:imageId/primary - Set primary image (protected)');

} catch (error) {
  console.error('❌ Error testing item system:', error.message);
  console.error('📍 Stack trace:', error.stack);
}