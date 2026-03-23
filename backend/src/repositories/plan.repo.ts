import { db } from '../db/index.js';

export class PlanRepository {
    static findAll() {
        return db.prepare('SELECT id, name, price FROM Plans').all() as any[];
    }

    static findById(id: number) {
        return db.prepare('SELECT id, name, price FROM Plans WHERE id = ?').get(id) as any;
    }
}
