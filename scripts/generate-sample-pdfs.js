const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function generateSampleInvoice() {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(path.join(__dirname, '..', 'samples', 'invoice-sample.pdf'));
  doc.pipe(stream);

  // Header
  doc.fontSize(24).text('INVOICE', { align: 'center' });
  doc.moveDown();

  // Invoice details
  doc.fontSize(12);
  doc.text(`Invoice Number: INV-2024-001`);
  doc.text(`Date: ${new Date().toISOString().split('T')[0]}`);
  doc.text(`Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
  doc.moveDown();

  // Bill to section
  doc.fontSize(14).text('Bill To:', { underline: true });
  doc.fontSize(12);
  doc.text('Sample Customer Inc.');
  doc.text('123 Business Street');
  doc.text('City, State 12345');
  doc.text('customer@example.com');
  doc.moveDown();

  // Items table
  doc.fontSize(14).text('Items:', { underline: true });
  doc.moveDown();

  // Table headers
  doc.fontSize(10);
  doc.text('Description', 50, doc.y);
  doc.text('Quantity', 300, doc.y - 12);
  doc.text('Unit Price', 400, doc.y - 12);
  doc.text('Total', 500, doc.y - 12);
  doc.moveDown();

  // Table rows
  doc.text('Consulting Services', 50, doc.y);
  doc.text('1', 300, doc.y - 12);
  doc.text('$150.00', 400, doc.y - 12);
  doc.text('$150.00', 500, doc.y - 12);
  doc.moveDown();

  doc.text('Software License', 50, doc.y);
  doc.text('1', 300, doc.y - 12);
  doc.text('$299.99', 400, doc.y - 12);
  doc.text('$299.99', 500, doc.y - 12);
  doc.moveDown(2);

  // Total
  doc.fontSize(14).text('Total Amount: $449.99', { align: 'right' });
  doc.text('Currency: USD', { align: 'right' });
  doc.moveDown();

  // Footer
  doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

function generateSampleReceipt() {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(path.join(__dirname, '..', 'samples', 'receipt-sample.pdf'));
  doc.pipe(stream);

  // Header
  doc.fontSize(24).text('RECEIPT', { align: 'center' });
  doc.moveDown();

  // Receipt details
  doc.fontSize(12);
  doc.text(`Receipt Number: REC-2024-001`);
  doc.text(`Date: ${new Date().toISOString()}`);
  doc.text(`Payment Method: Credit Card`);
  doc.moveDown();

  // Merchant info
  doc.fontSize(14).text('Merchant:', { underline: true });
  doc.fontSize(12);
  doc.text('Sample Store');
  doc.text('123 Main St, City, State 12345');
  doc.moveDown();

  // Items
  doc.fontSize(14).text('Items:', { underline: true });
  doc.moveDown();

  doc.fontSize(10);
  doc.text('Product A (2x)', 50, doc.y);
  doc.text('$50.00', 400, doc.y - 12);
  doc.moveDown();

  doc.text('Product B (1x)', 50, doc.y);
  doc.text('$15.99', 400, doc.y - 12);
  doc.moveDown(2);

  // Total
  doc.fontSize(14).text('Total Amount: $65.99', { align: 'right' });
  doc.text('Currency: USD', { align: 'right' });
  doc.moveDown();

  // Footer
  doc.fontSize(10).text('Thank you for your purchase!', { align: 'center' });

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

function generateSampleContract() {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(path.join(__dirname, '..', 'samples', 'contract-sample.pdf'));
  doc.pipe(stream);

  // Header
  doc.fontSize(24).text('CONTRACT', { align: 'center' });
  doc.moveDown();

  // Contract details
  doc.fontSize(12);
  doc.text(`Contract Number: CON-2024-001`);
  doc.text(`Contract Type: Service Agreement`);
  doc.text(`Effective Date: ${new Date().toISOString().split('T')[0]}`);
  doc.text(`Expiration Date: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
  doc.moveDown();

  // Parties
  doc.fontSize(14).text('Parties:', { underline: true });
  doc.fontSize(12);
  doc.text('Party A: Company A');
  doc.text('Party B: Company B');
  doc.moveDown();

  // Contract value
  doc.fontSize(14).text('Contract Value: $10,000.00', { underline: true });
  doc.text('Currency: USD');
  doc.moveDown();

  // Terms
  doc.fontSize(14).text('Terms and Conditions:', { underline: true });
  doc.fontSize(12);
  doc.text('This agreement outlines the service terms between Company A and Company B.');
  doc.text('All services will be provided according to the specifications outlined in this contract.');
  doc.text('Payment terms: Net 30 days from invoice date.');
  doc.moveDown();

  // Signature lines
  doc.fontSize(12);
  doc.text('Party A Signature: _________________', 50, doc.y);
  doc.text('Date: _________________', 50, doc.y + 20);
  doc.moveDown();

  doc.text('Party B Signature: _________________', 300, doc.y);
  doc.text('Date: _________________', 300, doc.y + 20);

  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

async function createSampleFiles() {
  const samplesDir = path.join(__dirname, '..', 'samples');
  
  // Create samples directory if it doesn't exist
  if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir, { recursive: true });
  }

  console.log('📄 Generating real PDF files...\n');

  try {
    // Generate sample files
    console.log('Creating invoice-sample.pdf...');
    await generateSampleInvoice();
    console.log('✅ Created invoice-sample.pdf');

    console.log('Creating receipt-sample.pdf...');
    await generateSampleReceipt();
    console.log('✅ Created receipt-sample.pdf');

    console.log('Creating contract-sample.pdf...');
    await generateSampleContract();
    console.log('✅ Created contract-sample.pdf');

    console.log('\n📁 Real PDF files created in the "samples" directory');
    console.log('You can now open these files in any PDF viewer!');
    console.log('Upload them to test the document processing pipeline.');
    
  } catch (error) {
    console.error('❌ Error generating PDF files:', error.message);
  }
}

// Run the script
createSampleFiles(); 