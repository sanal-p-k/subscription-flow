import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize the database in memory or a local file
const dbPath = process.env.DB_PATH || 'subscription_sys.sqlite';
export const db = new Database(dbPath, { create: true });

export const initDb = () => {
  console.log('Initializing database schema...');
  const schemaPath = join(process.cwd(), 'src', 'db', 'schema.sql');

  try {
    const schema = readFileSync(schemaPath, 'utf8');
    db.exec(schema);

    // Basic seed data for ease of immediate validation 
    const planCount = db.prepare('SELECT COUNT(*) as count FROM Plans').get() as { count: number };
    if (planCount.count === 0) {
      db.exec(`INSERT INTO Plans (name, price) VALUES 
            ('Basic', 149900), 
            ('Pro', 299900)
          `);

      db.exec(`INSERT INTO Coupons (code, discount_percent, max_uses, current_uses, is_active) VALUES 
            ('WELCOME10', 10, 100, 0, 1),
            ('NEWYEAR50', 50, 1000, 0, 1)
          `);
      console.log('Inserted mock data for Plans and Coupons.');
    }
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize local DB schema:', err);
  }
};
