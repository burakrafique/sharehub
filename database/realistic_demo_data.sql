-- ============================================
-- ShareHub Realistic Pakistani Demo Data
-- Items that Pakistani users would actually list
-- ============================================

USE sharehub;

-- ============================================
-- Insert Realistic Pakistani Items
-- ============================================

INSERT INTO items (user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, status) VALUES

-- ============================================
-- CLOTHES - Pakistani Fashion
-- ============================================

-- Traditional Wear
(1, 'Unstitched Lawn Suit 3-Piece', 'Beautiful Khaadi lawn suit with chiffon dupatta. Floral print, perfect for summer. Never used.', 'clothes', 'sell', 4500.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Mens Kurta Shalwar White', 'Pure cotton kurta shalwar for Eid and special occasions. Size L, excellent condition.', 'clothes', 'sell', 3200.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Bridal Lehenga Red', 'Heavy work bridal lehenga in red with gold embroidery. Worn once, perfect for weddings.', 'clothes', 'sell', 35000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Mens Sherwani Cream', 'Designer sherwani with churidar and kulla. Perfect for groom or special occasions.', 'clothes', 'sell', 18000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Womens Abaya Black', 'Modest black abaya with beautiful embroidery. Size M, perfect for daily wear.', 'clothes', 'sell', 2800.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),

