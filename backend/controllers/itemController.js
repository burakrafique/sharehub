const Item = require('../models/Item');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');
const { promisePool: pool } = require('../config/database');

// Create a new item
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      listing_type,
      price,
      item_condition,
      address,
      latitude,
      longitude
    } = req.body;

    // Get user_id from authenticated user
    const user_id = req.user.id;

    // Validate required fields
    if (!title || !description || !category || !listing_type || !item_condition || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate category
    const validCategories = ['clothes', 'books', 'ration'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be clothes, books, or ration'
      });
    }

    // Validate listing_type
    const validListingTypes = ['sell', 'donate', 'exchange'];
    if (!validListingTypes.includes(listing_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing type. Must be sell, donate, or exchange'
      });
    }

    // Create item
    const itemData = {
      user_id,
      title,
      description,
      category,
      listing_type,
      price: listing_type === 'sell' ? price : null,
      item_condition,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    const newItem = await Item.create(itemData);

    // Save uploaded images to item_images table
    if (req.files && req.files.length > 0) {
      const imageInserts = req.files.map(file => {
        const imageUrl = `/uploads/items/${file.filename}`;
        return pool.execute(
          'INSERT INTO item_images (item_id, image_url) VALUES (?, ?)',
          [newItem.insertId, imageUrl]
        );
      });

      await Promise.all(imageInserts);
    }

    // Fetch complete item with images
    const completeItem = await Item.findById(newItem.insertId);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: completeItem
    });
  } catch (error) {
    next(error);
  }
};

