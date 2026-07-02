async function cartCheck(page, productPage) {

    const result = {
        cartFound: false,
        cartDrawer: false,
        checkoutButton: false,
        couponField: false,
        continueShopping: false,
        shippingEstimator: false,
        freeShippingMessage: false,
        cartUrl: null
    };

    try {

        // -----------------------------
        // Try opening cart directly
        // -----------------------------

        let cartURL = "";

        if (productPage) {

            const url = new URL(productPage);

            cartURL = `${url.origin}/cart`;

            await page.goto(cartURL, {
                waitUntil: "domcontentloaded",
                timeout: 30000
            });

            await page.waitForTimeout(3000);

        }

        result.cartUrl = page.url();

        // -----------------------------
        // Is Cart Page?
        // -----------------------------

        const currentURL = page.url().toLowerCase();

        if (
            currentURL.includes("/cart") ||
            currentURL.includes("cart")
        ) {

            result.cartFound = true;

        }

        // -----------------------------
        // Detect Cart Drawer
        // -----------------------------

        const drawerCount = await page.$$eval(

            '[role="dialog"], .drawer, .cart-drawer, .mini-cart',

            els => els.length

        );

        result.cartDrawer = drawerCount > 0;

        // -----------------------------
        // Read body text
        // -----------------------------

        const body = (
            await page.locator("body").innerText()
        ).toLowerCase();

        // -----------------------------
        // Checkout Button
        // -----------------------------

        result.checkoutButton =
            /checkout|secure checkout/.test(body);

        // -----------------------------
        // Continue Shopping
        // -----------------------------

        result.continueShopping =
            /continue shopping/.test(body);

        // -----------------------------
        // Coupon Field
        // -----------------------------

        const couponInput = await page.$(

            'input[name*="coupon"],input[name*="discount"],input[placeholder*="coupon" i],input[placeholder*="discount" i]'

        );

        result.couponField = !!couponInput;

        // -----------------------------
        // Shipping Estimator
        // -----------------------------

        result.shippingEstimator =
            /estimate shipping|shipping calculator|calculate shipping/.test(body);

        // -----------------------------
        // Free Shipping Message
        // -----------------------------

        result.freeShippingMessage =
            /free shipping|free delivery/.test(body);

        return result;

    }

    catch (err) {

        result.error = err.message;

        return result;

    }

}

module.exports = cartCheck;