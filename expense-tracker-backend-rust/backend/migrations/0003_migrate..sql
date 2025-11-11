-- ===================================
-- Table: bucket
-- ===================================
CREATE TABLE bucket (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    limit_amount DOUBLE PRECISION NOT NULL,
    current_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bucket_name ON bucket(name);

-- ===================================
-- Table: transaction
-- ===================================
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    amount DOUBLE PRECISION NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    bucket_id INTEGER NOT NULL REFERENCES bucket(id) ON DELETE CASCADE
);

CREATE INDEX idx_transaction_date ON transaction(date);
CREATE INDEX idx_transaction_bucket_id ON transaction(bucket_id);

-- ===================================
-- Table: balance
-- ===================================
CREATE TABLE balance (
    id SERIAL PRIMARY KEY,
    amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    account_type VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_balance_account_type ON balance(account_type);
CREATE INDEX idx_balance_user_name ON balance(user_name);