// Get all items with optional filters
const getAllItems = async (req, res, next) => {
  try {
    const { category, listing_type, status, search } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (listing_type) filters.listing_type = listing_type;
    if (status) filters.status = status;
    if (search) filters.search = search;

    const items = await Item.findAll(filters);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get single item by ID
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Update item
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is owner
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Update item
    const updatedItem = await Item.update(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

// Delete item
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is owner
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    // Delete image files from filesystem
    if (item.images && item.images.length > 0) {
      item.images.forEach(image => {
        const filePath = path.join(__dirname, '..', image.image_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete item from database (CASCADE will delete images from item_images table)
    await Item.delete(id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get nearby items based on location
const getNearbyItems = async (req, res, next) => {
  try {
    const { latitude, longitude, radius } = req.query;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const searchRadius = radius ? parseFloat(radius) : 10;

    // Validate coordinate values
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const items = await Item.findNearby(lat, lng, searchRadius);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get items by user
const getUserItems = async (req, res, next) => {
  try {
    // Get userId from params or use authenticated user's id
    const userId = req.params.userId || req.user.id;

    const items = await Item.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Delete item image
const deleteItemImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    // Get image details
    const [images] = await pool.execute(
      'SELECT item_images.*, items.user_id FROM item_images INNER JOIN items ON item_images.item_id = items.id WHERE item_images.id = ?',
      [imageId]
    );

    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = images[0];

    // Check if user is owner
    if (image.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this image'
      });
    }

    // Delete image file from filesystem
    const filePath = path.join(__dirname, '..', image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.execute('DELETE FROM item_images WHERE id = ?', [imageId]);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Set primary image for item
const setPrimaryImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    // Get image details
    const [images] = await pool.execute(
      'SELECT item_images.*, items.user_id FROM item_images INNER JOIN items ON item_images.item_id = items.id WHERE item_images.id = ?',
      [imageId]
    );

    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = images[0];

    // Check if user is owner
    if (image.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this image'
      });
    }

    // Set all images for this item to is_primary = false
    await pool.execute(
      'UPDATE item_images SET is_primary = false WHERE item_id = ?',
      [image.item_id]
    );

    // Set this image as primary
    await pool.execute(
      'UPDATE item_images SET is_primary = true WHERE id = ?',
      [imageId]
    );

    res.status(200).json({
      success: true,
      message: 'Primary image updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Advanced search with filters and sorting
const advancedSearch = async (req, res, next) => {
  try {
    const {
      category,
      listing_type,
      min_price,
      max_price,
      condition,
      sort_by,
      order,
      search
    } = req.query;

    let query = `
      SELECT 
        items.*,
        users.name as owner_name,
        users.phone as owner_phone
      FROM items
      INNER JOIN users ON items.user_id = users.id
      WHERE items.status = 'available'
    `;

    const params = [];

    // Apply category filter
    if (category) {
      query += ' AND items.category = ?';
      params.push(category);
    }

    // Apply listing_type filter
    if (listing_type) {
      query += ' AND items.listing_type = ?';
      params.push(listing_type);
    }

    // Apply price range filter
    if (min_price) {
      query += ' AND items.price >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      query += ' AND items.price <= ?';
      params.push(parseFloat(max_price));
    }

    // Apply condition filter
    if (condition) {
      query += ' AND items.item_condition = ?';
      params.push(condition);
    }

    // Apply search filter (title and description)
    if (search) {
      query += ' AND (items.title LIKE ? OR items.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Apply sorting
    const validSortFields = ['price', 'created_at', 'title'];
    const validOrders = ['ASC', 'DESC'];

    let sortField = 'created_at';
    let sortOrder = 'DESC';

    if (sort_by && validSortFields.includes(sort_by)) {
      sortField = sort_by;
    }

    if (order && validOrders.includes(order.toUpperCase())) {
      sortOrder = order.toUpperCase();
    }

    query += ` ORDER BY items.${sortField} ${sortOrder}`;

    const [items] = await pool.execute(query, params);

    res.status(200).json({
      success: true,
      count: items.length,
      filters: {
        category,
        listing_type,
        min_price,
        max_price,
        condition,
        search,
        sort_by: sortField,
        order: sortOrder
      },
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Update item status
const updateItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, buyer_id } = req.body;

    // Validate status
    const validStatuses = ['available', 'pending', 'sold', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be available, pending, sold, or completed'
      });
    }

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is owner
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item status'
      });
    }

    // If status is completed, create transaction automatically
    if (status === 'completed' || status === 'sold') {
      if (!buyer_id) {
        return res.status(400).json({
          success: false,
          message: 'buyer_id is required when marking item as completed/sold'
        });
      }

      // Check if buyer exists
      const buyer = await User.findById(buyer_id);
      if (!buyer) {
        return res.status(404).json({
          success: false,
          message: 'Buyer not found'
        });
      }

      // Create transaction
      const transactionData = {
        item_id: id,
        seller_id: item.user_id,
        buyer_id: buyer_id,
        transaction_type: item.listing_type,
        amount: item.price || 0
      };

      await Transaction.create(transactionData);

      // Update transaction status to completed
      const [transactions] = await pool.execute(
        'SELECT id FROM transactions WHERE item_id = ? ORDER BY created_at DESC LIMIT 1',
        [id]
      );

      if (transactions.length > 0) {
        await Transaction.updateStatus(transactions[0].id, 'completed', item.user_id);
      }
    }

    // Update item status
    const updatedItem = await Item.update(id, { status });

    res.status(200).json({
      success: true,
      message: 'Item status updated successfully',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

// Get featured items
const getFeaturedItems = async (req, res, next) => {
  try {
    const limit = req.query.limit || 6;
    
    const [items] = await pool.execute(`
      SELECT 
        items.*,
        users.name as owner_name,
        users.phone as owner_phone,
        GROUP_CONCAT(item_images.image_url) as images
      FROM items
      INNER JOIN users ON items.user_id = users.id
      LEFT JOIN item_images ON items.id = item_images.item_id
      WHERE items.status = 'available'
      GROUP BY items.id
      ORDER BY items.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    // Process images for each item
    const processedItems = items.map(item => ({
      ...item,
      images: item.images ? item.images.split(',') : []
    }));

    res.status(200).json({
      success: true,
      count: processedItems.length,
      data: processedItems
    });
  } catch (error) {
    next(error);
  }
};

// Get premium items
const getPremiumItems = async (req, res, next) => {
  try {
    const limit = req.query.limit || 4;
    
    const [items] = await pool.execute(`
      SELECT 
        items.*,
        users.name as owner_name,
        users.phone as owner_phone,
        GROUP_CONCAT(item_images.image_url) as images
      FROM items
      INNER JOIN users ON items.user_id = users.id
      LEFT JOIN item_images ON items.id = item_images.item_id
      WHERE items.status = 'available' AND items.is_premium = true
      GROUP BY items.id
      ORDER BY items.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    // Process images for each item
    const processedItems = items.map(item => ({
      ...item,
      images: item.images ? item.images.split(',') : []
    }));

    res.status(200).json({
      success: true,
      count: processedItems.length,
      data: processedItems
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getNearbyItems,
  getUserItems,
  deleteItemImage,
  setPrimaryImage,
  advancedSearch,
  updateItemStatus,
  getFeaturedItems,
  getPremiumItems
};
