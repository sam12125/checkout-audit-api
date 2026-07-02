async function paymentCheck(page) {

    const result = {
        expressCheckout: {
            shopPay: false,
            paypal: false,
            applePay: false,
            googlePay: false
        },

        paymentMethods: {
            visa: false,
            mastercard: false,
            amex: false,
            discover: false,
            maestro: false,
            diners: false,
            jcb: false,
            unionpay: false,

            paypal: false,
            shopPay: false,
            klarna: false,
            afterpay: false,
            clearpay: false,
            affirm: false,
            amazonPay: false,
            stripe: false
        }
    };

    try {

        const html = (await page.content()).toLowerCase();

        const body = (await page.locator("body").innerText()).toLowerCase();

        const content = html + " " + body;

        // ----------------------------
        // Express Checkout
        // ----------------------------

        result.expressCheckout.shopPay =
            /shop pay/.test(content);

        result.expressCheckout.paypal =
            /paypal/.test(content);

        result.expressCheckout.applePay =
            /apple pay/.test(content);

        result.expressCheckout.googlePay =
            /google pay|gpay/.test(content);

        // ----------------------------
        // Payment Cards
        // ----------------------------

        result.paymentMethods.visa =
            /visa/.test(content);

        result.paymentMethods.mastercard =
            /mastercard/.test(content);

        result.paymentMethods.amex =
            /american express|amex/.test(content);

        result.paymentMethods.discover =
            /discover/.test(content);

        result.paymentMethods.maestro =
            /maestro/.test(content);

        result.paymentMethods.diners =
            /diners/.test(content);

        result.paymentMethods.jcb =
            /\bjcb\b/.test(content);

        result.paymentMethods.unionpay =
            /unionpay/.test(content);

        // ----------------------------
        // Wallets / BNPL
        // ----------------------------

        result.paymentMethods.paypal =
            /paypal/.test(content);

        result.paymentMethods.shopPay =
            /shop pay/.test(content);

        result.paymentMethods.klarna =
            /klarna/.test(content);

        result.paymentMethods.afterpay =
            /afterpay/.test(content);

        result.paymentMethods.clearpay =
            /clearpay/.test(content);

        result.paymentMethods.affirm =
            /affirm/.test(content);

        result.paymentMethods.amazonPay =
            /amazon pay/.test(content);

        result.paymentMethods.stripe =
            /stripe/.test(content);

        return result;

    }

    catch (err) {

        result.error = err.message;

        return result;

    }

}

module.exports = paymentCheck;