async function viewportCheck(page) {

    const result = {

        viewportMeta: false,
        responsive: false,
        initialScale: null,
        width: null

    };

    try {

        const viewport = await page.$('meta[name="viewport"]');

        if (viewport) {

            result.viewportMeta = true;

            const content = await viewport.getAttribute("content");

            if (content) {

                result.responsive =
                    content.includes("width=device-width");

                const widthMatch =
                    content.match(/width=([^,]+)/i);

                if (widthMatch) {

                    result.width = widthMatch[1];

                }

                const scaleMatch =
                    content.match(/initial-scale=([\d.]+)/i);

                if (scaleMatch) {

                    result.initialScale = scaleMatch[1];

                }

            }

        }

        return result;

    } catch (err) {

        result.error = err.message;

        return result;

    }

}

module.exports = viewportCheck;