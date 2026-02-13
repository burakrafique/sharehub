const db = require('../config/database');

class NGO {
  // Create NGO verification request
  static async createVerificationRequest(data) {
    const query = `
      INSERT INTO ngo_verifications (user_id, ngo_name, registration_number, documents_url)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      data.user_id,
      data.ngo_name,
      data.registration_number,
      data.documents_url
    ]);
    
    return result.insertId;
  }

  // Get NGO verification by user ID
  static async getByUserId(userId) {
    const query = `
      SELECT nv.*, u.name, u.email, u.phone, u.address
      FROM ngo_verifications nv
      JOIN users u ON nv.user_id = u.id
      WHERE nv.user_id = ?
    `;
    
    const [rows] = await db.execute(query, [userId]);
    return rows[0];
  }

  // Get all pending verifications (for admin)
  static async getPendingVerifications() {
    const query = `
      SELECT nv.*, u.name, u.email, u.phone, u.address
      FROM ngo_verifications nv
      JOIN users u ON nv.user_id = u.id
      WHERE nv.verification_status = 'pending'
      ORDER BY nv.created_at ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  }

  // Get all verifications with status filter
  static async getAllVerifications(status = null) {
    let query = `
      SELECT nv.*, u.name, u.email, u.phone, u.address
      FROM ngo_verifications nv
      JOIN users u ON nv.user_id = u.id
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE nv.verification_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY nv.created_at DESC';
    
    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Update verification status
  static async updateVerificationStatus(verificationId, status, adminId) {
    const query = `
      UPDATE ngo_verifications 
      SET verification_status = ?, 
          verified_at = CASE WHEN ? = 'verified' THEN NOW() ELSE NULL END
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [status, status, verificationId]);
    
    // If verified, update user role to NGO
    if (status === 'verified' && result.affectedRows > 0) {
      const getUserQuery = 'SELECT user_id FROM ngo_verifications WHERE id = ?';
      const [userRows] = await db.execute(getUserQuery, [verificationId]);
      
      if (userRows.length > 0) {
        const updateUserQuery = 'UPDATE users SET role = ? WHERE id = ?';
        await db.execute(updateUserQuery, ['ngo', userRows[0].user_id]);
      }
    }
    
    return result.affectedRows > 0;
  }

  // Get verified NGOs
  static async getVerifiedNGOs() {
    const query = `
      SELECT nv.*, u.name, u.email, u.phone, u.address, u.latitude, u.longitude
      FROM ngo_verifications nv
      JOIN users u ON nv.user_id = u.id
      WHERE nv.verification_status = 'verified'
      ORDER BY nv.ngo_name ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  }

  // Check if user has verification request
  static async hasVerificationRequest(userId) {
    const query = 'SELECT id FROM ngo_verifications WHERE user_id = ?';
    const [rows] = await db.execute(query, [userId]);
    return rows.length > 0;
  }

  // Delete verification request
  static async deleteVerification(verificationId) {
    const query = 'DELETE FROM ngo_verifications WHERE id = ?';
    const [result] = await db.execute(query, [verificationId]);
    return result.affectedRows > 0;
  }
}

module.exports = NGO;