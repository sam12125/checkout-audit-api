const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

const API_URL =
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

// -------------------------
// Fetch PageSpeed
// -------------------------

async function getPageSpeed(url, strategy) {

    const response = await axios.get(API_URL, {
        params: {
            url,
            strategy,
            key: API_KEY
        }
    });

    const lighthouse = response.data.lighthouseResult;
    const audits = lighthouse.audits;

    // -------------------------
    // Performance Opportunities
    // -------------------------

    const opportunities = [];

    const opportunityKeys = [

        "render-blocking-resources",

        "unused-css-rules",

        "unused-javascript",

        "modern-image-formats",

        "offscreen-images",

        "uses-text-compression",

        "server-response-time",

        "uses-responsive-images",

        "efficient-animated-content"

    ];

    opportunityKeys.forEach(key => {

        const audit = audits[key];

        if (!audit) return;

        opportunities.push({

            title: audit.title,

            description: audit.description,

            score: audit.score,

            displayValue: audit.displayValue || null,

            savingsMs:
                audit.details?.overallSavingsMs || 0,

            savingsBytes:
                audit.details?.overallSavingsBytes || 0

        });

    });

    return {

        score: Math.round(
            lighthouse.categories.performance.score * 100
        ),

        metrics: {

            firstContentfulPaint:
                audits["first-contentful-paint"]?.displayValue || null,

            largestContentfulPaint:
                audits["largest-contentful-paint"]?.displayValue || null,

            speedIndex:
                audits["speed-index"]?.displayValue || null,

            totalBlockingTime:
                audits["total-blocking-time"]?.displayValue || null,

            cumulativeLayoutShift:
                audits["cumulative-layout-shift"]?.displayValue || null,

            interactive:
                audits["interactive"]?.displayValue || null

        },

        opportunities

    };

}

// -------------------------
// Main Function
// -------------------------

async function pageSpeedCheck(url) {

    const result = {

        success: true,

        mobile: null,

        desktop: null,

        error: null

    };

    // Mobile

    try {

        result.mobile = await getPageSpeed(url, "mobile");

    } catch (err) {

        console.log("❌ Mobile PageSpeed Failed");

        console.log(err.response?.data || err.message);

    }

    // Desktop

    try {

        result.desktop = await getPageSpeed(url, "desktop");

    } catch (err) {

        console.log("❌ Desktop PageSpeed Failed");

        console.log(err.response?.data || err.message);

    }

    if (!result.mobile && !result.desktop) {

        result.success = false;

        result.error = "Unable to retrieve PageSpeed data.";

    }

    return result;

}

module.exports = pageSpeedCheck;