module.exports = function getTopLeak(findings) {

    if (!findings || findings.length === 0) {

        return null;

    }

    findings.sort((a, b) => b.deduction - a.deduction);

    return findings[0];

};