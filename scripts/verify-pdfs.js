const fs = require('fs');
const path = require('path');

function verifyPDFFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check if it's a valid PDF by looking for PDF header
    const header = buffer.toString('ascii', 0, 4);
    if (header === '%PDF') {
      const stats = fs.statSync(filePath);
      console.log(`${path.basename(filePath)} - Valid PDF (${(stats.size / 1024).toFixed(1)}KB)`);
      return true;
    } else {
      console.log(`${path.basename(filePath)} - Not a valid PDF`);
      return false;
    }
  } catch (error) {
    console.log(`${path.basename(filePath)} - Error reading file: ${error.message}`);
    return false;
  }
}

function verifyAllPDFs() {
  console.log('Verifying PDF files...\n');
  
  const samplesDir = path.join(__dirname, '..', 'samples');
  const pdfFiles = [
    'invoice-sample.pdf',
    'receipt-sample.pdf',
    'contract-sample.pdf'
  ];
  
  let validCount = 0;
  let totalCount = 0;
  
  pdfFiles.forEach(fileName => {
    const filePath = path.join(samplesDir, fileName);
    if (fs.existsSync(filePath)) {
      totalCount++;
      if (verifyPDFFile(filePath)) {
        validCount++;
      }
    } else {
      console.log(`${fileName} - File not found`);
    }
  });
  
  console.log(`\nSummary: ${validCount}/${totalCount} PDF files are valid`);
  
  if (validCount === totalCount) {
    console.log('All PDF files are valid and ready for upload!');
    console.log('\nYou can now:');
    console.log('   1. Open these files in any PDF viewer');
    console.log('   2. Upload them to the document processing pipeline');
    console.log('   3. Test with the web interface at public/index.html');
  } else {
    console.log('Some PDF files have issues. Please regenerate them.');
  }
}

// Run the verification
verifyAllPDFs(); 