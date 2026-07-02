async function homepageCheck(page) {

    const title = await page.title();

    const description = await page
        .$eval('meta[name="description"]', el => el.content)
        .catch(() => "");

    const viewport = await page.$('meta[name="viewport"]');

    const language = await page
        .$eval("html", el => el.lang)
        .catch(() => "");

    const ssl = page.url().startsWith("https");

    const search = await page.$('input[type="search"],input[name="q"]');

    return {
        title,
        description,
        language,
        ssl,
        viewport: !!viewport,
        search: !!search
    };
}

module.exports = homepageCheck;