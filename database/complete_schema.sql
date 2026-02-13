-- ============================================
-- ShareHub Marketplace Platform - Complete Database Schema
-- MySQL Version 8.0+
-- Created: December 2024
-- ============================================

-- Drop existing database if exists (CAREFUL!)
-- DROP DATABASE IF EXISTS sharehub_marketplace;

-- Create Database
CREATE DATABASE IF NOT EXISTS sharehub_marketplace;
USE sharehub_marketplace;

-- Set charset and collation for better Unicode support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- Table 1: Users Table
-- Stores user accounts, NGOs, and admin information
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    profile_image VARCHAR(255),
    role ENUM('user', 'ngo', 'admin') DEFAULT 'user' NOT NULL,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance optimization
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_location (location_latitude, location_longitude),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 2: Items Table
-- Stores all marketplace items
-- ============================================
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('clothes', 'books', 'ration') NOT NULL,
    listing_type ENUM('sell', 'donate', 'swap') NOT NULL,
    condition_status ENUM('new', 'like_new', 'good', 'fair', 'poor') DEFAULT 'good',
    price DECIMAL(10, 2) NULL,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    address TEXT,
    status ENUM('available', 'sold', 'donated', 'swapped') DEFAULT 'available',
    views_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_listing_type (listing_type),
    INDEX idx_condition_status (condition_status),
    INDEX idx_status (status),
    INDEX idx_location (location_latitude, location_longitude),
    INDEX idx_price (price),
    INDEX idx_views_count (views_count),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    
    -- Composite indexes for common queries
    INDEX idx_category_status (category, status),
    INDEX idx_listing_type_status (listing_type, status),
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 3: Item Images Table
-- Stores multiple images for each item
-- ============================================
CREATE TABLE item_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_item_id (item_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 4: Transactions Table
-- Tracks all marketplace transactions
-- ============================================
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    transaction_type ENUM('sale', 'donation', 'swap') NOT NULL,
    amount DECIMAL(10, 2) NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_item_id (item_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_completed_at (completed_at),
    
    -- Composite indexes
    INDEX idx_seller_status (seller_id, status),
    INDEX idx_buyer_status (buyer_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 5: Messages Table
-- Enables communication between users
-- ============================================
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    item_id INT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_item_id (item_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    
    -- Composite indexes for conversation queries
    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_receiver_unread (receiver_id, is_read),
    INDEX idx_item_participants (item_id, sender_id, receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 6: Favorites Table
-- Stores user's bookmarked items
-- ============================================
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint to prevent duplicate favorites
    UNIQUE KEY unique_user_item (user_id, item_id),
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_item_id (item_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 7: Notifications Table
-- Stores user notifications
-- ============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('message', 'transaction', 'system', 'ngo_verification') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_related_id (related_id),
    
    -- Composite indexes
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_user_type (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 8: NGO Verifications Table
-- Stores NGO verification information
-- ============================================
CREATE TABLE ngo_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    organization_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_verification_status (verification_status),
    INDEX idx_registration_number (registration_number),
    INDEX idx_created_at (created_at),
    INDEX idx_verified_at (verified_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Additional Indexes for Complex Queries
-- ============================================

-- Location-based search optimization
CREATE INDEX idx_items_location_status ON items(location_latitude, location_longitude, status);
CREATE INDEX idx_users_location_active ON users(location_latitude, location_longitude, is_active);

-- Full-text search indexes for better search performance
ALTER TABLE items ADD FULLTEXT(title, description);
ALTER TABLE users ADD FULLTEXT(full_name, username);

-- ============================================
-- Views for Common Queries
-- ============================================

-- View for active items with owner information
CREATE VIEW active_items_view AS
SELECT 
    i.*,
    u.username as owner_username,
    u.full_name as owner_name,
    u.phone_number as owner_phone,
    u.profile_image as owner_image,
    (SELECT image_url FROM item_images WHERE item_id = i.id AND is_primary = TRUE LIMIT 1) as primary_image,
    (SELECT COUNT(*) FROM item_images WHERE item_id = i.id) as image_count,
    (SELECT COUNT(*) FROM favorites WHERE item_id = i.id) as favorites_count
FROM items i
INNER JOIN users u ON i.user_id = u.id
WHERE i.is_active = TRUE AND u.is_active = TRUE;

-- View for user statistics
CREATE VIEW user_stats_view AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.role,
    COUNT(DISTINCT i.id) as total_items,
    COUNT(DISTINCT CASE WHEN i.status = 'available' THEN i.id END) as active_items,
    COUNT(DISTINCT t1.id) as sales_count,
    COUNT(DISTINCT t2.id) as purchases_count,
    COUNT(DISTINCT f.id) as favorites_count,
    u.created_at
FROM users u
LEFT JOIN items i ON u.id = i.user_id AND i.is_active = TRUE
LEFT JOIN transactions t1 ON u.id = t1.seller_id AND t1.status = 'completed'
LEFT JOIN transactions t2 ON u.id = t2.buyer_id AND t2.status = 'completed'
LEFT JOIN favorites f ON u.id = f.user_id
WHERE u.is_active = TRUE
GROUP BY u.id;

-- ============================================
-- Triggers for Automated Operations
-- ============================================

-- Trigger to update item status when transaction is completed
DELIMITER //
CREATE TRIGGER update_item_status_on_transaction
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE items 
        SET status = CASE 
            WHEN NEW.transaction_type = 'sale' THEN 'sold'
            WHEN NEW.transaction_type = 'donation' THEN 'donated'
            WHEN NEW.transaction_type = 'swap' THEN 'swapped'
        END,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.item_id;
    END IF;
END//
DELIMITER ;

-- Trigger to create notification when message is sent
DELIMITER //
CREATE TRIGGER create_message_notification
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    INSERT INTO notifications (user_id, type, title, message, related_id)
    VALUES (
        NEW.receiver_id,
        'message',
        'New Message',
        CONCAT('You have a new message from ', (SELECT username FROM users WHERE id = NEW.sender_id)),
        NEW.id
    );
END//
DELIMITER ;

-- Trigger to increment views count
DELIMITER //
CREATE TRIGGER increment_item_views
AFTER INSERT ON item_images
FOR EACH ROW
BEGIN
    -- This is a placeholder - in real application, views would be tracked differently
    UPDATE items SET views_count = views_count + 1 WHERE id = NEW.item_id;
END//
DELIMITER ;

-- ============================================
-- Stored Procedures for Complex Operations
-- ============================================

-- Procedure to get nearby items using Haversine formula
DELIMITER //
CREATE PROCEDURE GetNearbyItems(
    IN user_lat DECIMAL(10,8),
    IN user_lng DECIMAL(11,8),
    IN radius_km INT,
    IN item_category VARCHAR(50),
    IN listing_type_filter VARCHAR(50)
)
BEGIN
    SELECT 
        i.*,
        u.username as owner_username,
        u.full_name as owner_name,
        u.phone_number as owner_phone,
        (6371 * acos(
            cos(radians(user_lat)) * cos(radians(i.location_latitude)) *
            cos(radians(i.location_longitude) - radians(user_lng)) +
            sin(radians(user_lat)) * sin(radians(i.location_latitude))
        )) AS distance_km
    FROM items i
    INNER JOIN users u ON i.user_id = u.id
    WHERE i.is_active = TRUE 
        AND u.is_active = TRUE
        AND i.status = 'available'
        AND (item_category IS NULL OR i.category = item_category)
        AND (listing_type_filter IS NULL OR i.listing_type = listing_type_filter)
    HAVING distance_km <= radius_km
    ORDER BY distance_km ASC;
END//
DELIMITER ;

-- Procedure to get user conversation threads
DELIMITER //
CREATE PROCEDURE GetUserConversations(IN user_id_param INT)
BEGIN
    SELECT 
        CASE 
            WHEN m.sender_id = user_id_param THEN m.receiver_id 
            ELSE m.sender_id 
        END as other_user_id,
        u.username as other_username,
        u.full_name as other_name,
        u.profile_image as other_image,
        m.item_id,
        i.title as item_title,
        MAX(m.created_at) as last_message_time,
        COUNT(CASE WHEN m.receiver_id = user_id_param AND m.is_read = FALSE THEN 1 END) as unread_count,
        (SELECT message_text FROM messages 
         WHERE (sender_id = user_id_param AND receiver_id = other_user_id) 
            OR (sender_id = other_user_id AND receiver_id = user_id_param)
         ORDER BY created_at DESC LIMIT 1) as last_message
    FROM messages m
    INNER JOIN users u ON (
        CASE 
            WHEN m.sender_id = user_id_param THEN m.receiver_id 
            ELSE m.sender_id 
        END = u.id
    )
    LEFT JOIN items i ON m.item_id = i.id
    WHERE m.sender_id = user_id_param OR m.receiver_id = user_id_param
    GROUP BY other_user_id, m.item_id
    ORDER BY last_message_time DESC;
END//
DELIMITER ;

-- ============================================
-- Success Message
-- ============================================
SELECT 'ShareHub Marketplace Database Schema Created Successfully!' AS Status;
SELECT 'Total Tables: 8, Views: 2, Triggers: 3, Procedures: 2' AS Summary;