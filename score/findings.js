function addFinding(findings, severity, title, recommendation, points){

    findings.push({

        severity,

        title,

        recommendation,

        deduction: points

    });

}

module.exports = {
    addFinding
};