const { promisePool: pool } = require('../config/database');

const Donation = {
  // Create a new donation
  async create(donationData) {
    const { donor_id, ngo_id, item_id, message } = donationData;

    const query = `
      INSERT INTO donations 
      (donor_id, ngo_id, item_id, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;

    const [result] = await pool.execute(query, [
      donor_id,
      ngo_id,
      item_id,
      message || null
    ]);

    return {
      id: result.insertId,
      ...donationData,
      status: 'pending',
      created_at: new Date()
    };
  },

  // Get donation by ID
  async findById(id) {
    const query = `
      SELECT 
        d.*,
        donor.name as donor_name,
        donor.email as donor_email,
        donor.phone as donor_phone,
        ngo.name as ngo_name,
        ngo.email as ngo_email,
        ngo.phone as ngo_phone,
        items.title as item_title,
        items.description as item_description,
        items.category as item_category,
        (SELECT image_url FROM item_images WHERE item_id = d.item_id LIMIT 1) as item_image
      FROM donations d
      INNER JOIN users donor ON d.donor_id = donor.id
      INNER JOIN users ngo ON d.ngo_id = ngo.id
      INNER JOIN items ON d.item_id = items.id
      WHERE d.id = ?
    `;

    const [donations] = await pool.execute(query, [id]);
    return donations.length > 0 ? donations[0] : null;
  },

  // Get user's donations (as donor)
  async findByDonorId(userId) {
    const query = `
      SELECT 
        d.*,
        ngo.name as ngo_name,
        items.title as item_title,
        items.category as item_category,
        (SELECT image_url FROM item_images WHERE item_id = d.item_id LIMIT 1) as item_image
      FROM donations d
      INNER JOIN users ngo ON d.ngo_id = ngo.id
      INNER JOIN items ON d.item_id = items.id
      WHERE d.donor_id = ?
      ORDER BY d.created_at DESC
    `;

    const [donations] = await pool.execute(query, [userId]);
    return donations;
  },

  // Get donations received by NGO
  async findByNgoId(ngoId) {
    const query = `
      SELECT 
        d.*,
        donor.name as donor_name,
        donor.phone as donor_phone,
        items.title as item_title,
        items.category as item_category,
        (SELECT image_url FROM item_images WHERE item_id = d.item_id LIMIT 1) as item_image
      FROM donations d
      INNER JOIN users donor ON d.donor_id = donor.id
      INNER JOIN items ON d.item_id = items.id
      WHERE d.ngo_id = ?
      ORDER BY d.created_at DESC
    `;

    const [donations] = await pool.execute(query, [ngoId]);
    return donations;
  },

  // Update donation status
  async updateStatus(id, status) {
    const completedAt = status === 'completed' ? new Date() : null;
    
    const [result] = await pool.execute(
      'UPDATE donations SET status = ?, completed_at = ? WHERE id = ?',
      [status, completedAt, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Get all verified NGOs
  async getVerifiedNGOs() {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        nv.ngo_name,
        nv.registration_number,
        nv.verified_at
      FROM users u
      INNER JOIN ngo_verifications nv ON u.id = nv.user_id
      WHERE u.role = 'ngo' AND nv.verification_status = 'verified'
      ORDER BY u.name ASC
    `;

    const [ngos] = await pool.execute(query);
    return ngos;
  }
};

module.exports = Donation;
