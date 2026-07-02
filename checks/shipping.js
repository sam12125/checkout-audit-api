async function shippingCheck(page) {

    const result = {
        freeShipping: false,
        shippingThreshold: null,
        shippingCalculator: false,
        estimatedDelivery: null,
        localPickup: false,
        clickAndCollect: false,
        shippingPolicy: false
    };

    try {

        const body = (
            await page.locator("body").innerText()
        ).toLowerCase();

        // --------------------------
        // Free Shipping
        // --------------------------

        result.freeShipping =
            /free shipping|free delivery/.test(body);

        // --------------------------
        // Shipping Threshold
        // Examples:
        // Free Shipping Over £50
        // Free Delivery Above $75
        // --------------------------

        const thresholdRegex =
            /(free shipping|free delivery).{0,40}(£|\$|€)\s?(\d+)/i;

        const threshold = body.match(thresholdRegex);

        if (threshold) {

            result.shippingThreshold =
                `${threshold[2]}${threshold[3]}`;

        }

        // --------------------------
        // Shipping Calculator
        // --------------------------

        result.shippingCalculator =
            /shipping calculator|estimate shipping|calculate shipping|shipping estimate/.test(body);

        // --------------------------
        // Delivery Estimate
        // --------------------------

        const deliveryRegex =
            /(\d+\s?-\s?\d+\s?(business )?(day|days|working days))/i;

        const delivery = body.match(deliveryRegex);

        if (delivery) {

            result.estimatedDelivery =
                delivery[0];

        }

        // --------------------------
        // Local Pickup
        // --------------------------

        result.localPickup =
            /local pickup|pick up in store|pickup available/.test(body);

        // --------------------------
        // Click & Collect
        // --------------------------

        result.clickAndCollect =
            /click & collect|click and collect/.test(body);

        // --------------------------
        // Shipping Policy
        // --------------------------

        result.shippingPolicy =
            /shipping policy|delivery policy/.test(body);

        return result;

    }

    catch (err) {

        result.error = err.message;

        return result;

    }

}

module.exports = shippingCheck;