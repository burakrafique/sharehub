const mysql = require('mysql2/promise');

async function addDemoItems() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sharehub'
    });
    
    console.log('Connected to database');
    
    // First, let's add some users if they don't exist
    const users = [
      { name: 'Ahmed Ali', email: 'ahmed@example.com', password_hash: '$2b$10$example', phone: '03001234567', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728 },
      { name: 'Fatima Khan', email: 'fatima@example.com', password_hash: '$2b$10$example', phone: '03001234568', address: 'DHA Phase 5, Lahore', latitude: 31.4742, longitude: 74.4064 },
      { name: 'Hassan Sheikh', email: 'hassan@example.com', password_hash: '$2b$10$example', phone: '03001234569', address: 'Gulberg III, Lahore', latitude: 31.5204, longitude: 74.3587 },
      { name: 'Ayesha Malik', email: 'ayesha@example.com', password_hash: '$2b$10$example', phone: '03001234570', address: 'Bahria Town, Lahore', latitude: 31.3375, longitude: 74.2111 }
    ];

    for (const user of users) {
      try {
        await connection.execute(
          'INSERT IGNORE INTO users (name, email, password_hash, phone, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user.name, user.email, user.password_hash, user.phone, user.address, user.latitude, user.longitude]
        );
      } catch (err) {
        console.log('User already exists:', user.email);
      }
    }

    // Clear existing demo items
    await connection.execute('DELETE FROM item_images WHERE item_id > 100');
    await connection.execute('DELETE FROM items WHERE id > 100');
    
    // Add demo items
    const items = [
      // CLOTHES
      { user_id: 1, title: 'Designer Winter Jacket', description: 'Brand new Zara winter jacket, size M. Never worn, still has tags.', category: 'clothes', listing_type: 'sell', price: 8500.00, item_condition: 'new', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728, is_premium: true },
      { user_id: 2, title: 'Vintage Denim Jacket', description: 'Classic Levis denim jacket from the 90s. Size L, great vintage condition.', category: 'clothes', listing_type: 'sell', price: 4500.00, item_condition: 'good', address: 'DHA Phase 5, Lahore', latitude: 31.4742, longitude: 74.4064, is_premium: false },
      { user_id: 1, title: 'Formal Business Suit', description: 'Charcoal grey business suit, perfect for office wear. Size 40.', category: 'clothes', listing_type: 'sell', price: 12000.00, item_condition: 'like_new', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728, is_premium: true },
      { user_id: 3, title: 'Casual Summer Dress', description: 'Flowy summer dress in floral print. Size S, perfect for casual outings.', category: 'clothes', listing_type: 'sell', price: 3500.00, item_condition: 'like_new', address: 'Gulberg III, Lahore', latitude: 31.5204, longitude: 74.3587, is_premium: false },
      { user_id: 2, title: 'Kids Winter Clothes Bundle', description: 'Warm winter clothes for children aged 5-8. Includes jackets, sweaters.', category: 'clothes', listing_type: 'donate', price: 0.00, item_condition: 'good', address: 'DHA Phase 5, Lahore', latitude: 31.4742, longitude: 74.4064, is_premium: false },
      
      // BOOKS
      { user_id: 1, title: 'Programming Books Collection', description: 'Set of 5 programming books: Python, JavaScript, React, Node.js, Database Design.', category: 'books', listing_type: 'sell', price: 6000.00, item_condition: 'like_new', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728, is_premium: true },
      { user_id: 2, title: 'Medical Textbooks MBBS', description: 'Complete set of 2nd year MBBS books including Anatomy, Physiology.', category: 'books', listing_type: 'sell', price: 18000.00, item_condition: 'good', address: 'DHA Phase 5, Lahore', latitude: 31.4742, longitude: 74.4064, is_premium: true },
      { user_id: 3, title: 'Engineering Mathematics', description: 'Advanced Engineering Mathematics by Kreyszig. Essential for engineering students.', category: 'books', listing_type: 'sell', price: 2500.00, item_condition: 'good', address: 'Gulberg III, Lahore', latitude: 31.5204, longitude: 74.3587, is_premium: false },
      { user_id: 1, title: 'Childrens Story Books', description: 'Beautiful collection of 20 childrens story books with colorful illustrations.', category: 'books', listing_type: 'donate', price: 0.00, item_condition: 'good', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728, is_premium: false },
      { user_id: 4, title: 'Islamic Literature Collection', description: 'Collection of Islamic books including Quran translation, Hadith books.', category: 'books', listing_type: 'donate', price: 0.00, item_condition: 'like_new', address: 'Bahria Town, Lahore', latitude: 31.3375, longitude: 74.2111, is_premium: false },
      
      // RATION
      { user_id: 1, title: 'Basmati Rice 20kg Premium', description: 'Premium Sella Basmati rice, perfect for biryani and pulao. Fresh stock.', category: 'ration', listing_type: 'donate', price: 0.00, item_condition: 'new', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728, is_premium: true },
      { user_id: 2, title: 'Atta Chakki Fresh 20kg', description: 'Fresh chakki atta for making rotis. High quality wheat flour.', category: 'ration', listing_type: 'donate', price: 0.00, item_condition: 'new', address: 'DHA Phase 5, Lahore', latitude: 31.4742, longitude: 74.4064, is_premium: false },
      { user_id: 3, title: 'Cooking Oil Dalda 5L', description: 'Pure cooking oil for healthy cooking. Sealed pack, perfect for families.', category: 'ration', listing_type: 'donate', price: 0.00, item_condition: 'new', address: 'Gulberg III, Lahore', latitude: 31.5204, longitude: 74.3587, is_premium: false },
      { user_id: 4, title: 'Sugar White 10kg', description: 'Pure white sugar for daily use. Fresh stock, perfect for tea and cooking.', category: 'ration', listing_type: 'donate', price: 0.00, item_condition: 'new', address: 'Bahria Town, Lahore', latitude: 31.3375, longitude: 74.2111, is_premium: false },
      { user_id: 1, title: 'Complete Grocery Package', description: 'Complete monthly grocery package including rice, atta, oil, sugar, and spices.', category: 'ration', listing_type: 'donate', price: 0.00, item_condition: 'new', address: 'Johar Town, Lahore', latitude: 31.4697, longitude: 74.2728, is_premium: true }
    ];

    // First add is_premium column if it doesn't exist
    try {
      await connection.execute('ALTER TABLE items ADD COLUMN is_premium BOOLEAN DEFAULT FALSE');
      console.log('Added is_premium column');
    } catch (err) {
      console.log('is_premium column already exists');
    }

    let itemId = 101;
    for (const item of items) {
      try {
        const [result] = await connection.execute(
          'INSERT INTO items (id, user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, is_premium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [itemId, item.user_id, item.title, item.description, item.category, item.listing_type, item.price, item.item_condition, item.address, item.latitude, item.longitude, item.is_premium]
        );
        
        // Add sample image for each item
        const imageUrls = {
          'clothes': [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop'
          ],
          'books': [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
          ],
          'ration': [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
          ]
        };
        
        const categoryImages = imageUrls[item.category] || imageUrls['clothes'];
        const imageUrl = categoryImages[Math.floor(Math.random() * categoryImages.length)];
        
        await connection.execute(
          'INSERT INTO item_images (item_id, image_url, is_primary) VALUES (?, ?, ?)',
          [itemId, imageUrl, true]
        );
        
        console.log(`Added item: ${item.title}`);
        itemId++;
      } catch (err) {
        console.error(`Error adding item ${item.title}:`, err.message);
      }
    }
    
    // Check total items
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM items');
    console.log('Total items in database:', rows[0].total);
    
    // Show items by category
    const [categoryRows] = await connection.execute(`
      SELECT category, listing_type, COUNT(*) as count 
      FROM items 
      GROUP BY category, listing_type 
      ORDER BY category, listing_type
    `);
    
    console.log('\nItems by category:');
    categoryRows.forEach(row => {
      console.log(`${row.category} (${row.listing_type}): ${row.count} items`);
    });
    
    await connection.end();
    console.log('\nDemo items added successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addDemoItems();