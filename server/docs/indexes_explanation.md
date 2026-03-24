# Indexes Explanation

In the `Subscriptions` and `Coupons` tables, we have engineered indexes to ensure fast `O(log n)` lookups and effective aggregations. Here is the rationale behind each index:

### 1. `idx_subscriptions_user_id`
\`\`\`sql
CREATE INDEX idx_subscriptions_user_id ON Subscriptions(user_id);
\`\`\`
- **Why:** When users log in or fetch their profiles, the backend needs to find all subscriptions associated with them.
- **Query Complexity Improvement:** 
  - Without Index: `O(N)` full table scan.
  - With Index: `O(log N)` lookup using B-Tree index + `O(K)` to fetch `K` subscriptions.

### 2. `idx_subscriptions_coupon_id`
\`\`\`sql
CREATE INDEX idx_subscriptions_coupon_id ON Subscriptions(coupon_id);
\`\`\`
- **Why:** Important for analytics and auditing. To see how many active plans utilized a specific marketing campaign/coupon.
- **Query Complexity Improvement:** Drops from a full table scan `O(N)` to a logarithmic `O(log N)` to find the subset of subscriptions.

### 3. `idx_subscriptions_plan_id`
\`\`\`sql
CREATE INDEX idx_subscriptions_plan_id ON Subscriptions(plan_id);
\`\`\`
- **Why:** Essential for sales reporting. Example: `SELECT COUNT(*) FROM Subscriptions WHERE plan_id = ?`.
- **Query Complexity Improvement:** Substantially speeds up group-bys or count tracking to `O(log N)`.

### 4. `idx_coupons_code`
\`\`\`sql
CREATE UNIQUE INDEX idx_coupons_code ON Coupons(code);
\`\`\`
- **Why:** Essential for the `/api/coupons/validate` endpoint. We look up coupons by their String code.
- **Query Complexity Improvement:** String searches are highly inefficient in a full table scan `O(N)`. A unique index makes finding the coupon strictly `O(log N)`.
