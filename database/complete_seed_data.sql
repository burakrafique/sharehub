-- ============================================
-- ShareHub Marketplace Platform - Complete Sample Data
-- MySQL Version 8.0+
-- Created: December 2024
-- ============================================

USE sharehub_marketplace;

-- Disable foreign key checks temporarily for data insertion
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE ngo_verifications;
-- TRUNCATE TABLE notifications;
-- TRUNCATE TABLE favorites;
-- TRUNCATE TABLE messages;
-- TRUNCATE TABLE transactions;
-- TRUNCATE TABLE item_images;
-- TRUNCATE TABLE items;
-- TRUNCATE TABLE users;

-- ============================================
-- Insert Sample Users
-- Password for all users: "password123" (hashed with bcrypt)
-- Hash: $2a$10$rQZ9vXqVqVqVqVqVqVqVqOeMxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
-- ============================================

INSERT INTO users (username, email, password_hash, full_name, phone_number, profile_image, role, location_latitude, location_longitude, address, is_active) VALUES
-- Regular Users
('ali_ahmed', 'ali@sharehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ali Ahmed', '+92-300-1234567', '/uploads/profiles/ali_ahmed.jpg', 'user', 31.4697, 74.2728, 'House #123, Johar Town, Lahore, Punjab, Pakistan', TRUE),

('sara_khan', 'sara@sharehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sara Khan', '+92-301-2345678', '/uploads/profiles/sara_khan.jpg', 'user', 31.4742, 74.4064, 'Flat #45, DHA Phase 5, Lahore, Punjab, Pakistan', TRUE),

('ahmed_hassan', 'ahmed@sharehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmed Hassan', '+92-303-4567890', 'user', 31.5204, 74.3587, 'Plaza #7, Gulberg III, Lahore, Punjab, Pakistan', TRUE),

('fatima_malik', 'fatima@sharehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fatima Malik', '+92-304-5678901', '/uploads/profiles/fatima_malik.jpg', 'user', 31.3375, 74.2111, 'House #89, Bahria Town, Lahore, Punjab, Pakistan', TRUE),

('usman_ali', 'usman@sharehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usman Ali', '+92-305-6789012', NULL, 'user', 31.4504, 74.3173, 'Street #12, Model Town, Lahore, Punjab, Pakistan', TRUE),

-- NGO Users
('helping_hands_ngo', 'contact@helpinghands.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Helping Hands NGO', '+92-302-3456789', '/uploads/profiles/helping_hands.jpg', 'ngo', 31.4818, 74.3244, 'Office #12, Model Town Extension, Lahore, Punjab, Pakistan', TRUE),

('care_foundation', 'info@carefoundation.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Care Foundation Pakistan', '+92-306-7890123', '/uploads/profiles/care_foundation.jpg', 'ngo', 31.5497, 74.3436, 'Building #5, Liberty Market, Lahore, Punjab, Pakistan', TRUE),

-- Admin User
('admin_user', 'admin@sharehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ShareHub Administrator', '+92-300-0000000', '/uploads/profiles/admin.jpg', 'admin', 31.5204, 74.3587, 'ShareHub Headquarters, Lahore, Punjab, Pakistan', TRUE);

-- ============================================
-- Insert Sample Items
-- ============================================

INSERT INTO items (user_id, title, description, category, listing_type, condition_status, price, location_latitude, location_longitude, address, status, views_count) VALUES
-- Ali's Items (User ID: 1)
(1, 'Gently Used Winter Jacket - Size L', 'Black leather winter jacket, size L, barely worn. Perfect for cold weather! Brand: Outfitters. No damages, all zippers working perfectly.', 'clothes', 'sell', 'like_new', 2500.00, 31.4697, 74.2728, 'Johar Town, Lahore', 'available', 45),

(1, 'Children Story Books Collection', '10 colorful story books for kids aged 5-10. Includes fairy tales, adventure stories, and educational books. Great condition, perfect for young readers!', 'books', 'donate', 'good', NULL, 31.4697, 74.2728, 'Johar Town, Lahore', 'available', 23),

(1, 'Kids Clothes Bundle - Ages 5-7', 'Mix of boys and girls clothes for ages 5-7 years. Includes shirts, pants, dresses, and jackets. All items are clean and in good condition.', 'clothes', 'donate', 'good', NULL, 31.4697, 74.2728, 'Johar Town, Lahore', 'available', 18),

