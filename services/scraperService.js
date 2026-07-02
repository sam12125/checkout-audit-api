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
    // Start PageSpeed in parallel
    const pageSpeedPromise = pageSpeedCheck(url);

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 900,
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36",
    });

    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(90000);

    //------------------------------------
    // Open Homepage
    //------------------------------------

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
    } catch (err) {
      console.log("Goto Error:", err.message);
    }

    try {
      await page.waitForSelector("body", {
        timeout: 30000,
      });
    } catch (err) {
      console.log("Body not found:", err.message);
    }

    //------------------------------------
    // Homepage Checks
    //------------------------------------

    const [
      homepage,
      platform,
      shipping,
      trust,
      viewport,
      returnsData,
    ] = await Promise.all([
      homepageCheck(page),
      platformCheck(page),
      shippingCheck(page),
      trustCheck(page),
      viewportCheck(page),
      returnsCheck(page),
    ]);

    //------------------------------------
    // Product
    //------------------------------------

    const product = await productCheck(page);

    //------------------------------------
    // Cart
    //------------------------------------

    const cart = await cartCheck(page, product.productPage);

    //------------------------------------
    // Payment
    //------------------------------------

    const payment = await paymentCheck(page);

    //------------------------------------
    // PageSpeed
    //------------------------------------

    let pagespeed = {
      success: false,
      mobile: { score: 0 },
      desktop: { score: 0 },
    };

    try {
      const result = await pageSpeedPromise;

      console.dir(result, { depth: null });

      if (result) {
        pagespeed = {
          success: result.success,
          mobile: result.mobile || { score: 0 },
          desktop: result.desktop || { score: 0 },
          error: result.error || null,
        };
      }
    } catch (err) {
      pagespeed.error = err.message;
    }

    //------------------------------------
    // Score
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
    // Revenue
    //------------------------------------

    const revenue = calculateRevenue(
      monthlyTraffic,
      aov,
      audit.score
    );

    //------------------------------------
    // Summary
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
