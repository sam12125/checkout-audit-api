async function trustCheck(page) {

    const result = {

        ssl: false,

        secureCheckout: false,

        securePayment: false,

        trustpilot: false,

        googleReviews: false,

        judgeMe: false,

        yotpo: false,

        loox: false,

        stamped: false,

        reviewsIO: false,

        norton: false,

        mcafee: false,

        sslBadge: false,

        moneyBackGuarantee: false,

        satisfactionGuarantee: false,

        reviewCount: 0

    };

    try {

        const html = (await page.content()).toLowerCase();

        const body = (await page.locator("body").innerText()).toLowerCase();

        const content = html + " " + body;

        // -----------------------
        // SSL
        // -----------------------

        result.ssl = page.url().startsWith("https://");

        // -----------------------
        // Secure Checkout
        // -----------------------

        result.secureCheckout =
            /secure checkout/.test(content);

        // -----------------------
        // Secure Payment
        // -----------------------

        result.securePayment =
            /secure payment|safe payment|encrypted payment/.test(content);

        // -----------------------
        // Trustpilot
        // -----------------------

        result.trustpilot =
            /trustpilot/.test(content);

        // -----------------------
        // Google Reviews
        // -----------------------

        result.googleReviews =
            /google reviews/.test(content);

        // -----------------------
        // Judge.me
        // -----------------------

        result.judgeMe =
            /judge\.me|judgeme/.test(content);

        // -----------------------
        // Yotpo
        // -----------------------

        result.yotpo =
            /yotpo/.test(content);

        // -----------------------
        // Loox
        // -----------------------

        result.loox =
            /loox/.test(content);

        // -----------------------
        // Stamped.io
        // -----------------------

        result.stamped =
            /stamped/.test(content);

        // -----------------------
        // Reviews.io
        // -----------------------

        result.reviewsIO =
            /reviews\.io/.test(content);

        // -----------------------
        // Norton
        // -----------------------

        result.norton =
            /norton/.test(content);

        // -----------------------
        // McAfee
        // -----------------------

        result.mcafee =
            /mcafee/.test(content);

        // -----------------------
        // SSL Badge
        // -----------------------

        result.sslBadge =
            /ssl|secure ssl|ssl secured/.test(content);

        // -----------------------
        // Money Back
        // -----------------------

        result.moneyBackGuarantee =
            /money back|money-back|30 day return|30-day return/.test(content);

        // -----------------------
        // Satisfaction Guarantee
        // -----------------------

        result.satisfactionGuarantee =
            /satisfaction guarantee|100% satisfaction/.test(content);

        // -----------------------
        // Approx Review Count
        // -----------------------

        const reviewMatches =
            body.match(/\(\d+\)/g);

        if (reviewMatches) {

            result.reviewCount = reviewMatches.length;

        }

        return result;

    }

    catch (err) {

        result.error = err.message;

        return result;

    }

}

module.exports = trustCheck;