-- Sara's Items (User ID: 2)
(2, 'Engineering Textbooks - 3rd Year', 'Complete set of 3rd year Software Engineering books including Database Systems, Software Architecture, and Web Development. Minimal highlighting.', 'books', 'sell', 'good', 5000.00, 31.4742, 74.4064, 'DHA Phase 5, Lahore', 'available', 67),

(2, 'Designer Lawn Suits - Unstitched', '3 unstitched designer lawn suits from premium brands. Beautiful prints and high-quality fabric. Perfect for summer wear.', 'clothes', 'swap', 'new', NULL, 31.4742, 74.4064, 'DHA Phase 5, Lahore', 'available', 89),

(2, 'Medical Textbooks - MBBS 2nd Year', 'MBBS 2nd year books including Pharmacology, Pathology, and Microbiology. Excellent condition with minimal notes.', 'books', 'sell', 'like_new', 8000.00, 31.4742, 74.4064, 'DHA Phase 5, Lahore', 'sold', 134),

-- Ahmed's Items (User ID: 3)
(3, 'Premium Basmati Rice - 10kg Bags', '5 bags of premium basmati rice (10kg each) for donation to needy families. Fresh stock, perfect for charitable distribution.', 'ration', 'donate', 'new', NULL, 31.5204, 74.3587, 'Gulberg III, Lahore', 'available', 56),

(3, 'Formal Office Shirts - Size M', '4 formal shirts in excellent condition, size M. Brands include Gul Ahmed and Bonanza. Lightly used, perfect for office wear.', 'clothes', 'sell', 'like_new', 1500.00, 31.5204, 74.3587, 'Gulberg III, Lahore', 'available', 34),

-- Fatima's Items (User ID: 4)
(4, 'Programming Books Bundle', 'Complete collection of programming books: Python Crash Course, JavaScript: The Good Parts, React.js documentation, and Node.js guides. Perfect for developers!', 'books', 'swap', 'good', NULL, 31.3375, 74.2111, 'Bahria Town, Lahore', 'available', 78),

(4, 'Monthly Ration Package for Families', 'Complete monthly ration package including Atta (10kg), cooking oil (3L), sugar (2kg), rice (5kg), and lentils (2kg). Ready for donation to needy families.', 'ration', 'donate', 'new', NULL, 31.3375, 74.2111, 'Bahria Town, Lahore', 'available', 92),

-- Usman's Items (User ID: 5)
(5, 'University Textbooks - Computer Science', 'Data Structures, Algorithms, Operating Systems, and Computer Networks books. 4th year CS books in good condition.', 'books', 'sell', 'fair', 3500.00, 31.4504, 74.3173, 'Model Town, Lahore', 'available', 41),

(5, 'Winter Clothing Collection', 'Sweaters, hoodies, and warm jackets for men and women. Various sizes available. Perfect for winter donations.', 'clothes', 'donate', 'good', NULL, 31.4504, 74.3173, 'Model Town, Lahore', 'available', 29);

-- ============================================
-- Insert Item Images
-- ============================================

INSERT INTO item_images (item_id, image_url, is_primary) VALUES
-- Images for Winter Jacket (Item ID: 1)
(1, '/uploads/items/winter_jacket_front.jpg', TRUE),
(1, '/uploads/items/winter_jacket_back.jpg', FALSE),
(1, '/uploads/items/winter_jacket_detail.jpg', FALSE),

-- Images for Story Books (Item ID: 2)
(2, '/uploads/items/story_books_collection.jpg', TRUE),
(2, '/uploads/items/story_books_individual.jpg', FALSE),

-- Images for Kids Clothes (Item ID: 3)
(3, '/uploads/items/kids_clothes_bundle.jpg', TRUE),

-- Images for Engineering Books (Item ID: 4)
(4, '/uploads/items/engineering_books_set.jpg', TRUE),
(4, '/uploads/items/engineering_books_detail.jpg', FALSE),

-- Images for Lawn Suits (Item ID: 5)
(5, '/uploads/items/lawn_suits_1.jpg', TRUE),
(5, '/uploads/items/lawn_suits_2.jpg', FALSE),
(5, '/uploads/items/lawn_suits_3.jpg', FALSE),

-- Images for Medical Books (Item ID: 6)
(6, '/uploads/items/medical_textbooks.jpg', TRUE),

