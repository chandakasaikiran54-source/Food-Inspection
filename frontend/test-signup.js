import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

    page.on('response', async response => {
        if (response.url().includes('/auth/signup')) {
            console.log('API RESPONSE STATUS:', response.status());
            const text = await response.text();
            console.log('API RESPONSE BODY:', text);
        }
    });

    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });

    // Fill out the signup form as an Inspector
    await page.type('input[name="fullName"]', 'Test Inspector');
    await page.type('input[name="email"]', 'inspector@gvmc.gov.in');
    await page.type('input[name="password"]', 'Password123');
    await page.type('input[name="confirmPassword"]', 'Password123');

    // The role should already default to 'INSPECTOR', but just in case
    await page.select('select[name="role"]', 'INSPECTOR');

    // Click submit
    console.log('Submitting form...');
    await page.click('button[type="submit"]');

    // Wait for the button to settle or toast to appear
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
})();
