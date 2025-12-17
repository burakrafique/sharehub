-- ============================================
-- ShareHub Sample Data (MySQL Version)
-- Test data for development and demonstration
-- ============================================

USE sharehub;

-- Clear existing data (optional - uncomment if needed)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE messages;
-- TRUNCATE TABLE transactions;
-- TRUNCATE TABLE item_images;
-- TRUNCATE TABLE items;
-- TRUNCATE TABLE ngo_verifications;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insert Sample Users
-- Password for all users: "password123" (hashed with bcrypt)
-- ============================================
INSERT INTO users (name, email, password_hash, phone, role, address, latitude, longitude) VALUES
('Ali Ahmed', 'ali@sharehub.com', '$2a$10$rQZ9vXqVqVqVqVqVqVqVqOeMxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', '0300-1234567', 'user', 'House #123, Johar Town, Lahore', 31.4697, 74.2728),
('Sara Khan', 'sara@sharehub.com', '$2a$10$rQZ9vXqVqVqVqVqVqVqVqOeMxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', '0301-2345678', 'user', 'Flat #45, DHA Phase 5, Lahore', 31.4742, 74.4064),
('Helping Hands NGO', 'contact@helpinghands.org', '$2a$10$rQZ9vXqVqVqVqVqVqVqVqOeMxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', '0302-3456789', 'ngo', 'Office #12, Model Town, Lahore', 31.4818, 74.3244),
('Ahmed Hassan', 'ahmed@sharehub.com', '$2a$10$rQZ9vXqVqVqVqVqVqVqVqOeMxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', '0303-4567890', 'user', 'Plaza #7, Gulberg III, Lahore', 31.5204, 74.3587),
('Fatima Malik', 'fatima@sharehub.com', '$2a$10$rQZ9vXqVqVqVqVqVqVqVqOeMxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', '0304-5678901', 'user', 'House #89, Bahria Town, Lahore', 31.3375, 74.2111);

-- ============================================
-- Insert Sample Items (200 items total)
-- ============================================
INSERT INTO items (user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, status) VALUES

