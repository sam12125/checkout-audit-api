const benchmark = require("./benchmarkData.json");

module.exports = function getBenchmark(data) {

    const avg = benchmark[data.platform];

    if (!avg) {

        return null;

    }

    return {

        platform: data.platform,

        yourMobileScore: data.mobileScore,

        averageMobileScore: avg.avgMobileScore,

        difference:

            data.mobileScore - avg.avgMobileScore,

        checkoutScore:

            data.categoryScores.checkoutExperience,

        averageCheckout:

            avg.avgCheckout,

        trustScore:

            data.categoryScores.trust,

        averageTrust:

            avg.avgTrust

    };

};