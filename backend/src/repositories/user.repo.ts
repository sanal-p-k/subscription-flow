import { db } from '../db/index.js';

export class UserRepository {
    static findByUsername(username: string) {
        return db.prepare('SELECT id, username, name, age, weight, height FROM Users WHERE username = ? COLLATE NOCASE LIMIT 1').get(username) as any;
    }

    static create(user: { username: string, name: string, age: number, weight: number, height: number }) {
        const result = db.prepare(`
            INSERT INTO Users (username, name, age, weight, height)
            VALUES (?, ?, ?, ?, ?)
        `).run(user.username, user.name, user.age, user.weight, user.height);

        return result.lastInsertRowid;
    }
}
