function calculateRevenue(monthlyTraffic, aov, score){

    const benchmarkCVR = 0.025;

    const currentCVR = benchmarkCVR * (score / 100);

    const benchmarkRevenue =
        monthlyTraffic * benchmarkCVR * aov;

    const currentRevenue =
        monthlyTraffic * currentCVR * aov;

    return {

        benchmarkRevenue: Math.round(benchmarkRevenue),

        estimatedRevenue: Math.round(currentRevenue),

        revenueLeak: Math.round(
            benchmarkRevenue - currentRevenue
        )

    };

}

module.exports = calculateRevenue;