-- Western Wear
(2, 'Jeans Collection Branded', '3 pairs of branded jeans - Levis, Lee, Wrangler. Size 32, excellent condition.', 'clothes', 'sell', 8500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Formal Shirts Office', '5 formal shirts for office wear. Different colors, size M. Dry cleaned and pressed.', 'clothes', 'sell', 4500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Designer Handbags', 'Collection of 3 designer handbags - Coach, Michael Kors style. Excellent condition.', 'clothes', 'sell', 12000.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Donation Clothes
(1, 'Winter Clothes for Poor', 'Warm jackets, sweaters, and blankets for underprivileged families. Clean and ready to donate.', 'clothes', 'donate', 0.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'School Uniforms', 'Various school uniforms for different schools. Sizes for ages 8-15. Good for needy students.', 'clothes', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- ============================================
-- BOOKS - Pakistani Education & Literature
-- ============================================

-- Educational Books
(1, 'Matric Books Complete Set', 'Complete set of 10th class books for all subjects. Punjab Board. Excellent condition.', 'books', 'sell', 3500.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'FSc Pre-Medical Books', 'Complete FSc Pre-Medical books - Physics, Chemistry, Biology, Math. Well maintained.', 'books', 'sell', 6500.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'CSS Preparation Books', 'Complete CSS exam preparation books including Past Papers and guides. Latest edition.', 'books', 'sell', 8500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'IELTS Preparation Kit', 'Complete IELTS preparation books with CDs. Cambridge and British Council materials.', 'books', 'sell', 4500.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Religious Books
(1, 'Quran Majeed with Tafseer', 'Beautiful Quran with Urdu translation and tafseer. Large print, perfect for reading.', 'books', 'donate', 0.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Islamic Books Collection', 'Collection of Islamic books including Seerat, Hadith, and Fiqh books in Urdu.', 'books', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- Literature
(4, 'Urdu Novels Collection', 'Famous Urdu novels by Umera Ahmed, Nimra Ahmed, and other popular writers.', 'books', 'sell', 2500.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Poetry Books Urdu', 'Collection of Urdu poetry books including Allama Iqbal, Faiz, and Ghalib.', 'books', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- ============================================
-- RATION - Pakistani Food Items
-- ============================================

-- Staple Foods
(1, 'Basmati Rice 20kg Sella', 'Premium Sella Basmati rice, perfect for biryani and pulao. Fresh stock.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Atta Chakki Fresh 20kg', 'Fresh chakki atta for making rotis. High quality wheat flour.', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Cooking Oil Dalda 5L', 'Pure cooking oil for healthy cooking. Sealed pack, perfect for families.', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Sugar White 10kg', 'Pure white sugar for daily use. Fresh stock, perfect for tea and cooking.', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Spices and Condiments
(1, 'Desi Ghee Pure 2kg', 'Pure desi ghee made from cow milk. Perfect for traditional cooking.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Masala Collection', 'Complete spice collection including garam masala, red chili, turmeric, and coriander.', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Tea Tapal Danedar 1kg', 'Premium tea leaves for making perfect chai. Fresh and aromatic.', 'ration', 'donate', 0.00, 'new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Fresh Produce
(5, 'Onions Fresh 10kg', 'Fresh onions for daily cooking. Good quality, perfect for Pakistani dishes.', 'ration', 'donate', 0.00, 'new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Potatoes Fresh 15kg', 'Fresh potatoes for making aloo dishes. Good quality, washed and ready to use.', 'ration', 'donate', 0.00, 'new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Tomatoes Fresh 5kg', 'Fresh red tomatoes for cooking. Perfect for making Pakistani curries.', 'ration', 'donate', 0.00, 'new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- ============================================
-- ELECTRONICS - Popular in Pakistan
-- ============================================

-- Mobile Phones
(1, 'Samsung Galaxy A54', 'Samsung Galaxy A54 5G, 128GB, Awesome Blue. 6 months old, excellent condition with box.', 'electronics', 'sell', 65000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'iPhone 13 128GB', 'iPhone 13 in Midnight color, 128GB storage. Battery health 94%. Includes charger and case.', 'electronics', 'sell', 125000.00, 'like_new', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Xiaomi Redmi Note 12', 'Redmi Note 12 Pro, 8GB RAM, 128GB storage. Perfect condition, used for 3 months only.', 'electronics', 'sell', 45000.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Home Appliances
(5, 'Haier Washing Machine', 'Haier 7kg automatic washing machine. 2 years old, excellent working condition.', 'electronics', 'sell', 35000.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Orient Room Cooler', 'Orient room cooler, perfect for summer. 1 year old, excellent cooling performance.', 'electronics', 'sell', 18000.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Dawlance Refrigerator', 'Dawlance 14 cubic feet refrigerator. Energy efficient, excellent condition.', 'electronics', 'sell', 45000.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- Electronics for Donation
(4, 'Old Mobile Phones', 'Collection of working mobile phones for students or emergency use. Basic smartphones.', 'electronics', 'donate', 0.00, 'fair', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Computer Parts', 'Old computer parts including keyboards, mice, and cables. Good for students.', 'electronics', 'donate', 0.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available');

-- ============================================
-- Insert Images for Realistic Items
-- ============================================

INSERT INTO item_images (item_id, image_url, is_primary) VALUES

-- Traditional Clothes
(235, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=500&fit=crop', TRUE),
(236, 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=500&h=500&fit=crop', TRUE),
(237, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop', TRUE),
(238, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop', TRUE),
(239, 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=500&h=500&fit=crop', TRUE),

-- Western Clothes
(240, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', TRUE),
(241, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=500&fit=crop', TRUE),
(242, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop', TRUE),

-- Educational Books
(243, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop', TRUE),
(244, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop', TRUE),
(245, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', TRUE),
(246, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', TRUE),

-- Religious Books
(247, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop&q=80', TRUE),
(248, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop&q=80', TRUE),

-- Literature
(249, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop', TRUE),
(250, 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&h=500&fit=crop', TRUE),

-- Ration Items
(251, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', TRUE), -- Rice
(252, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', TRUE), -- Flour
(253, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop', TRUE), -- Cooking Oil
(254, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', TRUE), -- Sugar
(255, 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&h=500&fit=crop', TRUE), -- Ghee
(256, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop', TRUE), -- Spices
(257, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=500&fit=crop', TRUE), -- Tea
(258, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=500&fit=crop', TRUE), -- Onions
(259, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&h=500&fit=crop', TRUE), -- Potatoes
(260, 'https://images.unsplash.com/photo-1546470427-e5380e0e8b5a?w=500&h=500&fit=crop', TRUE), -- Tomatoes

-- Electronics
(261, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', TRUE), -- Samsung Phone
(262, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&h=500&fit=crop', TRUE), -- iPhone
(263, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop', TRUE), -- Xiaomi
(264, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', TRUE), -- Washing Machine
(265, 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=500&fit=crop', TRUE), -- Room Cooler
(266, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop', TRUE), -- Refrigerator
(267, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop', TRUE), -- Old Phones
(268, 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop', TRUE); -- Computer Parts

-- ============================================
-- Additional Popular Items
-- ============================================

INSERT INTO items (user_id, title, description, category, listing_type, price, item_condition, address, latitude, longitude, status) VALUES

-- Popular Electronics
(1, 'Honda Motorcycle 125cc', 'Honda CG 125 in excellent condition. Regular maintenance, new tires. Perfect for daily commute.', 'other', 'sell', 185000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Rickshaw Auto Parts', 'Collection of rickshaw spare parts including engine parts and body accessories.', 'other', 'sell', 8500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),
(4, 'Sewing Machine Singer', 'Singer sewing machine in working condition. Perfect for home tailoring business.', 'other', 'sell', 12000.00, 'good', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),

-- Household Items
(5, 'Crockery Set Complete', 'Complete dinner set for 12 people. Includes plates, bowls, cups, and serving dishes.', 'other', 'sell', 6500.00, 'like_new', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),
(1, 'Carpet Persian Style', 'Beautiful Persian style carpet, 8x10 feet. Perfect for living room or drawing room.', 'other', 'sell', 25000.00, 'good', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Kitchen Utensils Set', 'Complete kitchen utensils including pots, pans, and cooking tools. Stainless steel.', 'other', 'donate', 0.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available'),

-- Sports and Recreation
(4, 'Cricket Kit Complete', 'Complete cricket kit with bat, pads, gloves, and helmet. Perfect for cricket enthusiasts.', 'other', 'sell', 8500.00, 'like_new', 'Gulberg III, Lahore', 31.5204, 74.3587, 'available'),
(5, 'Badminton Rackets', 'Pair of Yonex badminton rackets with shuttlecocks. Great for family recreation.', 'other', 'sell', 4500.00, 'good', 'Bahria Town, Lahore', 31.3375, 74.2111, 'available'),

-- Children Items
(1, 'Baby Stroller', 'Comfortable baby stroller with safety features. Perfect for walks and outings with baby.', 'other', 'sell', 8500.00, 'like_new', 'Johar Town, Lahore', 31.4697, 74.2728, 'available'),
(2, 'Kids Bicycle', 'Colorful kids bicycle with training wheels. Perfect for children aged 5-8 years.', 'other', 'sell', 5500.00, 'good', 'DHA Phase 5, Lahore', 31.4742, 74.4064, 'available');

-- ============================================
-- Insert Images for Additional Items
-- ============================================

INSERT INTO item_images (item_id, image_url, is_primary) VALUES

-- Additional Items Images
(269, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', TRUE), -- Motorcycle
(270, 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop', TRUE), -- Auto Parts
(271, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center', TRUE), -- Sewing Machine
(272, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop', TRUE), -- Crockery
(273, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop', TRUE), -- Carpet
(274, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', TRUE), -- Kitchen Utensils
(275, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=500&fit=crop', TRUE), -- Cricket Kit
(276, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop', TRUE), -- Badminton
(277, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop', TRUE), -- Baby Stroller
(278, 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500&h=500&fit=crop', TRUE); -- Kids Bicycle

-- ============================================
-- Success Message
-- ============================================
SELECT 'Realistic Pakistani demo items added successfully!' AS Status;
SELECT 
    category,
    listing_type,
    COUNT(*) as count,
    AVG(CASE WHEN price > 0 THEN price ELSE NULL END) as avg_price
FROM items 
WHERE id > 200
GROUP BY category, listing_type 
ORDER BY category, listing_type;