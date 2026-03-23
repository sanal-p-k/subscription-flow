import { Database } from 'bun:sqlite';

// Initialize the database connection
const dbPath = process.env.DB_PATH || 'subscription_sys.sqlite';
const db = new Database(dbPath);

console.log("\n🤖 --- Users ---");
console.table(db.prepare('SELECT * FROM Users').all());

console.log("\n💼 --- Plans ---");
console.table(db.prepare('SELECT * FROM Plans').all());

console.log("\n🎟️ --- Coupons ---");
console.table(db.prepare('SELECT * FROM Coupons').all());

console.log("\n✅ --- Subscriptions ---");
console.table(db.prepare('SELECT * FROM Subscriptions').all());
