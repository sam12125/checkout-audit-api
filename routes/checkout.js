const express = require("express");
const router = express.Router();

const { scanStore } = require("../services/scraperService");

router.post("/checkout-audit", async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: "Store URL is required"
            });
        }

        const result = await scanStore(

    url,

    req.body.monthlyTraffic,

    req.body.aov

);

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;