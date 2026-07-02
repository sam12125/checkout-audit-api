const rules = require("./scoringRules");
const { addFinding } = require("./findings");

function scoreAudit(data){

    let score = 100;

    const findings = [];

    //-----------------------
    // Mobile Speed
    //-----------------------

const mobileScore = data?.pagespeed?.mobile?.score ?? 0;

    if(mobileScore < 50){

        score -= rules.pagespeed.poor;

        addFinding(

            findings,

            "High",

            "Poor Mobile Performance",

            "Improve Core Web Vitals and reduce JS.",

            rules.pagespeed.poor

        );

    }

    else if(mobileScore < 70){

        score -= rules.pagespeed.average;

        addFinding(

            findings,

            "Medium",

            "Average Mobile Speed",

            "Optimize images and scripts.",

            rules.pagespeed.average

        );

    }

    //-----------------------
    // Checkout Button
    //-----------------------

    if(!data.cart.checkoutButton){

        score -= rules.cart.checkoutButtonMissing;

        addFinding(

            findings,

            "High",

            "Checkout button not detected",

            "Ensure checkout CTA is visible.",

            rules.cart.checkoutButtonMissing

        );

    }

    //-----------------------
    // Coupon Field
    //-----------------------

    if(data.cart.couponField){

        score -= rules.cart.couponVisible;

        addFinding(

            findings,

            "Low",

            "Coupon field shown",

            "Hide until later to reduce coupon hunting.",

            rules.cart.couponVisible

        );

    }

    //-----------------------
    // Shipping
    //-----------------------

    if(!data.shipping.freeShipping){

        score -= rules.cart.freeShippingMissing;

        addFinding(

            findings,

            "Medium",

            "No Free Shipping Message",

            "Display free shipping threshold.",

            rules.cart.freeShippingMissing

        );

    }

    //-----------------------
    // Express Checkout
    //-----------------------

    const express = data.payment.expressCheckout;

    if(
        !express.shopPay &&
        !express.paypal &&
        !express.applePay &&
        !express.googlePay
    ){

        score -= rules.payment.noExpressCheckout;

        addFinding(

            findings,

            "High",

            "No Express Checkout",

            "Offer Shop Pay, PayPal or Apple Pay.",

            rules.payment.noExpressCheckout

        );

    }

    //-----------------------
    // Reviews
    //-----------------------

    if(data.trust.reviewCount === 0){

        score -= rules.trust.noReviews;

        addFinding(

            findings,

            "Medium",

            "No Product Reviews",

            "Collect customer reviews.",

            rules.trust.noReviews

        );

    }

    //-----------------------
    // Trust Badge
    //-----------------------

    if(!data.trust.sslBadge){

        score -= rules.trust.noTrustBadges;

        addFinding(

            findings,

            "Low",

            "No Trust Badge",

            "Show secure checkout badges.",

            rules.trust.noTrustBadges

        );

    }

    //-----------------------
    // Returns
    //-----------------------

    if(!data.returns.returnPolicy){

        score -= rules.returns.noReturnPolicy;

        addFinding(

            findings,

            "High",

            "Return Policy Missing",

            "Link return policy from cart.",

            rules.returns.noReturnPolicy

        );

    }

    if(score < 0){

        score = 0;

    }

    let grade = "F";

    if(score >= 90) grade = "A";
    else if(score >= 80) grade = "B";
    else if(score >= 70) grade = "C";
    else if(score >= 60) grade = "D";

    findings.sort((a,b)=>b.deduction-a.deduction);

    return{

        score,

        grade,

        findings

    };

}

module.exports = scoreAudit;