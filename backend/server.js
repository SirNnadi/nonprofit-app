const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "donations",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres"
});

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "unhealthy", database: "disconnected" });
  }
});

app.get("/api/impact", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(amount), 0) AS total_donated,
        COUNT(*) AS donation_count
      FROM donations
      WHERE status = 'recorded'
    `);

    res.json({
      totalDonated: Number(result.rows[0].total_donated),
      donationCount: Number(result.rows[0].donation_count)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load impact data." });
  }
});

app.post("/api/donations", async (req, res) => {
  const { donorName, donorEmail, amount, message } = req.body;
  const numericAmount = Number(amount);

  if (!donorName || !donorEmail || !Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      error: "Please provide a name, email, and a donation amount greater than zero."
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO donations
        (donor_name, donor_email, amount, message, status)
       VALUES ($1, $2, $3, $4, 'recorded')
       RETURNING id, donor_name, amount, created_at`,
      [donorName.trim(), donorEmail.trim(), numericAmount.toFixed(2), message?.trim() || null]
    );

    res.status(201).json({
      message: "Thank you for your donation!",
      donation: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to record donation." });
  }
});

app.listen(PORT, () => {
  console.log(`Donation backend running on port ${PORT}`);
});
