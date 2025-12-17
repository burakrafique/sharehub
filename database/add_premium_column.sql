-- Add is_premium column to items table
ALTER TABLE items ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;

-- Insert demo items with premium flag
INSERT INTO items (user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, is_premium, status) VALUES

-- CLOTHES
(1, 'Designer Winter Jacket', 'Brand new Zara winter jacket, size M. Never worn, still has tags. Perfect for cold weather.', 'clothes', 'sell', 8500.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'),
(1, 'Vintage Denim Jacket', 'Classic Levis denim jacket from the 90s. Size L, great vintage condition with authentic wear.', 'clothes', 'sell', 4500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'),
(1, 'Formal Business Suit', 'Charcoal grey business suit, perfect for office wear. Size 40, dry cleaned and ready to wear.', 'clothes', 'sell', 12000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'),
(1, 'Casual Summer Dress', 'Flowy summer dress in floral print. Size S, perfect for casual outings and summer events.', 'clothes', 'sell', 3500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, false, 'available'),
(1, 'Kids Winter Clothes Bundle', 'Warm winter clothes for children aged 5-8. Includes jackets, sweaters, and pants.', 'clothes', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'),

-- BOOKS
(1, 'Programming Books Collection', 'Set of 5 programming books: Python, JavaScript, React, Node.js, and Database Design. Excellent for learning.', 'books', 'sell', 6000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'),
(1, 'Medical Textbooks MBBS', 'Complete set of 2nd year MBBS books including Anatomy, Physiology, and Biochemistry. Well maintained.', 'books', 'sell', 18000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, true, 'available'),
(1, 'Engineering Mathematics', 'Advanced Engineering Mathematics by Kreyszig. Essential for engineering students. Minimal highlighting.', 'books', 'sell', 2500.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, false, 'available'),
(1, 'Childrens Story Books', 'Beautiful collection of 20 childrens story books with colorful illustrations. Ages 3-8.', 'books', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, false, 'available'),
(1, 'Islamic Literature Collection', 'Collection of Islamic books including Quran translation, Hadith, and Islamic history books.', 'books', 'donate', 0.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'),

-- RATION
(1, 'Basmati Rice 20kg Premium', 'Premium Sella Basmati rice, perfect for biryani and pulao. Fresh stock.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available'),
(1, 'Atta Chakki Fresh 20kg', 'Fresh chakki atta for making rotis. High quality wheat flour.', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, false, 'available'),
(1, 'Cooking Oil Dalda 5L', 'Pure cooking oil for healthy cooking. Sealed pack, perfect for families.', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, false, 'available'),
(1, 'Sugar White 10kg', 'Pure white sugar for daily use. Fresh stock, perfect for tea and cooking.', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, false, 'available'),
(1, 'Complete Grocery Package', 'Complete monthly grocery package including rice, atta, oil, sugar, and spices for needy families.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, true, 'available');

-- Add sample images for the items
INSERT INTO item_images (item_id, image_url, is_primary) 
SELECT id, 
  CASE 
    WHEN category = 'clothes' THEN 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop'
    WHEN category = 'books' THEN 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop'
    WHEN category = 'ration' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop'
  END,
  true
FROM items 
WHERE id > (SELECT COALESCE(MAX(id), 0) FROM item_images);