import puppeteer from 'puppeteer';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle0' });
await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '16mm', right: '16mm' }
});
await browser.close();
console.log('PDF generated:', outputPath);
