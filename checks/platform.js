async function platformCheck(page) {

    const html = await page.content();

    let platform = "Unknown";

    if (
        html.includes("cdn.shopify.com") ||
        html.includes("Shopify.theme") ||
        html.toLowerCase().includes("shopify")
    ) {
        platform = "Shopify";
    }
    else if (html.toLowerCase().includes("woocommerce")) {
        platform = "WooCommerce";
    }
    else if (html.toLowerCase().includes("bigcommerce")) {
        platform = "BigCommerce";
    }
    else if (html.toLowerCase().includes("magento")) {
        platform = "Magento";
    }

    return {
        platform
    };

}

module.exports = platformCheck;