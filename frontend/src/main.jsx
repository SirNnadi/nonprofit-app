import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    amount: "",
    message: ""
  });
  const [impact, setImpact] = useState({ totalDonated: 0, donationCount: 0 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadImpact = async () => {
    try {
      const response = await fetch("/api/impact");
      const data = await response.json();
      setImpact(data);
    } catch {
      setError("Unable to connect to the donation service.");
    }
  };

  useEffect(() => {
    loadImpact();
  }, []);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submitDonation = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Donation failed.");
      }

      setMessage(data.message);
      setForm({ donorName: "", donorEmail: "", amount: "", message: "" });
      loadImpact();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <section className="hero">
        <nav>
          <strong>Hope & Help</strong>
          <span>Serving people. Sharing hope.</span>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">EVERY GIFT CAN MAKE A DIFFERENCE</p>
          <h1>Help provide hope, food, and essential support.</h1>
          <p>
            Your generosity helps nonprofit organizations serve people
            experiencing poverty and hardship.
          </p>
          <a href="#donate" className="button" style={{position: 'relative', zIndex: 1}}>Donate Now</a>
        </div>
      </section>

      <section className="impact">
        <div>
          <h2>${impact.totalDonated.toFixed(2)}</h2>
          <p>Donations recorded</p>
        </div>
        <div>
          <h2>{impact.donationCount}</h2>
          <p>Gifts received</p>
        </div>
        <div>
          <h2>100%</h2>
          <p>Community focused</p>
        </div>
      </section>

      <section id="donate" className="donation-section">
        <div>
          <p className="eyebrow">MAKE AN IMPACT</p>
          <h2>Give what you can.</h2>
          <p>
            Every contribution matters. This demo records donation information
            in PostgreSQL. For a real deployment, connect the form to a
            PCI-compliant payment provider such as Stripe rather than storing
            card information yourself.
          </p>
        </div>

        <form onSubmit={submitDonation}>
          <label>
            Name
            <input name="donorName" value={form.donorName} onChange={updateField} required />
          </label>

          <label>
            Email
            <input type="email" name="donorEmail" value={form.donorEmail} onChange={updateField} required />
          </label>

          <label>
            Donation amount
            <input type="number" min="1" step="0.01" name="amount" value={form.amount} onChange={updateField} placeholder="50.00" required />
          </label>

          <label>
            Message (optional)
            <textarea name="message" value={form.message} onChange={updateField} rows="4" />
          </label>

          <button type="submit">Record Donation</button>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      <footer>
        <p>Hope & Help — a donation application demo.</p>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
