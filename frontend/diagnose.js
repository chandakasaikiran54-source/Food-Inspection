import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message, error.stack));

    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Also get the DOM inner HTML of root
    const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML);
    console.log('ROOT HTML:', rootHtml?.substring(0, 500));

    await browser.close();
})();
