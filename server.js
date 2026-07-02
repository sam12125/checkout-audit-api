require("dotenv").config();
const express = require("express");
const cors = require("cors");

const checkoutRoutes = require("./routes/checkout");

const app = express();

/* -----------------------------
   CORS CONFIG (IMPORTANT FIX)
------------------------------*/
app.use(
  cors({
    origin: "*", // change to your domain in production
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(cors());
app.options(/.*/, cors());


/* -----------------------------
   BODY PARSER
------------------------------*/
app.use(express.json({ limit: "10mb" }));

/* -----------------------------
   REQUEST TIMEOUT SAFETY
   (prevents Render hanging)
------------------------------*/
app.use((req, res, next) => {
  res.setTimeout(120000, () => {
    console.log("❌ Request timed out");
    res.status(408).json({
      success: false,
      error: "Request timeout",
    });
  });
  next();
});

/* -----------------------------
   ROUTES
------------------------------*/
app.use("/api", checkoutRoutes);

/* -----------------------------
   HEALTH CHECK ROUTE
------------------------------*/
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Checkout Audit API</h1>
    <p>Status: ✅ Running</p>

    <h3>POST /api/checkout-audit</h3>
    <pre>
{
  "url": "https://example.com",
  "monthlyTraffic": 50000,
  "aov": 120
}
    </pre>
  `);
});

/* -----------------------------
   GLOBAL ERROR HANDLER
   (IMPORTANT for Render logs)
------------------------------*/
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

/* -----------------------------
   START SERVER
------------------------------*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});