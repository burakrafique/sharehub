const mysql = require('mysql2/promise');

async function setupDemoData() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sharehub'
    });
    
    console.log('✅ Connected to database');
    
    // Add is_premium column if it doesn't exist
    try {
      await connection.execute('ALTER TABLE items ADD COLUMN is_premium BOOLEAN DEFAULT FALSE');
      console.log('✅ Added is_premium column');
    } catch (err) {
      console.log('ℹ️  is_premium column already exists');
    }
    
    // Clear existing demo data
    await connection.execute('DELETE FROM item_images WHERE item_id > 100');
    await connection.execute('DELETE FROM items WHERE id > 100');
    console.log('✅ Cleared existing demo data');
    
    // Insert demo items
    const items = [
      // CLOTHES
      [101, 1, 'Designer Winter Jacket', 'Brand new Zara winter jacket, size M. Never worn, still has tags. Perfect for cold weather.', 'clothes', 'sell', 8500.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'],
      [102, 1, 'Vintage Denim Jacket', 'Classic Levis denim jacket from the 90s. Size L, great vintage condition with authentic wear.', 'clothes', 'sell', 4500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'],
      [103, 1, 'Formal Business Suit', 'Charcoal grey business suit, perfect for office wear. Size 40, dry cleaned and ready to wear.', 'clothes', 'sell', 12000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'],
      [104, 1, 'Casual Summer Dress', 'Flowy summer dress in floral print. Size S, perfect for casual outings and summer events.', 'clothes', 'sell', 3500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, false, 'available'],
      [105, 1, 'Kids Winter Clothes Bundle', 'Warm winter clothes for children aged 5-8. Includes jackets, sweaters, and pants.', 'clothes', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'],
      
      // BOOKS
      [106, 1, 'Programming Books Collection', 'Set of 5 programming books: Python, JavaScript, React, Node.js, and Database Design. Excellent for learning.', 'books', 'sell', 6000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'],
      [107, 1, 'Medical Textbooks MBBS', 'Complete set of 2nd year MBBS books including Anatomy, Physiology, and Biochemistry. Well maintained.', 'books', 'sell', 18000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, true, 'available'],
      [108, 1, 'Engineering Mathematics', 'Advanced Engineering Mathematics by Kreyszig. Essential for engineering students. Minimal highlighting.', 'books', 'sell', 2500.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, false, 'available'],
      [109, 1, 'Childrens Story Books', 'Beautiful collection of 20 childrens story books with colorful illustrations. Ages 3-8.', 'books', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, false, 'available'],
      [110, 1, 'Islamic Literature Collection', 'Collection of Islamic books including Quran translation, Hadith, and Islamic history books.', 'books', 'donate', 0.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'],
      
      // RATION
      [111, 1, 'Basmati Rice 20kg Premium', 'Premium Sella Basmati rice, perfect for biryani and pulao. Fresh stock.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'],
      [112, 1, 'Atta Chakki Fresh 20kg', 'Fresh chakki atta for making rotis. High quality wheat flour.', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'],
      [113, 1, 'Cooking Oil Dalda 5L', 'Pure cooking oil for healthy cooking. Sealed pack, perfect for families.', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, false, 'available'],
      [114, 1, 'Sugar White 10kg', 'Pure white sugar for daily use. Fresh stock, perfect for tea and cooking.', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, false, 'available'],
      [115, 1, 'Complete Grocery Package', 'Complete monthly grocery package including rice, atta, oil, sugar, and spices for needy families.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available']
    ];
    
    for (const item of items) {
      await connection.execute(
        'INSERT INTO items (id, user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, is_premium, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        item
      );
    }
    
    console.log('✅ Inserted demo items');
    
    // Add sample images
    const images = [
      // Clothes images
      [101, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', true],
      [102, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop', true],
      [103, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop', true],
      [104, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop', true],
      [105, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop', true],
      
      // Books images
      [106, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop', true],
      [107, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop', true],
      [108, 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&h=500&fit=crop', true],
      [109, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', true],
      [110, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop', true],
      
      // Ration images
      [111, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', true],
      [112, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', true],
      [113, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop', true],
      [114, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', true],
      [115, 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&h=500&fit=crop', true]
    ];
    
    for (const image of images) {
      await connection.execute(
        'INSERT INTO item_images (item_id, image_url, is_primary) VALUES (?, ?, ?)',
        image
      );
    }
    
    console.log('✅ Added sample images');
    
    // Check results
    const [itemCount] = await connection.execute('SELECT COUNT(*) as total FROM items');
    const [categoryCount] = await connection.execute(`
      SELECT category, listing_type, COUNT(*) as count 
      FROM items 
      GROUP BY category, listing_type 
      ORDER BY category, listing_type
    `);
    
    console.log(`\n📊 Total items: ${itemCount[0].total}`);
    console.log('\n📋 Items by category:');
    categoryCount.forEach(row => {
      console.log(`   ${row.category} (${row.listing_type}): ${row.count} items`);
    });
    
    console.log('\n🎉 Demo data setup completed successfully!');
    console.log('\n🚀 Your project is now ready for FYP evaluation!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDemoData();