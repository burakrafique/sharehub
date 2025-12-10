const { promisePool: pool } = require('../config/database');

const Item = {
  // Create a new item
  async create(itemData) {
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

  // Find all items with optional filters
  async findAll(filters = {}) {
    let query = `
      SELECT 
        items.*,
        users.name as owner_name,
        users.phone as owner_phone
      FROM items
      INNER JOIN users ON items.user_id = users.id
      WHERE 1=1
    `;

    const params = [];

    // Apply category filter
    if (filters.category) {
      query += ' AND items.category = ?';
      params.push(filters.category);
    }

    // Apply listing_type filter
    if (filters.listing_type) {
      query += ' AND items.listing_type = ?';
      params.push(filters.listing_type);
    }

    // Apply status filter
    if (filters.status) {
      query += ' AND items.status = ?';
      params.push(filters.status);
    }

    // Apply search filter (searches in title and description)
    if (filters.search) {
      query += ' AND (items.title LIKE ? OR items.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY items.created_at DESC';

    const [items] = await pool.execute(query, params);
    return items;
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
      SELECT id, image_url, created_at
      FROM item_images
      WHERE item_id = ?
      ORDER BY created_at ASC
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
  async update(id, itemData) {
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
  async delete(id) {
    const query = 'DELETE FROM items WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    return result.affectedRows > 0;
  },

  // Find all items by user ID
  async findByUserId(userId) {
    const query = `
      SELECT items.*
      FROM items
      WHERE items.user_id = ?
      ORDER BY items.created_at DESC
    `;

    const [items] = await pool.execute(query, [userId]);
    return items;
  }
};

module.exports = Item;
