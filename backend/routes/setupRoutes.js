const express = require('express');
const router = express.Router();
const { promisePool: pool } = require('../config/database');

// Setup demo data endpoint
router.post('/demo-data', async (req, res) => {
  try {
    console.log('🚀 Starting demo data setup...');

    // Add is_premium column if it doesn't exist
    try {
      await pool.execute('ALTER TABLE items ADD COLUMN is_premium BOOLEAN DEFAULT FALSE');
      console.log('✅ Added is_premium column');
    } catch (err) {
      console.log('ℹ️  is_premium column already exists');
    }

    // Clear existing demo data
    await pool.execute('DELETE FROM item_images WHERE item_id > 100');
    await pool.execute('DELETE FROM items WHERE id > 100');
    console.log('✅ Cleared existing demo data');

    // Ensure we have at least one user
    try {
      await pool.execute(`
        INSERT IGNORE INTO users (id, name, email, password_hash, phone, address, latitude, longitude) 
        VALUES (1, 'Demo User', 'demo@sharehub.com', '$2b$10$example', '03001234567', 'Johar Town, Lahore', 31.4697, 74.2728)
      `);
      console.log('✅ Demo user created');
    } catch (err) {
      console.log('ℹ️  Demo user already exists');
    }

    // Demo items data
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

    // Insert items
    for (const item of items) {
      await pool.execute(
        'INSERT INTO items (id, user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, is_premium, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        item
      );
    }
    console.log('✅ Inserted demo items');

    // Demo images data
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

    // Insert images
    for (const image of images) {
      await pool.execute(
        'INSERT INTO item_images (item_id, image_url, is_primary) VALUES (?, ?, ?)',
        image
      );
    }
    console.log('✅ Added sample images');

    // Get statistics
    const [itemCount] = await pool.execute('SELECT COUNT(*) as total FROM items');
    const [categoryCount] = await pool.execute(`
      SELECT category, listing_type, COUNT(*) as count 
      FROM items 
      GROUP BY category, listing_type 
      ORDER BY category, listing_type
    `);

    console.log('🎉 Demo data setup completed successfully!');

    res.status(200).json({
      success: true,
      message: 'Demo data setup completed successfully!',
      statistics: {
        totalItems: itemCount[0].total,
        itemsByCategory: categoryCount
      }
    });

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup demo data',
      error: error.message
    });
  }
});

// Make user admin endpoint
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Update user role to admin
    await pool.execute('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);

    res.status(200).json({
      success: true,
      message: `User ${email} is now an admin`,
      data: {
        email: email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to make user admin',
      error: error.message
    });
  }
});

// Create demo admin account
router.post('/create-admin', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    
    // Check if admin already exists
    const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', ['admin@sharehub.com']);
    
    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Demo admin already exists',
        data: {
          email: 'admin@sharehub.com',
          password: 'admin123'
        }
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.execute(
      'INSERT INTO users (name, email, password_hash, phone, role, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Admin User', 'admin@sharehub.com', hashedPassword, '03001234567', 'admin', 'Lahore, Pakistan', 31.5204, 74.3587]
    );

    res.status(200).json({
      success: true,
      message: 'Demo admin created successfully',
      data: {
        email: 'admin@sharehub.com',
        password: 'admin123',
        name: 'Admin User'
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message
    });
  }
});

// List all users
router.get('/list-users', async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list users',
      error: error.message
    });
  }
});

module.exports = router;