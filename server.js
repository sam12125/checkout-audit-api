require("dotenv").config();
const express = require("express");
const cors = require("cors");

const checkoutRoutes = require("./routes/checkout");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", checkoutRoutes);

app.get("/", (req, res) => {
    res.send(`
        <h1>🚀 Checkout Audit API</h1>

        <p>Welcome to the Checkout Audit API.</p>

        <p><strong>Status:</strong> ✅ Running</p>

        <h3>Available Endpoint</h3>

        <p>
            <strong>POST</strong> /api/checkout-audit
        </p>

        <h3>Sample Request Body</h3>

<pre>
{
    "url": "https://ocochi.com",
    "monthlyTraffic": 50000,
    "aov": 180
}
</pre>
    `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});