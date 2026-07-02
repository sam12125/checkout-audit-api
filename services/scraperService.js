const { chromium } = require("playwright");

const homepageCheck = require("../checks/homepage");
const platformCheck = require("../checks/platform");
const productCheck = require("../checks/product");
const cartCheck = require("../checks/cart");
const paymentCheck = require("../checks/payment");
const shippingCheck = require("../checks/shipping");
const trustCheck = require("../checks/trust");
const viewportCheck = require("../checks/viewport");
const returnsCheck = require("../checks/returns");
const pageSpeedCheck = require("../checks/pagespeed");

const scoreAudit = require("../score/scoreEngine");
const calculateRevenue = require("../score/revenue");
const getCategoryScores = require("../score/categoryScores");
const getSummary = require("../score/summary");
const getTopLeak = require("../score/topLeak");
const getBenchmark = require("../score/benchmark");

async function scanStore(url, monthlyTraffic = 50000, aov = 80) {
  let browser;

  try {
    // Start Google PageSpeed in parallel
    const pageSpeedPromise = pageSpeedCheck(url);

    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 900,
      },

      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36",
    });

    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(60000);

    //------------------------------------
    // Open Homepage
    //------------------------------------

   await page.goto(url, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

try {
  await page.waitForLoadState("networkidle", { timeout: 60000 });
} catch (e) {
  // ignore network idle timeout (common on Shopify/React sites)
}

 

    //------------------------------------
    // Homepage Checks (Parallel)
    //------------------------------------

    const [homepage, platform, shipping, trust, viewport, returnsData] =
      await Promise.all([
        homepageCheck(page),

        platformCheck(page),

        shippingCheck(page),

        trustCheck(page),

        viewportCheck(page),

        returnsCheck(page),
      ]);

    //------------------------------------
    // Product Check
    //------------------------------------

    const product = await productCheck(page);

    //------------------------------------
    // Cart Check
    //------------------------------------

    const cart = await cartCheck(
      page,

      product.productPage,
    );

    //------------------------------------
    // Payment Check
    //------------------------------------

    const payment = await paymentCheck(page);

    //------------------------------------
    // Wait for Google PageSpeed
    //------------------------------------

    let pagespeed;

    try {
      if (!pagespeed.mobile) {
        pagespeed.mobile = {
          score: 0,
          metrics: {},
          opportunities: [],
        };
      }

      if (!pagespeed.desktop) {
        pagespeed.desktop = {
          score: 0,
          metrics: {},
          opportunities: [],
        };
      }
    } catch (err) {
      pagespeed = {
        success: false,

        error: err.message,
      };
    }

    //------------------------------------
    // SCORE ENGINE
    //------------------------------------

    const audit = scoreAudit({
      homepage,

      platform,

      product,

      cart,

      payment,

      shipping,

      trust,

      viewport,

      returns: returnsData,

      pagespeed,
    });

    //------------------------------------
    // Revenue Calculator
    //------------------------------------

    const revenue = calculateRevenue(
      monthlyTraffic,

      aov,

      audit.score,
    );

    //------------------------------------
    // Close Browser
    //------------------------------------

    const categoryScores = getCategoryScores({
      homepage,
      product,
      cart,
      payment,
      shipping,
      trust,
      returns: returnsData,
      pagespeed,
    });

    const summary = getSummary({
      homepage,
      product,
      cart,
      payment,
      shipping,
      trust,
      returns: returnsData,
      pagespeed,
    });

    const topRevenueLeak = getTopLeak(audit.findings);

    const benchmark = getBenchmark({
      platform: platform.platform,
      mobileScore: pagespeed.mobile?.score || 0,
      categoryScores,
    });

    await browser.close();

    //------------------------------------
    // Final Response
    //------------------------------------

    return {
      success: true,

      url,

      audit,

      revenue,

      homepage,

      platform,

      product,

      cart,

      payment,

      shipping,

      trust,

      viewport,

      returns: returnsData,

      pagespeed,
      summary,
      categoryScores,
      benchmark,
      topRevenueLeak,
    };
  } catch (err) {
    if (browser) {
      await browser.close();
    }

    return {
      success: false,

      error: err.message,
    };
  }
}

module.exports = {
  scanStore,
};
