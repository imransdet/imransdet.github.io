const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Starting PDF generation...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Load the index.html file
  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  console.log('Loading:', htmlPath);
  
  await page.goto(htmlPath, {
    waitUntil: 'networkidle0'
  });
  
  // Hide elements that shouldn't appear in PDF
  await page.evaluate(() => {
    // Hide scroll to top button
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) scrollBtn.style.display = 'none';
    
    // Hide sticky header
    const stickyHeader = document.getElementById('stickyHeader');
    if (stickyHeader) stickyHeader.style.display = 'none';
    
    // Hide "View All Projects" button
    const seeAllBtn = document.querySelector('.see-all-projects');
    if (seeAllBtn) seeAllBtn.style.display = 'none';
  });
  
  // Generate PDF
  const pdfPath = path.resolve(__dirname, 'resume', 'Al_Imran_QA_Engineer_Resume.pdf');
  console.log('Generating PDF to:', pdfPath);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  
  console.log('PDF generated successfully!');
  await browser.close();
})();

