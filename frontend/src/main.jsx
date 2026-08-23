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

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Our Mission</h3>
            <p>
              Hope &amp; Help exists to serve people experiencing poverty,
              hunger, and hardship. We believe every person deserves dignity,
              compassion, and a community that cares — and we work every day
              to make that a reality through faith-driven action.
            </p>
          </div>

          <div className="footer-col">
            <h3>Community Service</h3>
            <ul>
              <li>Weekly food pantry &amp; meal distributions</li>
              <li>Clothing drives and household essentials</li>
              <li>After-school tutoring &amp; mentorship</li>
              <li>Emergency shelter assistance</li>
              <li>Job readiness &amp; skills workshops</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Impact of Your Gift</h3>
            <ul>
              <li>$25 feeds a family for a week</li>
              <li>$50 provides school supplies for a child</li>
              <li>$100 covers emergency utility assistance</li>
              <li>$250 sponsors a job-training session</li>
              <li>Every dollar stays in the community</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Founders</h3>
            <p>
              Hope &amp; Help was founded by a group of faith-led community
              members united by a single conviction — that loving your neighbor
              is not optional. Our founders have served thousands of families
              across the region and remain actively involved in every program
              we run.
            </p>
          </div>

          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul>
              <li>📧 <a href="mailto:hello@hopeandhelp.org">hello@hopeandhelp.org</a></li>
              <li>📞 (555) 012-3456</li>
              <li>📍 123 Mercy Lane, Hopeville, USA</li>
              <li>Mon – Fri, 9 AM – 5 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-scripture">
          <blockquote>
            &ldquo;It is more blessed to give than to receive.&rdquo;
            <cite>— Acts 20:35</cite>
          </blockquote>
          <blockquote>
            &ldquo;Give, and it will be given to you. A good measure, pressed down,
            shaken together and running over, will be poured into your lap. For
            with the measure you use, it will be measured to you.&rdquo;
            <cite>— Luke 6:38</cite>
          </blockquote>
        </div>

        <div className="footer-bottom">
          <p className="jesus-declaration">
            ✝ Jesus is Lord. We honor His sacrifice — that He willingly gave
            His life for our sins so that we might have life, and have it
            abundantly. It is out of that same selfless love that we are
            compelled to give, serve, and care for one another. ✝
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Hope &amp; Help. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
