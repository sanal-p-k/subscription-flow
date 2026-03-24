-- Create basic tables first
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    weight REAL,
    height REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL -- Stored in smallest currency unit (e.g. paisa or cent, though here rupees is okay for simplicity)
);

CREATE TABLE IF NOT EXISTS Coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    max_uses INTEGER NOT NULL,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Target Subscriptions table with correct references and columns
CREATE TABLE IF NOT EXISTS Subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    coupon_id INTEGER,
    original_price INTEGER NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    final_price INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
    idempotency_key TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (plan_id) REFERENCES Plans(id),
    FOREIGN KEY (coupon_id) REFERENCES Coupons(id)
);

-- Create required indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON Subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_coupon_id ON Subscriptions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON Subscriptions(plan_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON Coupons(code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON Users(username);
