import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize the database in memory or a local file
const dbPath = process.env.DB_PATH || 'subscription_sys.sqlite';
export const db = new Database(dbPath, { create: true });

export const initDb = () => {
    console.log('Initializing database schema...');
    const schemaPath = join(import.meta.dir, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Create tables and indexes safely
    db.exec(schema);

    // Insert mock data for testing purposes (Plans, Coupons) only if missing
    const planCount = db.prepare('SELECT COUNT(*) as count FROM Plans').get() as { count: number };
    if (planCount.count === 0) {
        db.exec(`
          INSERT INTO Plans (name, price) VALUES 
          ('Basic', 1499),
          ('Pro', 2999);
      `);

        db.exec(`
          INSERT INTO Coupons (code, discount_percent, max_uses, current_uses, is_active) VALUES 
          ('WELCOME10', 10, 100, 0, 1),
          ('FLAT50', 50, 10, 9, 1),
          ('EXPIRED20', 20, 50, 50, 1),
          ('INACTIVE15', 15, 100, 0, 0);
      `);
        console.log('Inserted mock data for Plans and Coupons.');
    }

    console.log('Database initialized successfully.');
};
