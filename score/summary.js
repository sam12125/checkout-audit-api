module.exports = function getSummary(data) {

    const strengths = [];
    const weaknesses = [];

    if (data.product.addToCart)
        strengths.push("Add to Cart available");

    if (data.payment.expressCheckout.shopPay)
        strengths.push("Express checkout");

    if (data.trust.ssl)
        strengths.push("SSL enabled");

    if (data.pagespeed.success &&
        data.pagespeed.mobile.score >= 80)
        strengths.push("Fast mobile speed");

    if (!data.cart.checkoutButton)
        weaknesses.push("Checkout button missing");

    if (!data.returns.returnPolicy)
        weaknesses.push("No return policy");

    if (!data.cart.freeShippingMessage)
        weaknesses.push("No free shipping message");

    if (data.product.reviewCount === 0)
        weaknesses.push("No product reviews");

    return {

        strengths,

        weaknesses

    };

};