-- Images for Rice Bags (Item ID: 7)
(7, '/uploads/items/rice_bags_donation.jpg', TRUE),

-- Images for Formal Shirts (Item ID: 8)
(8, '/uploads/items/formal_shirts_collection.jpg', TRUE),

-- Images for Programming Books (Item ID: 9)
(9, '/uploads/items/programming_books_stack.jpg', TRUE),
(9, '/uploads/items/programming_books_individual.jpg', FALSE),

-- Images for Ration Package (Item ID: 10)
(10, '/uploads/items/ration_package_complete.jpg', TRUE),

-- Images for CS Textbooks (Item ID: 11)
(11, '/uploads/items/cs_textbooks.jpg', TRUE),

-- Images for Winter Clothing (Item ID: 12)
(12, '/uploads/items/winter_clothing_collection.jpg', TRUE);

-- ============================================
-- Insert Sample Messages
-- ============================================

INSERT INTO messages (sender_id, receiver_id, item_id, message_text, is_read) VALUES
-- Conversation about Winter Jacket (Item ID: 1)
(2, 1, 1, 'Hi Ali! Is this winter jacket still available? I am very interested in purchasing it.', TRUE),
(1, 2, 1, 'Yes Sara, it is still available! The jacket is in excellent condition. Would you like to see it in person?', TRUE),
(2, 1, 1, 'Absolutely! When and where can we meet? I am free this weekend.', FALSE),
(1, 2, 1, 'How about Saturday at 3 PM at Johar Town market? I can bring the jacket there.', FALSE),

-- Conversation about Story Books (Item ID: 2)
(6, 1, 2, 'Assalam o Alaikum Ali! We are Helping Hands NGO. Can we collect these story books for our community school project?', TRUE),
(1, 6, 2, 'Walaikum Assalam! Yes, absolutely! These books will be perfect for children. When would you like to pick them up?', TRUE),
(6, 1, 2, 'JazakAllah! We can collect them tomorrow evening. Is 6 PM suitable for you?', FALSE),

-- Conversation about Engineering Books (Item ID: 4)
(4, 2, 4, 'Hi Sara! What specific subjects do these engineering books cover? Are there any solution manuals included?', TRUE),
(2, 4, 4, 'Hi Fatima! These cover Software Engineering, Database Systems, and Web Development. Yes, solution manuals are included for 2 books.', TRUE),
(4, 2, 4, 'Perfect! Can you negotiate on the price? My budget is around 4500.', FALSE),

-- Conversation about Rice Donation (Item ID: 7)
(7, 3, 7, 'Hello Ahmed! We are Care Foundation. Can we arrange to collect these rice bags for our food distribution program?', TRUE),
(3, 7, 7, 'Hello! Yes, of course. We would be happy to donate these to your foundation. When can you collect them?', FALSE),

-- General inquiry messages
(5, 1, NULL, 'Hi Ali! I saw your profile and noticed you donate items frequently. Do you have any books suitable for university students?', TRUE),
(1, 5, NULL, 'Hi Usman! I don\'t have university books right now, but I can let you know when I get some. What subjects are you looking for?', FALSE);

-- ============================================
-- Insert Sample Transactions
-- ============================================

INSERT INTO transactions (item_id, seller_id, buyer_id, transaction_type, amount, status, completed_at) VALUES
-- Completed sale of Medical Books
(6, 2, 4, 'sale', 8000.00, 'completed', '2024-12-15 14:30:00'),

-- Pending sale of Winter Jacket
(1, 1, 2, 'sale', 2500.00, 'pending', NULL),

-- Completed donation of Story Books
(2, 1, 6, 'donation', NULL, 'completed', '2024-12-16 18:00:00');

-- ============================================
-- Insert Sample Favorites
-- ============================================

INSERT INTO favorites (user_id, item_id) VALUES
-- Sara's favorites
(2, 7),  -- Rice bags donation
(2, 9),  -- Programming books
(2, 12), -- Winter clothing collection

-- Fatima's favorites
(4, 1),  -- Winter jacket
(4, 8),  -- Formal shirts
(4, 11), -- CS textbooks

-- Ahmed's favorites
(3, 5),  -- Lawn suits
(3, 9),  -- Programming books

-- Usman's favorites
(5, 4),  -- Engineering books
(5, 10), -- Ration package

-- NGO favorites
(6, 3),  -- Kids clothes bundle
(6, 7),  -- Rice bags
(6, 10), -- Ration package
(6, 12), -- Winter clothing

