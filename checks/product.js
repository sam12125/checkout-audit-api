async function productCheck(page) {

    const links = await page.$$eval("a", links =>
        links.map(link => link.href)
    );

    const productPage =
        links.find(link => link.includes("/products/")) ||
        links.find(link => link.includes("/product/")) ||
        null;

    if (!productPage) {

        return {
            found: false
        };

    }

    await page.goto(productPage, {
        waitUntil: "domcontentloaded",
        timeout: 60000
    });

    await page.waitForTimeout(3000);

    const body = await page.locator("body").innerText();

    const addToCart =
        /add to cart|add to bag/i.test(body);

    const buyNow =
        /buy now|buy it now/i.test(body);

    const variantSelector =
        /select a size|size guide|colour|color|variant/i.test(body);

    const reviewMatch =
        body.match(/\((\d+)\)/);

    const ratingMatch =
        body.match(/([0-5]\.[0-9])/);

    return {

        found: true,

        productPage,

        addToCart,

        buyNow,

        variantSelector,

        rating:
            ratingMatch ?
            ratingMatch[1] :
            null,

        reviewCount:
            reviewMatch ?
            parseInt(reviewMatch[1]) :
            0

    };

}

module.exports = productCheck;