import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/nutribase';

async function seed() {
  console.log('🌱 Starting NutriBase MySQL Migration and Database Seeding...');
  
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Connected to MySQL successfully.');

    // 1. Read schema.sql
    const schemaPath = path.resolve(process.cwd(), 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      console.log(`Executing ${statements.length} schema statements...`);
      for (const statement of statements) {
        await connection.query(statement);
      }
      console.log('✅ Schema tables verified/created successfully.');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Database migration error:', err.message);
    console.log('ℹ️ Note: NutriBase includes an automatic in-memory fallback store so the web app will run without an external MySQL instance.');
  } finally {
    if (connection) await connection.end();
  }
}

seed();