(7, 2),  -- Story books
(7, 3),  -- Kids clothes
(7, 7),  -- Rice bags
(7, 10); -- Ration package

-- ============================================
-- Insert Sample Notifications
-- ============================================

INSERT INTO notifications (user_id, type, title, message, related_id, is_read) VALUES
-- Message notifications
(1, 'message', 'New Message', 'You have a new message from sara_khan about Winter Jacket', 1, FALSE),
(2, 'message', 'New Message', 'You have a new message from ali_ahmed about Winter Jacket', 2, TRUE),
(1, 'message', 'New Message', 'You have a new message from helping_hands_ngo about Story Books', 5, FALSE),

-- Transaction notifications
(2, 'transaction', 'Sale Completed', 'Your Medical Textbooks have been sold to fatima_malik', 1, TRUE),
(4, 'transaction', 'Purchase Completed', 'You have successfully purchased Medical Textbooks from sara_khan', 1, TRUE),
(1, 'transaction', 'Donation Completed', 'Your Story Books donation has been collected by helping_hands_ngo', 3, FALSE),

-- System notifications
(1, 'system', 'Welcome to ShareHub!', 'Thank you for joining our community marketplace. Start listing your items today!', NULL, TRUE),
(2, 'system', 'Profile Verification', 'Your profile has been successfully verified. You can now list items for sale.', NULL, TRUE),
(6, 'ngo_verification', 'NGO Verification Approved', 'Congratulations! Your NGO verification has been approved. You now have access to special features.', NULL, FALSE),
(7, 'ngo_verification', 'NGO Verification Pending', 'Your NGO verification is under review. We will notify you once it is processed.', NULL, FALSE);

-- ============================================
-- Insert NGO Verifications
-- ============================================

INSERT INTO ngo_verifications (user_id, organization_name, registration_number, document_url, verification_status, admin_notes, verified_at) VALUES
-- Approved NGO
(6, 'Helping Hands NGO', 'NGO-LHR-12345-2023', '/uploads/documents/helping_hands_registration.pdf', 'approved', 'All documents verified. Organization is legitimate and actively working in community service.', '2024-12-10 10:30:00'),

-- Pending NGO
(7, 'Care Foundation Pakistan', 'NGO-LHR-67890-2024', '/uploads/documents/care_foundation_docs.pdf', 'pending', NULL, NULL);

-- ============================================
-- Re-enable foreign key checks
-- ============================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Display Success Message with Statistics
-- ============================================
SELECT 'ShareHub Marketplace Sample Data Inserted Successfully!' AS Status;

SELECT 
    'Data Summary' as Info,
    (SELECT COUNT(*) FROM users) AS 'Total Users',
    (SELECT COUNT(*) FROM users WHERE role = 'user') AS 'Regular Users',
    (SELECT COUNT(*) FROM users WHERE role = 'ngo') AS 'NGO Users',
    (SELECT COUNT(*) FROM users WHERE role = 'admin') AS 'Admin Users',
    (SELECT COUNT(*) FROM items) AS 'Total Items',
    (SELECT COUNT(*) FROM items WHERE status = 'available') AS 'Available Items',
    (SELECT COUNT(*) FROM item_images) AS 'Total Images',
    (SELECT COUNT(*) FROM messages) AS 'Total Messages',
    (SELECT COUNT(*) FROM transactions) AS 'Total Transactions',
    (SELECT COUNT(*) FROM favorites) AS 'Total Favorites',
    (SELECT COUNT(*) FROM notifications) AS 'Total Notifications',
    (SELECT COUNT(*) FROM ngo_verifications) AS 'NGO Verifications';

-- ============================================
-- Sample Queries to Test the Data
-- ============================================

-- Test the active_items_view
SELECT 'Testing Active Items View' as Test;
SELECT id, title, owner_name, primary_image, favorites_count FROM active_items_view LIMIT 5;

-- Test the user_stats_view
SELECT 'Testing User Stats View' as Test;
SELECT username, full_name, total_items, active_items, sales_count FROM user_stats_view LIMIT 5;

-- Test nearby items procedure
SELECT 'Testing Nearby Items Procedure' as Test;
CALL GetNearbyItems(31.5204, 74.3587, 10, NULL, NULL);

-- Test user conversations procedure
SELECT 'Testing User Conversations Procedure' as Test;
CALL GetUserConversations(1);