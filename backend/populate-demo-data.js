const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function populateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sharehub',
      multipleStatements: true
    });
    
    console.log('Connected to database');
    
    // Read and execute the demo data SQL
    const demoSQL = fs.readFileSync(path.join(__dirname, '../database/demo_items.sql'), 'utf8');
    const demoStatements = demoSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of demoStatements) {
      if (statement.trim().startsWith('INSERT') || statement.trim().startsWith('SELECT')) {
        try {
          await connection.execute(statement.trim());
        } catch (err) {
          console.log('Skipping statement:', statement.substring(0, 50) + '...');
        }
      }
    }
    
    console.log('Demo items inserted successfully');
    
    // Also run realistic demo data
    const realisticSQL = fs.readFileSync(path.join(__dirname, '../database/realistic_demo_data.sql'), 'utf8');
    const realisticStatements = realisticSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of realisticStatements) {
      if (statement.trim().startsWith('INSERT') || statement.trim().startsWith('SELECT')) {
        try {
          await connection.execute(statement.trim());
        } catch (err) {
          console.log('Skipping statement:', statement.substring(0, 50) + '...');
        }
      }
    }
    
    console.log('Realistic demo items inserted successfully');
    
    // Check total items
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM items');
    console.log('Total items in database:', rows[0].total);
    
    // Show items by category
    const [categoryRows] = await connection.execute(`
      SELECT category, listing_type, COUNT(*) as count 
      FROM items 
      GROUP BY category, listing_type 
      ORDER BY category, listing_type
    `);
    
    console.log('\nItems by category:');
    categoryRows.forEach(row => {
      console.log(`${row.category} (${row.listing_type}): ${row.count} items`);
    });
    
    await connection.end();
    console.log('\nDatabase populated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

populateDatabase();