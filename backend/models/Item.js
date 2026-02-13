const { promisePool: pool } = require('../config/database');

const Item = {
  // ============================================
  // CORE ITEM METHODS
  // ============================================
  
  // Create a new item
  async createItem(itemData) {
    const {
      user_id,
      title,
      description,
      category,
      listing_type,
      price,
      item_condition,
      address,
      latitude,
      longitude
    } = itemData;

    const query = `
      INSERT INTO items (
        user_id, title, description, category, listing_type, 
        price, item_condition, address, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      user_id,
      title,
      description,
      category,
      listing_type,
      price || null,
      item_condition,
      address,
      latitude,
      longitude
    ]);

    return {
      insertId: result.insertId,
      ...itemData
    };
  },

  // Find all items with pagination, filtering, and sorting
  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 12,
      category,
      listing_type,
      condition,
      min_price,
      max_price,
      status = 'available',
      user_id,
      sortBy = 'created_at',
      order = 'DESC'
    } = filters;

    let query = `
      SELECT 
        items.*,
        users.full_name as owner_name,
        users.phone_number as owner_phone,
        users.email as owner_email,
        (SELECT image_url FROM item_images WHERE item_id = items.id ORDER BY is_primary DESC, uploaded_at ASC LIMIT 1) as primary_image
      FROM items
      INNER JOIN users ON items.user_id = users.id
      WHERE 1=1
    `;

    const params = [];
    const countParams = [];

    // Apply filters
    if (category) {
      query += ' AND items.category = ?';
      params.push(category);
      countParams.push(category);
    }

    if (listing_type) {
      query += ' AND items.listing_type = ?';
      params.push(listing_type);
      countParams.push(listing_type);
    }

    if (condition) {
      query += ' AND items.item_condition = ?';
      params.push(condition);
      countParams.push(condition);
    }

    if (min_price) {
      query += ' AND items.price >= ?';
      params.push(parseFloat(min_price));
      countParams.push(parseFloat(min_price));
    }

    if (max_price) {
      query += ' AND items.price <= ?';
      params.push(parseFloat(max_price));
      countParams.push(parseFloat(max_price));
    }

    if (status) {
      query += ' AND items.status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (user_id) {
      query += ' AND items.user_id = ?';
      params.push(user_id);
      countParams.push(user_id);
    }

    // Apply search filter
    if (filters.search) {
      query += ' AND (items.title LIKE ? OR items.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    // Get total count for pagination
    let countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM'
    );
    countQuery = countQuery.replace(/ORDER BY[\s\S]*$/, '');
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Apply sorting
    const validSortFields = ['created_at', 'price', 'views_count', 'title'];
    const validOrders = ['ASC', 'DESC'];

    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    query += ` ORDER BY items.${sortField} ${sortOrder}`;

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [items] = await pool.execute(query, params);

    return {
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  // Find item by ID with owner and images
  async findById(id) {
    // Get item with owner info
    const itemQuery = `
      SELECT 
        items.*,
        users.name as owner_name,
        users.phone as owner_phone,
        users.email as owner_email
      FROM items
      INNER JOIN users ON items.user_id = users.id
      WHERE items.id = ?
    `;

    const [items] = await pool.execute(itemQuery, [id]);

    if (items.length === 0) {
      return null;
    }

    const item = items[0];

    // Get all images for this item
    const imagesQuery = `
      SELECT id, image_url, uploaded_at as created_at
      FROM item_images
      WHERE item_id = ?
      ORDER BY uploaded_at ASC
    `;

    const [images] = await pool.execute(imagesQuery, [id]);
    item.images = images;

    return item;
  },

  // Find nearby items using Haversine formula
  // Haversine formula calculates the great-circle distance between two points
  // on a sphere given their longitudes and latitudes
  // Formula: a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
  //          c = 2 ⋅ atan2(√a, √(1−a))
  //          d = R ⋅ c (where R is earth's radius)
  async findNearby(latitude, longitude, radius = 10) {
    const query = `
      SELECT 
        items.*,
        users.name as owner_name,
        users.phone as owner_phone,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(items.latitude)) *
            cos(radians(items.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(items.latitude))
          )
        ) AS distance
      FROM items
      INNER JOIN users ON items.user_id = users.id
      WHERE items.status = 'available'
      HAVING distance <= ?
      ORDER BY distance ASC
    `;

    const [items] = await pool.execute(query, [
      latitude,
      longitude,
      latitude,
      radius
    ]);

    return items;
  },

  // Update item by ID
  async updateItem(id, itemData) {
    const allowedFields = [
      'title',
      'description',
      'price',
      'item_condition',
      'address',
      'latitude',
      'longitude',
      'status'
    ];

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query based on provided fields
    Object.keys(itemData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        params.push(itemData[key]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id);

    const query = `
      UPDATE items 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Delete item by ID
  async deleteItem(id) {
    const query = 'DELETE FROM items WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    return result.affectedRows > 0;
  },

  // Find all items by user ID
  async findByUserId(userId) {
    const query = `
      SELECT 
        items.*,
        (SELECT image_url FROM item_images WHERE item_id = items.id ORDER BY is_primary DESC, uploaded_at ASC LIMIT 1) as primary_image
      FROM items
      WHERE items.user_id = ?
      ORDER BY items.created_at DESC
    `;

    const [items] = await pool.execute(query, [userId]);
    return items;
  },

  // ============================================
  // STATUS AND VIEWS METHODS
  // ============================================

  // Update item status
  async updateStatus(id, status) {
    const validStatuses = ['available', 'pending', 'sold', 'donated', 'swapped', 'completed'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const query = 'UPDATE items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await pool.execute(query, [status, id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Increment views count
  async incrementViews(id) {
    const query = 'UPDATE items SET views_count = views_count + 1 WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  },

  // ============================================
  // SEARCH METHODS
  // ============================================

  // Search items with text and location
  async searchItems(searchQuery, location = null, radius = 10) {
    let query = `
      SELECT 
        items.*,
        users.full_name as owner_name,
        users.phone_number as owner_phone,
        (SELECT image_url FROM item_images WHERE item_id = items.id ORDER BY is_primary DESC, uploaded_at ASC LIMIT 1) as primary_image
    `;

    // Add distance calculation if location provided
    if (location && location.latitude && location.longitude) {
      query += `,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(items.latitude)) *
            cos(radians(items.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(items.latitude))
          )
        ) AS distance
      `;
    }

    query += `
      FROM items
      INNER JOIN users ON items.user_id = users.id
      WHERE items.status = 'available'
    `;

    const params = [];

    // Add location parameters if provided
    if (location && location.latitude && location.longitude) {
      params.push(location.latitude, location.longitude, location.latitude);
    }

    // Add text search
    if (searchQuery) {
      query += ' AND (items.title LIKE ? OR items.description LIKE ? OR items.category LIKE ?)';
      const searchTerm = `%${searchQuery}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add location filtering
    if (location && location.latitude && location.longitude) {
      query += ' HAVING distance <= ?';
      params.push(radius);
      query += ' ORDER BY distance ASC, items.created_at DESC';
    } else {
      query += ' ORDER BY items.created_at DESC';
    }

    const [items] = await pool.execute(query, params);
    return items;
  },

  // ============================================
  // IMAGE MANAGEMENT METHODS
  // ============================================

  // Add multiple images to an item
  async addImages(itemId, imageUrls) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return [];
    }

    const insertPromises = imageUrls.map((imageUrl, index) => {
      const isPrimary = index === 0; // First image is primary by default
      return pool.execute(
        'INSERT INTO item_images (item_id, image_url, is_primary) VALUES (?, ?, ?)',
        [itemId, imageUrl, isPrimary]
      );
    });

    await Promise.all(insertPromises);

    // Return the inserted images
    return this.getImages(itemId);
  },

  // Get all images for an item
  async getImages(itemId) {
    const query = `
      SELECT id, item_id, image_url, is_primary, uploaded_at
      FROM item_images
      WHERE item_id = ?
      ORDER BY is_primary DESC, uploaded_at ASC
    `;

    const [images] = await pool.execute(query, [itemId]);
    return images;
  },

  // Delete a single image
  async deleteImage(imageId) {
    const query = 'DELETE FROM item_images WHERE id = ?';
    const [result] = await pool.execute(query, [imageId]);
    return result.affectedRows > 0;
  },

  // Set an image as primary
  async setPrimaryImage(imageId) {
    // First, get the item_id for this image
    const [images] = await pool.execute(
      'SELECT item_id FROM item_images WHERE id = ?',
      [imageId]
    );

    if (images.length === 0) {
      return false;
    }

    const itemId = images[0].item_id;

    // Set all images for this item to not primary
    await pool.execute(
      'UPDATE item_images SET is_primary = false WHERE item_id = ?',
      [itemId]
    );

    // Set the specified image as primary
    const [result] = await pool.execute(
      'UPDATE item_images SET is_primary = true WHERE id = ?',
      [imageId]
    );

    return result.affectedRows > 0;
  }
};

module.exports = Item;
