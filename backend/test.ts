import { describe, it, expect, beforeAll } from 'bun:test';
import { db, initDb } from './src/db/index.js';
import app from './src/app.js';
import request from 'supertest';

describe('Gym Subscription Comprehensive Testing', () => {

    beforeAll(() => {
        db.exec('DROP TABLE IF EXISTS Subscriptions;');
        db.exec('DROP TABLE IF EXISTS Coupons;');
        db.exec('DROP TABLE IF EXISTS Plans;');
        db.exec('DROP TABLE IF EXISTS Users;');

        initDb();

        // Mock multiple concurrent users interacting
        db.exec(`INSERT INTO Users (username, name, age, weight, height) VALUES 
            ('user1', 'Alpha', 22, 65, 175),
            ('user2', 'Bravo', 28, 70, 180),
            ('user3', 'Charlie', 35, 80, 160),
            ('user4', 'Delta', 25, 55, 155),
            ('user5', 'Echo', 40, 90, 190);
        `);
    });

    it('health check responds correctly', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    it('Scenario 1: Valid coupon processes properly', async () => {
        const response = await request(app)
            .post('/api/coupons/validate')
            .send({ code: 'WELCOME10' });

        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(true);
        expect(response.body.discount_percent).toBe(10);
    });

    it('Scenario 2: Invalid coupon returns accurate messaging', async () => {
        const response = await request(app)
            .post('/api/coupons/validate')
            .send({ code: 'FAKE500' });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it('Scenario 3: Coupon limit reached rejects standard request safely', async () => {
        const response = await request(app)
            .post('/api/coupons/validate')
            .send({ code: 'EXPIRED20' }); // Exceeds usage logically seeded

        expect(response.status).toBe(400); // Because it is validation endpoint
        expect(response.body.message).toBe('Coupon usage limit reached');
    });

    it('Scenario 5: Subscription WITHOUT coupon works fully', async () => {
        const response = await request(app)
            .post('/api/subscriptions/subscribe')
            .send({
                user_id: 1, plan_id: 1,
                idempotency_key: 'tx_sub_nocoupon'
            });
        // Basic plan is 1499
        expect(response.status).toBe(201);
        expect(response.body.data.finalPrice).toBe(1499);
    });

    it('Scenario 6: Subscription WITH coupon applies strict integer math correctly', async () => {
        const response = await request(app)
            .post('/api/subscriptions/subscribe')
            .send({
                user_id: 2, plan_id: 2, coupon_code: 'WELCOME10',
                idempotency_key: 'tx_sub_coupon'
            });

        // Pro plan 2999 * 10% = 299
        expect(response.status).toBe(201);
        expect(response.body.data.finalPrice).toBe(2700);
    });

    it('Simulation: Idempotency keys block multiple charge occurrences inherently', async () => {
        // user4 tries hitting subscribe multiple times quickly with same IDEMPOTENT KEY
        const req1 = request(app).post('/api/subscriptions/subscribe').send({ user_id: 4, plan_id: 1, idempotency_key: 'tx_idempotent_test' });
        const req2 = request(app).post('/api/subscriptions/subscribe').send({ user_id: 4, plan_id: 1, idempotency_key: 'tx_idempotent_test' });
        const req3 = request(app).post('/api/subscriptions/subscribe').send({ user_id: 4, plan_id: 1, idempotency_key: 'tx_idempotent_test' });

        const responses = await Promise.all([req1, req2, req3]);

        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(201);
        expect(responses[2].status).toBe(201);

        // The service should flag it as an idempotent cache return
        expect(responses[1].body.data.idempotent).toBe(true);
        expect(responses[2].body.data.idempotent).toBe(true);
    });

    it('Scenario 4: Concurrent requests using LAST coupon blocks abuse', async () => {
        // FLAT50 initialized at 9/10 max uses. 
        // 5 users race to use it

        const reqs = Array.from({ length: 5 }).map((_, i) => request(app).post('/api/subscriptions/subscribe').send({
            user_id: i + 1, plan_id: 2, coupon_code: 'FLAT50', idempotency_key: `tx_race_${i}`
        }));

        const responses = await Promise.all(reqs);

        let successCount = 0;
        let conflictCount = 0;

        for (const res of responses) {
            if (res.status === 201) successCount++;
            if (res.status === 409) conflictCount++; // Coupon limit reached
        }

        // Only precisely 1 must succeed because 9 + 1 = 10 limit. The rest 4 must conflict!
        expect(successCount).toBe(1);
        expect(conflictCount).toBe(4);
    });

});
