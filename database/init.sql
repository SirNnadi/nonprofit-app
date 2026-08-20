CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_name VARCHAR(100) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'recorded',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO donations (donor_name, donor_email, amount, message, status)
SELECT 'Example Donor', 'example@example.com', 25.00,
       'Initial demo donation', 'recorded'
WHERE NOT EXISTS (SELECT 1 FROM donations);
