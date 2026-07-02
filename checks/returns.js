async function returnsCheck(page) {

    const result = {

        returnPolicy: false,
        refundPolicy: false,
        exchangePolicy: false,
        returnDays: null,
       returnsLink:null

    };

    try {

        const body = (
            await page.locator("body").innerText()
        ).toLowerCase();

        const links = await page.$$eval("a", anchors =>
            anchors.map(a => ({
                text: a.innerText,
                href: a.href
            }))
        );

        result.returnPolicy =
            /return policy|returns/.test(body);

        result.refundPolicy =
            /refund policy|refunds/.test(body);

        result.exchangePolicy =
            /exchange/.test(body);

        // Detect days

        const days = body.match(
            /(\d+)\s?(day|days)/i
        );

        if (days) {

            result.returnDays = Number(days[1]);

        }

        // Find Returns Link

        const returnLink = links.find(link => {

            const text = link.text.toLowerCase();

            return (
                text.includes("return") ||
                text.includes("refund")
            );

        });

        if (returnLink) {

            result.returnsLink = returnLink.href;

        }

        return result;

    }

    catch (err) {

        result.error = err.message;

        return result;

    }

}

module.exports = returnsCheck;