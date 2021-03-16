const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  page.on('dialog', async dialog => {
    await dialog.accept("Beltrano");
  });
  await page.goto("https://eduardoalves0621.github.io/Novo/");
  

  const body = await page.$eval('body', el => el.innerHTML);
  console.log(body);
  await browser.close();
})();