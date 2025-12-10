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
-- Insert Sample Items
-- ============================================
INSERT INTO items (user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, status) VALUES
-- Ali's Items
(1, 'Gently Used Winter Jacket', 'Black leather winter jacket, size L, barely worn. Perfect for cold weather!', 'clothes', 'sell', 2500.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Children Story Books Collection', '10 colorful story books for kids aged 5-10. Great condition!', 'books', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(1, 'Kids Clothes Bundle', 'Mix of boys and girls clothes for ages 5-7 years', 'clothes', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),

-- Sara's Items
(2, 'Engineering Textbooks', 'Complete set of 3rd year Software Engineering books', 'books', 'sell', 5000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Designer Lawn Suits', '3 unstitched designer lawn suits, premium quality fabric', 'clothes', 'swap', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(2, 'Medical Textbooks', 'MBBS 2nd year books including Pharmacology and Pathology', 'books', 'sell', 8000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'pending'),

-- Ahmed's Items
(4, 'Rice Bags - 10kg Each', '5 bags of premium basmati rice for donation to needy families', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(4, 'Formal Office Shirts', '4 formal shirts, size M, lightly used', 'clothes', 'sell', 1500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Fatima's Items
(5, 'Programming Books Bundle', 'Python, JavaScript, and React.js books with practice exercises', 'books', 'swap', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(5, 'Monthly Ration Package', 'Atta (10kg), cooking oil (3L), sugar (2kg) for donation', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available');

-- ============================================
-- Insert Sample Item Images
-- ============================================
INSERT INTO item_images (item_id, image_url, is_primary) VALUES
-- Images for Winter Jacket
(1, '/uploads/items/jacket_front.jpg', TRUE),
(1, '/uploads/items/jacket_back.jpg', FALSE),

-- Images for Story Books
(2, '/uploads/items/storybooks_1.jpg', TRUE),

-- Images for Kids Clothes
(3, '/uploads/items/kidsclothes_bundle.jpg', TRUE),

-- Images for Engineering Textbooks
(4, '/uploads/items/engineering_books.jpg', TRUE),
(4, '/uploads/items/engineering_books_2.jpg', FALSE),

-- Images for Lawn Suits
(5, '/uploads/items/lawn_suits_1.jpg', TRUE),
(5, '/uploads/items/lawn_suits_2.jpg', FALSE),
(5, '/uploads/items/lawn_suits_3.jpg', FALSE),

-- Images for Medical Books
(6, '/uploads/items/medical_books.jpg', TRUE),

-- Images for Rice Bags
(7, '/uploads/items/rice_bags.jpg', TRUE),

-- Images for Formal Shirts
(8, '/uploads/items/formal_shirts.jpg', TRUE),

-- Images for Programming Books
(9, '/uploads/items/programming_books.jpg', TRUE),

-- Images for Ration Package
(10, '/uploads/items/ration_package.jpg', TRUE);

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