-- ============================================
-- ShareHub Demo Items with Images
-- Realistic demo data for testing and demonstration
-- ============================================

USE sharehub;

-- ============================================
-- Insert Demo Items with Realistic Data
-- ============================================

-- Clear existing demo data (optional)
-- DELETE FROM item_images WHERE item_id > 200;
-- DELETE FROM items WHERE id > 200;

-- ============================================
-- CLOTHES CATEGORY - DEMO ITEMS
-- ============================================

INSERT INTO items (user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, status) VALUES

-- Clothes for Sale
(1, 'Designer Winter Jacket', 'Brand new Zara winter jacket, size M. Never worn, still has tags. Perfect for cold weather.', 'clothes', 'sell', 8500.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Vintage Denim Jacket', 'Classic Levis denim jacket from the 90s. Size L, great vintage condition with authentic wear.', 'clothes', 'sell', 4500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(1, 'Formal Business Suit', 'Charcoal grey business suit, perfect for office wear. Size 40, dry cleaned and ready to wear.', 'clothes', 'sell', 12000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(4, 'Casual Summer Dress', 'Flowy summer dress in floral print. Size S, perfect for casual outings and summer events.', 'clothes', 'sell', 3500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Designer Handbag', 'Authentic Coach handbag in excellent condition. Brown leather with gold hardware.', 'clothes', 'sell', 15000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Clothes for Donation
(2, 'Kids Winter Clothes Bundle', 'Warm winter clothes for children aged 5-8. Includes jackets, sweaters, and pants.', 'clothes', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(1, 'Mens Casual Wear', 'Collection of mens casual shirts and t-shirts, various sizes M-L. Clean and in good condition.', 'clothes', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(4, 'Womens Professional Attire', 'Business suits and formal wear for working women. Sizes 8-10, perfect for office environment.', 'clothes', 'donate', 0.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- ============================================
-- BOOKS CATEGORY - DEMO ITEMS
-- ============================================

-- Educational Books
(1, 'Complete Programming Collection', 'Set of 5 programming books: Python, JavaScript, React, Node.js, and Database Design. Excellent for learning.', 'books', 'sell', 6000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Medical Textbooks MBBS', 'Complete set of 2nd year MBBS books including Anatomy, Physiology, and Biochemistry. Well maintained.', 'books', 'sell', 18000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Engineering Mathematics', 'Advanced Engineering Mathematics by Kreyszig. Essential for engineering students. Minimal highlighting.', 'books', 'sell', 2500.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Business Management Books', 'Collection of MBA books including Marketing, Finance, and Strategic Management. Great condition.', 'books', 'sell', 8500.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Books for Donation
(1, 'Childrens Story Books', 'Beautiful collection of 20 childrens story books with colorful illustrations. Ages 3-8.', 'books', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Islamic Literature', 'Collection of Islamic books including Quran translation, Hadith, and Islamic history books.', 'books', 'donate', 0.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'School Textbooks Grade 9-10', 'Complete set of 9th and 10th grade textbooks for all subjects. Great for students.', 'books', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- ============================================
-- ELECTRONICS CATEGORY - DEMO ITEMS
-- ============================================

(1, 'iPhone 12 Pro Max', 'Excellent condition iPhone 12 Pro Max, 128GB, Space Gray. Battery health 89%. Includes original box and charger.', 'electronics', 'sell', 85000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'MacBook Air M1', '2021 MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Perfect for students and professionals. Barely used.', 'electronics', 'sell', 145000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Gaming Console PS5', 'PlayStation 5 with 2 controllers and 3 games. Excellent condition, rarely used. Perfect for gaming enthusiasts.', 'electronics', 'sell', 95000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Samsung 4K Smart TV', '55 inch Samsung 4K Smart TV with HDR. Wall mount included. Perfect picture quality, like new condition.', 'electronics', 'sell', 75000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Canon DSLR Camera', 'Canon EOS 1500D with 18-55mm lens. Perfect for photography beginners. Includes camera bag and memory card.', 'electronics', 'sell', 45000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),

-- Electronics for Donation
(2, 'Old Smartphones', 'Collection of 3 working smartphones for students or emergency use. Basic models but functional.', 'electronics', 'donate', 0.00, 'fair', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Computer Accessories', 'Keyboards, mice, cables, and other computer accessories. Great for students setting up workstations.', 'electronics', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- ============================================
-- FURNITURE CATEGORY - DEMO ITEMS
-- ============================================

(1, 'Modern Sofa Set', 'Beautiful 3-piece sofa set in grey fabric. Very comfortable and in excellent condition. Perfect for living room.', 'furniture', 'sell', 45000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Wooden Dining Table', 'Solid wood dining table with 6 chairs. Classic design, seats 6 people comfortably. Well maintained.', 'furniture', 'sell', 35000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Office Desk and Chair', 'Professional office desk with ergonomic chair. Perfect for home office setup. Excellent condition.', 'furniture', 'sell', 18000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Bedroom Furniture Set', 'Complete bedroom set including bed, wardrobe, and side tables. Modern design in white finish.', 'furniture', 'sell', 65000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Furniture for Donation
(1, 'Study Table for Students', 'Simple wooden study table perfect for students. Good condition, just needs minor touch-up.', 'furniture', 'donate', 0.00, 'fair', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Plastic Chairs', 'Set of 10 plastic chairs for events or gatherings. Clean and stackable for easy storage.', 'furniture', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- ============================================
-- OTHER CATEGORY - DEMO ITEMS
-- ============================================

(1, 'Bicycle Mountain Bike', 'Trek mountain bike in excellent condition. 21-speed, perfect for city riding and light trails.', 'other', 'sell', 25000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Kitchen Appliances Set', 'Microwave, blender, and toaster in working condition. Perfect for small kitchen setup.', 'other', 'sell', 15000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Exercise Equipment', 'Home gym equipment including dumbbells, yoga mat, and resistance bands. Great for fitness enthusiasts.', 'other', 'sell', 8000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Musical Instruments', 'Acoustic guitar with case and picks. Perfect for beginners or intermediate players. Well maintained.', 'other', 'sell', 12000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Other for Donation
(1, 'Sports Equipment', 'Cricket bat, football, and badminton rackets for community sports activities. Good condition.', 'other', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Art Supplies', 'Paints, brushes, canvases, and drawing materials for art students or hobbyists.', 'other', 'donate', 0.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available');

-- ============================================
-- Insert Item Images for Demo Items
-- ============================================

INSERT INTO item_images (item_id, image_url, is_primary) VALUES

-- Clothes Images
(201, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', TRUE),
(201, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&crop=top', FALSE),
(202, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop', TRUE),
(203, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop', TRUE),
(204, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop', TRUE),
(205, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop', TRUE),
(206, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop', TRUE),
(207, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=500&fit=crop', TRUE),
(208, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop', TRUE),

-- Books Images
(209, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop', TRUE),
(210, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop', TRUE),
(211, 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&h=500&fit=crop', TRUE),
(212, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', TRUE),
(213, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', TRUE),
(214, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop', TRUE),
(215, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop', TRUE),

-- Electronics Images
(216, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', TRUE),
(217, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', TRUE),
(218, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop', TRUE),
(219, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop', TRUE),
(220, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', TRUE),
(221, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop', TRUE),
(222, 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop', TRUE),

-- Furniture Images
(223, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', TRUE),
(224, 'https://images.unsplash.com/photo-1549497538-303791108f95?w=500&h=500&fit=crop', TRUE),
(225, 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&h=500&fit=crop', TRUE),
(226, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop', TRUE),
(227, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&crop=center', TRUE),
(228, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop', TRUE),

-- Other Items Images
(229, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', TRUE),
(230, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', TRUE),
(231, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', TRUE),
(232, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop', TRUE),
(233, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=500&fit=crop', TRUE),
(234, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop', TRUE);

-- ============================================
-- Display Success Message
-- ============================================
SELECT 'Demo items with images inserted successfully!' AS Status;
SELECT 
    COUNT(*) AS 'New Demo Items Added'
FROM items 
WHERE id > 200;