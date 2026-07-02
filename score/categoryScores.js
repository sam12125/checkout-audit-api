module.exports = function getCategoryScores(data) {

    return {

       performance:
    data.pagespeed.success
        ? data.pagespeed.mobile.score
        : 0,

        productExperience:
            (
                (data.product.addToCart ? 40 : 0) +
                (data.product.variantSelector ? 30 : 0) +
                (data.product.reviewCount > 0 ? 30 : 0)
            ),

        checkoutExperience:
            (
                (data.cart.checkoutButton ? 40 : 0) +
                (data.payment.expressCheckout.shopPay ? 20 : 0) +
                (data.payment.expressCheckout.paypal ? 20 : 0) +
                (data.cart.freeShippingMessage ? 20 : 0)
            ),

        trust:
            (
                (data.trust.ssl ? 20 : 0) +
                (data.trust.sslBadge ? 20 : 0) +
                (data.trust.trustpilot ? 20 : 0) +
                (data.trust.judgeMe ? 20 : 0) +
                (data.returns.returnPolicy ? 20 : 0)
            )

    };

};