-- ============================================
-- RATION ITEMS (50 items)
-- ============================================
-- User 1 (Ali Ahmed) - Ration Items
(1, 'Premium Basmati Rice 10kg', 'High quality basmati rice, perfect for families in need', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Cooking Oil 5L Pack', 'Pure cooking oil for healthy meals', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Wheat Flour 20kg Bag', 'Fresh wheat flour for bread making', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Sugar 5kg Pack', 'White sugar for daily use', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Lentils Mix 3kg', 'Mixed lentils - masoor, moong, chana dal', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Tea Leaves 1kg', 'Quality tea leaves for families', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Salt 2kg Pack', 'Iodized salt for cooking', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Milk Powder 1kg', 'Full cream milk powder', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Chicken 2kg Fresh', 'Fresh chicken for protein needs', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Onions 5kg Bag', 'Fresh onions for cooking', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),

-- User 2 (Sara Khan) - Ration Items
(2, 'Potatoes 10kg Sack', 'Fresh potatoes for daily meals', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Tomatoes 3kg Fresh', 'Ripe tomatoes for cooking', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Spices Kit Complete', 'All essential spices for Pakistani cooking', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Dates 2kg Premium', 'High quality dates for nutrition', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Yogurt 1L Fresh', 'Fresh yogurt for daily consumption', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Eggs 2 Dozen', 'Fresh farm eggs for protein', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Bread Loaves 5 Pack', 'Fresh bread for immediate consumption', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Ghee 2kg Pure', 'Pure desi ghee for cooking', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Vermicelli 1kg', 'Roasted vermicelli for desserts', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Biscuits Family Pack', 'Nutritious biscuits for children', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- User 4 (Ahmed Hassan) - Ration Items
(4, 'Beef 3kg Fresh', 'Fresh beef for protein needs', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Fish 2kg Fresh', 'Fresh fish for healthy meals', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Garlic 1kg Fresh', 'Fresh garlic for cooking', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Ginger 500g Fresh', 'Fresh ginger for cooking and health', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Green Chilies 500g', 'Fresh green chilies for spice', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Coriander 250g Fresh', 'Fresh coriander leaves', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Mint 250g Fresh', 'Fresh mint leaves for cooking', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Lemons 1kg Fresh', 'Fresh lemons for vitamin C', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Carrots 2kg Fresh', 'Fresh carrots for nutrition', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Cabbage 2kg Fresh', 'Fresh cabbage for vegetables', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- User 5 (Fatima Malik) - Ration Items
(5, 'Spinach 1kg Fresh', 'Fresh spinach for iron', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Cauliflower 2kg Fresh', 'Fresh cauliflower for vegetables', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Peas 1kg Fresh', 'Fresh green peas', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Okra 1kg Fresh', 'Fresh okra for cooking', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Eggplant 2kg Fresh', 'Fresh eggplant for vegetables', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Bell Peppers 1kg', 'Colorful bell peppers', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Cucumber 2kg Fresh', 'Fresh cucumbers for salad', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Radish 1kg Fresh', 'Fresh radish for vegetables', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Turnip 1kg Fresh', 'Fresh turnip for cooking', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Bitter Gourd 1kg', 'Fresh bitter gourd for health', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Additional Ration Items from various users
(1, 'Apples 3kg Fresh', 'Fresh red apples for nutrition', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Bananas 2kg Fresh', 'Fresh bananas for potassium', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Oranges 3kg Fresh', 'Fresh oranges for vitamin C', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Mangoes 2kg Fresh', 'Sweet mangoes for summer', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Grapes 1kg Fresh', 'Fresh grapes for antioxidants', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Pomegranate 2kg', 'Fresh pomegranates for health', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Watermelon 5kg', 'Fresh watermelon for hydration', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Melon 3kg Fresh', 'Sweet melon for summer', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Guava 2kg Fresh', 'Fresh guava for vitamin C', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Papaya 2kg Fresh', 'Fresh papaya for digestion', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- ============================================
-- BOOKS (50 items)
-- ============================================
-- Educational Books
(1, 'Quran Majeed with Translation', 'Complete Quran with Urdu translation', 'books', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Islamic Studies Grade 8', 'School textbook for Islamic studies', 'books', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Mathematics Grade 10', 'Complete mathematics textbook', 'books', 'sell', 800.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Physics Grade 11', 'Physics textbook with solved examples', 'books', 'sell', 1200.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Chemistry Grade 12', 'Complete chemistry guide', 'books', 'sell', 1500.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'English Literature Collection', '5 classic English novels', 'books', 'sell', 2000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Urdu Poetry Books', 'Collection of famous Urdu poets', 'books', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Computer Science Degree Books', 'Complete CS degree book set', 'books', 'sell', 15000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Medical MBBS Books', 'First year MBBS complete set', 'books', 'sell', 25000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Engineering Mechanics', 'Mechanical engineering textbook', 'books', 'sell', 3000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- Children Books
(4, 'Childrens Story Collection', '20 colorful story books for kids', 'books', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'ABC Learning Books', 'Alphabet learning books for toddlers', 'books', 'donate', 0.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Nursery Rhymes Book', 'Collection of popular nursery rhymes', 'books', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Coloring Books Set', '10 different coloring books', 'books', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Picture Dictionary', 'English-Urdu picture dictionary', 'books', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Fairy Tales Collection', 'Classic fairy tales for children', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Animal Encyclopedia', 'Childrens animal encyclopedia', 'books', 'donate', 0.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Science Experiments Book', 'Fun science experiments for kids', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Drawing and Sketching', 'Learn to draw step by step', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Moral Stories Collection', 'Stories with moral lessons', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Professional Books
(1, 'Web Development Complete', 'HTML, CSS, JavaScript guide', 'books', 'sell', 4000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Python Programming', 'Complete Python programming guide', 'books', 'sell', 3500.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Data Science Handbook', 'Complete data science guide', 'books', 'sell', 5000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Digital Marketing Guide', 'Complete digital marketing book', 'books', 'sell', 2500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Business Management', 'MBA business management book', 'books', 'sell', 4500.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Accounting Principles', 'Complete accounting textbook', 'books', 'sell', 3000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Economics Textbook', 'Macro and micro economics', 'books', 'sell', 2800.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Statistics and Probability', 'Complete statistics guide', 'books', 'sell', 2200.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Graphic Design Basics', 'Learn graphic design fundamentals', 'books', 'sell', 3200.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Photography Guide', 'Complete photography handbook', 'books', 'sell', 2800.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Religious and Cultural Books
(1, 'Hadith Collection', 'Sahih Bukhari and Muslim', 'books', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Seerat-un-Nabi', 'Biography of Prophet Muhammad', 'books', 'donate', 0.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Islamic History Books', 'Complete Islamic history set', 'books', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Tafseer Ibn Kathir', 'Quran commentary in Urdu', 'books', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Fiqh and Islamic Law', 'Islamic jurisprudence books', 'books', 'donate', 0.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Dua and Azkar Book', 'Daily prayers and supplications', 'books', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Pakistani History', 'Complete Pakistan history', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Urdu Literature Classics', 'Famous Urdu literature books', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Health and Cooking Books
(1, 'Healthy Cooking Recipes', 'Nutritious Pakistani recipes', 'books', 'sell', 1500.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Home Remedies Guide', 'Natural health remedies', 'books', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Fitness and Exercise', 'Complete fitness guide', 'books', 'sell', 2000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Yoga and Meditation', 'Stress relief and wellness', 'books', 'sell', 1800.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Novels and Fiction
(1, 'Urdu Novels Collection', '10 popular Urdu novels', 'books', 'sell', 3000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'English Fiction Novels', 'Bestselling English novels', 'books', 'sell', 2500.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Mystery and Thriller', 'Exciting mystery novels', 'books', 'sell', 2200.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Romance Novel Collection', 'Popular romance novels', 'books', 'sell', 1800.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- ============================================
-- CLOTHES (50 items)
-- ============================================
-- Men's Clothing
(1, 'Formal Suit Black', 'Premium black formal suit, size 40', 'clothes', 'sell', 8000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Casual Shirts Bundle', '5 casual shirts, size M, mixed colors', 'clothes', 'sell', 3000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Jeans Collection', '3 pairs of branded jeans, size 32', 'clothes', 'sell', 4500.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Winter Jackets', '2 warm winter jackets, size L', 'clothes', 'sell', 5000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Traditional Kurta Set', 'White kurta with matching shalwar', 'clothes', 'sell', 2500.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(4, 'Office Wear Bundle', '10 formal shirts and 3 pants', 'clothes', 'sell', 12000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Sports Wear Set', 'Track suits and sports shirts', 'clothes', 'sell', 3500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Leather Shoes', 'Formal black leather shoes, size 9', 'clothes', 'sell', 4000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Casual Sneakers', 'Branded casual sneakers, size 10', 'clothes', 'sell', 3000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Belt and Wallet Set', 'Leather belt and wallet combo', 'clothes', 'sell', 2000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Women's Clothing
(2, 'Designer Lawn Suits', '5 unstitched designer lawn suits', 'clothes', 'sell', 15000.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Formal Dresses', '3 stitched formal dresses, size M', 'clothes', 'sell', 8000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Casual Wear Bundle', 'Jeans, tops, and casual dresses', 'clothes', 'sell', 6000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Winter Shawls', '4 warm woolen shawls', 'clothes', 'sell', 4000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Handbags Collection', '3 branded handbags', 'clothes', 'sell', 5000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(5, 'Bridal Dress', 'Red bridal dress with heavy work', 'clothes', 'sell', 25000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Party Wear Dresses', '4 party wear dresses, size S', 'clothes', 'sell', 12000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Jewelry Set', 'Artificial jewelry for parties', 'clothes', 'sell', 3000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'High Heel Shoes', '3 pairs of branded heels', 'clothes', 'sell', 4500.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Scarves Collection', '6 colorful scarves and hijabs', 'clothes', 'sell', 2000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Children's Clothing
(1, 'Baby Clothes 0-6 months', 'Complete baby clothing set', 'clothes', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Toddler Clothes 1-2 years', 'Boys and girls mixed clothes', 'clothes', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'School Uniforms', '5 sets of school uniforms, age 8-10', 'clothes', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Kids Winter Clothes', 'Warm clothes for children 5-7 years', 'clothes', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Girls Dresses', '8 beautiful dresses for girls 6-8 years', 'clothes', 'donate', 0.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Boys Casual Wear', 'T-shirts and shorts for boys 10-12', 'clothes', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Kids Shoes Collection', '6 pairs of children shoes, various sizes', 'clothes', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Newborn Baby Set', 'Complete newborn clothing package', 'clothes', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Teen Girls Clothes', 'Trendy clothes for teenage girls', 'clothes', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Kids Sports Wear', 'Sports clothes for active children', 'clothes', 'donate', 0.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Traditional and Formal Wear
(1, 'Mens Sherwani', 'Cream colored sherwani for weddings', 'clothes', 'sell', 15000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Waistcoat Collection', '3 formal waistcoats, different colors', 'clothes', 'sell', 4000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Lehenga Choli', 'Beautiful lehenga for special occasions', 'clothes', 'sell', 20000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Saree Collection', '4 elegant sarees with blouses', 'clothes', 'sell', 12000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Mens Kurta Collection', '6 kurtas for casual and formal wear', 'clothes', 'sell', 8000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Traditional Caps', 'Topi and prayer caps collection', 'clothes', 'sell', 1500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Abaya Collection', '3 modest abayas, different styles', 'clothes', 'sell', 6000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Dupatta Collection', '8 beautiful dupatta in various colors', 'clothes', 'sell', 3000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Seasonal and Special Items
(1, 'Summer Clothes Bundle', 'Light cotton clothes for summer', 'clothes', 'sell', 3500.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Monsoon Wear', 'Waterproof jackets and umbrellas', 'clothes', 'sell', 2500.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Gym Wear Set', 'Complete gym outfit for men', 'clothes', 'sell', 4000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Maternity Clothes', 'Comfortable maternity wear collection', 'clothes', 'sell', 5000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Accessories and Others
(1, 'Mens Accessories', 'Ties, cufflinks, and pocket squares', 'clothes', 'sell', 2000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Womens Accessories', 'Hair accessories and jewelry', 'clothes', 'sell', 2500.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Sunglasses Collection', '4 pairs of branded sunglasses', 'clothes', 'sell', 3000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Watches Collection', '3 wrist watches for men and women', 'clothes', 'sell', 8000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- ============================================
-- DONATION ITEMS (Mixed Categories - 50 items)
-- ============================================
-- Household Items for Donation
(1, 'Blankets for Winter', '10 warm blankets for needy families', 'other', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Kitchen Utensils Set', 'Complete kitchen utensils for cooking', 'other', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Bed Sheets and Pillows', '5 sets of bed sheets with pillows', 'other', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Prayer Mats', '8 prayer mats for mosque donation', 'other', 'donate', 0.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Water Bottles', '20 water bottles for distribution', 'other', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),

-- Educational Items for Donation
(2, 'School Bags', '15 school bags for underprivileged children', 'other', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Stationery Items', 'Notebooks, pens, pencils for students', 'other', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Calculators', '10 scientific calculators for students', 'other', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Art Supplies', 'Colors, brushes, and drawing books', 'other', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Desk and Chair Set', '5 study desks with chairs', 'furniture', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- Medical and Health Items
(4, 'First Aid Kits', '12 complete first aid kits', 'other', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Wheelchairs', '2 wheelchairs for disabled persons', 'other', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Walking Sticks', '8 walking sticks for elderly', 'other', 'donate', 0.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Blood Pressure Monitors', '3 digital BP monitors', 'electronics', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Thermometers', '15 digital thermometers', 'other', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Electronics for Donation
(5, 'Old Mobile Phones', '8 working mobile phones', 'electronics', 'donate', 0.00, 'fair', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Tablets for Students', '4 tablets for online learning', 'electronics', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Radio Sets', '6 FM radio sets', 'electronics', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Fans for Summer', '4 ceiling fans for hot weather', 'electronics', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'LED Bulbs', '25 energy saving LED bulbs', 'electronics', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Furniture for Donation
(1, 'Plastic Chairs', '20 plastic chairs for events', 'furniture', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Folding Tables', '8 folding tables for community use', 'furniture', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Bunk Beds', '3 bunk beds for orphanage', 'furniture', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Wardrobes', '2 wooden wardrobes', 'furniture', 'donate', 0.00, 'fair', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Dining Table Set', 'Table with 6 chairs', 'furniture', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Toys and Games for Children
(1, 'Educational Toys', '15 educational toys for toddlers', 'other', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Board Games', '10 different board games', 'other', 'donate', 0.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Bicycles for Kids', '5 children bicycles, various sizes', 'other', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Stuffed Animals', '20 soft toys for children', 'other', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Building Blocks', 'LEGO and building block sets', 'other', 'donate', 0.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Sports Equipment
(1, 'Cricket Equipment', 'Bats, balls, and pads for cricket', 'other', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Football and Volleyball', '4 footballs and 2 volleyballs', 'other', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Badminton Sets', '6 complete badminton sets', 'other', 'donate', 0.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Table Tennis Set', 'Complete table tennis equipment', 'other', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Religious Items
(1, 'Quran Copies', '25 copies of Quran for mosque', 'books', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Prayer Beads', '30 sets of prayer beads', 'other', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Islamic Calligraphy', '8 framed Islamic calligraphy pieces', 'other', 'donate', 0.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Mosque Carpets', '4 large carpets for mosque', 'other', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Seasonal Items
(1, 'Winter Heaters', '3 room heaters for cold weather', 'electronics', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Summer Coolers', '2 air coolers for hot weather', 'electronics', 'donate', 0.00, 'fair', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Umbrellas', '15 umbrellas for monsoon season', 'other', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Raincoats', '12 raincoats for children', 'clothes', 'donate', 0.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Emergency and Relief Items
(1, 'Emergency Food Packets', '50 ready-to-eat food packets', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Water Purification Tablets', '100 water purification tablets', 'other', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Tents for Camping', '5 camping tents for emergency shelter', 'other', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Flashlights', '20 battery-powered flashlights', 'electronics', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Community Service Items
(1, 'Cleaning Supplies', 'Brooms, mops, and cleaning agents', 'other', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Gardening Tools', 'Shovels, watering cans, and seeds', 'other', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Community Speakers', '2 portable speakers for events', 'electronics', 'donate', 0.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Event Decorations', 'Banners, balloons, and decorative items', 'other', 'donate', 0.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available');

-- ============================================
-- Insert Sample Item Images
-- ============================================
INSERT INTO item_images (item_id, image_url, is_primary) VALUES
-- Ration Items Images (first 20 items)
(1, '/uploads/items/basmati_rice.jpg', TRUE),
(2, '/uploads/items/cooking_oil.jpg', TRUE),
(3, '/uploads/items/wheat_flour.jpg', TRUE),
(4, '/uploads/items/sugar_pack.jpg', TRUE),
(5, '/uploads/items/lentils_mix.jpg', TRUE),
(6, '/uploads/items/tea_leaves.jpg', TRUE),
(7, '/uploads/items/salt_pack.jpg', TRUE),
(8, '/uploads/items/milk_powder.jpg', TRUE),
(9, '/uploads/items/fresh_chicken.jpg', TRUE),
(10, '/uploads/items/onions_bag.jpg', TRUE),
(11, '/uploads/items/potatoes_sack.jpg', TRUE),
(12, '/uploads/items/fresh_tomatoes.jpg', TRUE),
(13, '/uploads/items/spices_kit.jpg', TRUE),
(14, '/uploads/items/premium_dates.jpg', TRUE),
(15, '/uploads/items/fresh_yogurt.jpg', TRUE),
(16, '/uploads/items/farm_eggs.jpg', TRUE),
(17, '/uploads/items/bread_loaves.jpg', TRUE),
(18, '/uploads/items/pure_ghee.jpg', TRUE),
(19, '/uploads/items/vermicelli.jpg', TRUE),
(20, '/uploads/items/biscuits_pack.jpg', TRUE),

-- Books Images (items 51-70)
(51, '/uploads/items/quran_translation.jpg', TRUE),
(52, '/uploads/items/islamic_studies.jpg', TRUE),
(53, '/uploads/items/math_grade10.jpg', TRUE),
(54, '/uploads/items/physics_grade11.jpg', TRUE),
(55, '/uploads/items/chemistry_grade12.jpg', TRUE),
(56, '/uploads/items/english_literature.jpg', TRUE),
(57, '/uploads/items/urdu_poetry.jpg', TRUE),
(58, '/uploads/items/cs_degree_books.jpg', TRUE),
(59, '/uploads/items/mbbs_books.jpg', TRUE),
(60, '/uploads/items/engineering_mechanics.jpg', TRUE),
(61, '/uploads/items/children_stories.jpg', TRUE),
(62, '/uploads/items/abc_learning.jpg', TRUE),
(63, '/uploads/items/nursery_rhymes.jpg', TRUE),
(64, '/uploads/items/coloring_books.jpg', TRUE),
(65, '/uploads/items/picture_dictionary.jpg', TRUE),

-- Clothes Images (items 101-120)
(101, '/uploads/items/formal_suit_black.jpg', TRUE),
(102, '/uploads/items/casual_shirts.jpg', TRUE),
(103, '/uploads/items/jeans_collection.jpg', TRUE),
(104, '/uploads/items/winter_jackets.jpg', TRUE),
(105, '/uploads/items/kurta_set.jpg', TRUE),
(106, '/uploads/items/office_wear.jpg', TRUE),
(107, '/uploads/items/sports_wear.jpg', TRUE),
(108, '/uploads/items/leather_shoes.jpg', TRUE),
(109, '/uploads/items/casual_sneakers.jpg', TRUE),
(110, '/uploads/items/belt_wallet.jpg', TRUE),
(111, '/uploads/items/designer_lawn.jpg', TRUE),
(112, '/uploads/items/formal_dresses.jpg', TRUE),
(113, '/uploads/items/casual_wear_women.jpg', TRUE),
(114, '/uploads/items/winter_shawls.jpg', TRUE),
(115, '/uploads/items/handbags.jpg', TRUE),

-- Donation Items Images (items 151-170)
(151, '/uploads/items/winter_blankets.jpg', TRUE),
(152, '/uploads/items/kitchen_utensils.jpg', TRUE),
(153, '/uploads/items/bed_sheets.jpg', TRUE),
(154, '/uploads/items/prayer_mats.jpg', TRUE),
(155, '/uploads/items/water_bottles.jpg', TRUE),
(156, '/uploads/items/school_bags.jpg', TRUE),
(157, '/uploads/items/stationery_items.jpg', TRUE),
(158, '/uploads/items/calculators.jpg', TRUE),
(159, '/uploads/items/art_supplies.jpg', TRUE),
(160, '/uploads/items/desk_chair.jpg', TRUE);

-- ============================================
-- Insert Sample Messages
-- ============================================
INSERT INTO messages (sender_id, receiver_id, item_id, message_text, is_read) VALUES
-- Conversation about Winter Jacket
(2, 1, 1, 'Hi! Is this winter jacket still available? I am interested.', TRUE),
(1, 2, 1, 'Yes, it is available! Would you like to see it in person?', TRUE),
(2, 1, 1, 'Sure! When can we meet? I am free this weekend.', FALSE),

-- Conversation about Story Books
(4, 1, 2, 'Assalam o Alaikum! Can I collect these books for my community school?', TRUE),
(1, 4, 2, 'Walaikum Assalam! Yes absolutely! When would you like to pick them up?', FALSE),

-- Conversation about Engineering Books
(5, 2, 4, 'Hi Sara! What subjects do these engineering books cover?', TRUE),
(2, 5, 4, 'Hi! These are Software Engineering, Database Systems, and Web Development books.', TRUE),

-- Conversation about Rice Bags
(3, 4, 7, 'Hello! We are Helping Hands NGO. Can we collect these rice bags for distribution?', FALSE);

-- ============================================
-- Insert Sample Transactions
-- ============================================
INSERT INTO transactions (item_id, seller_id, buyer_id, transaction_type, amount, status, completed_at) VALUES
-- Completed sale
(1, 1, 2, 'sell', 2500.00, 'pending', NULL),

-- Completed donation
(2, 1, 4, 'donate', 0.00, 'completed', NOW());

-- ============================================
-- Insert NGO Verification
-- ============================================
INSERT INTO ngo_verifications (user_id, ngo_name, registration_number, verification_status, verified_at) VALUES
(3, 'Helping Hands NGO', 'NGO-LHR-12345-2023', 'verified', NOW());

-- ============================================
-- Display Success Message with Summary
-- ============================================
SELECT 'Sample data inserted successfully!' AS Status;
SELECT 
    (SELECT COUNT(*) FROM users) AS 'Total Users',
    (SELECT COUNT(*) FROM items) AS 'Total Items',
    (SELECT COUNT(*) FROM item_images) AS 'Total Images',
    (SELECT COUNT(*) FROM messages) AS 'Total Messages',
    (SELECT COUNT(*) FROM transactions) AS 'Total Transactions';

-- ============================================
-- Category-wise Item Summary
-- ============================================
SELECT 'ITEM BREAKDOWN BY CATEGORY:' AS Summary;
SELECT 
    category,
    listing_type,
    COUNT(*) as item_count,
    AVG(CASE WHEN price > 0 THEN price ELSE NULL END) as avg_price
FROM items 
GROUP BY category, listing_type 
ORDER BY category, listing_type;

SELECT 'DONATION ITEMS BY CATEGORY:' AS Donations;
SELECT 
    category,
    COUNT(*) as donation_count
FROM items 
WHERE listing_type = 'donate'
GROUP BY category 
ORDER BY donation_count DESC;