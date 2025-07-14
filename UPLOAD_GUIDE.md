# 📄 PDF Upload Guide - Document Processing Pipeline

This guide shows you how to upload PDF files (invoices, receipts, contracts) to the document processing pipeline and test the functionality.

## 🚀 Quick Start

### 1. Start the Server
```bash
npm start
```

### 2. Upload PDFs via Web Interface (Recommended)
1. Open `public/index.html` in your browser
2. Drag and drop PDF files or click to select them
3. Watch real-time processing status
4. View extracted metadata and validation results

## 📁 Sample Files

We've created sample PDF files for testing:

- `samples/invoice-sample.pdf` - Sample invoice document
- `samples/receipt-sample.pdf` - Sample receipt document  
- `samples/contract-sample.pdf` - Sample contract document

## 🔧 Upload Methods

### Method 1: Web Interface (Easiest)
1. **Start the server**: `npm start`
2. **Open browser**: Navigate to `public/index.html`
3. **Upload files**: Drag and drop or click to select PDF files
4. **Monitor processing**: Real-time status updates and results

### Method 2: curl Commands
```bash
# Upload an invoice
curl -X POST -F "document=@samples/invoice-sample.pdf" http://localhost:3000/api/documents/upload

# Upload a receipt
curl -X POST -F "document=@samples/receipt-sample.pdf" http://localhost:3000/api/documents/upload

# Upload a contract
curl -X POST -F "document=@samples/contract-sample.pdf" http://localhost:3000/api/documents/upload

# Upload your own PDF
curl -X POST -F "document=@your-file.pdf" http://localhost:3000/api/documents/upload
```

### Method 3: Automated Test Script
```bash
# Run the automated upload test
node scripts/test-upload.js
```

### Method 4: Postman or Similar Tools
- **URL**: `http://localhost:3000/api/documents/upload`
- **Method**: POST
- **Body**: form-data
- **Key**: `document`
- **Value**: Select your PDF file

## 📊 Expected Results

### Invoice Processing
When you upload an invoice PDF, you should see:
```json
{
  "success": true,
  "documentId": "uuid",
  "message": "Document uploaded and processing started"
}
```

After processing, the extracted data will include:
- `invoiceNumber`: INV-XXXX
- `customerName`: Sample Customer Inc.
- `totalAmount`: Random amount
- `currency`: USD
- `issueDate`: Current date
- `dueDate`: 30 days from issue
- `items`: Array of line items

### Receipt Processing
Receipt uploads will extract:
- `receiptNumber`: REC-XXXX
- `merchantName`: Sample Store
- `totalAmount`: Random amount
- `currency`: USD
- `transactionDate`: Current timestamp
- `paymentMethod`: Credit Card
- `items`: Array of purchased items

### Contract Processing
Contract uploads will extract:
- `contractNumber`: CON-XXXX
- `partyA`: Company A
- `partyB`: Company B
- `contractType`: Service Agreement
- `effectiveDate`: Current date
- `expirationDate`: 1 year from effective date
- `totalValue`: Random amount
- `currency`: USD

## 🔍 Monitoring Uploads

### Check Document Status
```bash
# Get all documents
curl http://localhost:3000/api/documents

# Get documents by status
curl http://localhost:3000/api/documents/status/validated
curl http://localhost:3000/api/documents/status/failed

# Get specific document status
curl http://localhost:3000/api/documents/{documentId}/status
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🧪 Testing Examples

### Example 1: Upload and Check Status
```bash
# 1. Upload a file
curl -X POST -F "document=@samples/invoice-sample.pdf" http://localhost:3000/api/documents/upload

# 2. Wait for processing (2-3 seconds)
sleep 3

# 3. Check all documents
curl http://localhost:3000/api/documents
```

### Example 2: Batch Upload
```bash
# Upload multiple files
for file in samples/*.pdf; do
  echo "Uploading $file..."
  curl -X POST -F "document=@$file" http://localhost:3000/api/documents/upload
  sleep 1
done
```

### Example 3: Check Processing Status
```bash
# Get validated documents
curl http://localhost:3000/api/documents/status/validated | jq '.documents[] | {name: .metadata.originalName, type: .metadata.documentType, status: .status}'
```

## 📋 Supported File Types

The pipeline supports:
- **PDF**: `.pdf`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.tiff`, `.bmp`
- **File Size**: Up to 10MB

## 🎯 Document Type Detection

The system automatically detects document type based on filename:
- Files containing "invoice" or "inv" → Invoice processing
- Files containing "receipt" or "rec" → Receipt processing  
- Files containing "contract" or "con" → Contract processing
- Default → Invoice processing

## ⚠️ Common Issues

### File Upload Fails
- **Check file size**: Must be under 10MB
- **Check file type**: Only PDF and image files supported
- **Check server**: Ensure server is running (`npm start`)

### Processing Fails
- **Check filename**: Ensure it contains type keywords (invoice, receipt, contract)
- **Check server logs**: Look for error messages in console
- **Check storage**: Ensure write permissions in project directory

### Status Not Updating
- **Wait for processing**: OCR simulation takes ~500ms
- **Refresh status**: Use the status endpoint to check current state
- **Check validation**: Failed validation will show error messages

## 🔧 Advanced Usage

### Custom File Upload Script
```javascript
const FormData = require('form-data');
const fs = require('fs');

async function uploadFile(filePath) {
  const form = new FormData();
  form.append('document', fs.createReadStream(filePath));
  
  const response = await fetch('http://localhost:3000/api/documents/upload', {
    method: 'POST',
    body: form
  });
  
  return response.json();
}

// Usage
uploadFile('path/to/your/file.pdf').then(result => {
  console.log('Upload result:', result);
});
```

### Monitoring Script
```javascript
async function monitorDocument(documentId) {
  const response = await fetch(`http://localhost:3000/api/documents/${documentId}/status`);
  const doc = await response.json();
  
  console.log(`Status: ${doc.status}`);
  if (doc.metadata?.extractedData) {
    console.log('Extracted data:', doc.metadata.extractedData);
  }
}
```

## 🎉 Success Indicators

Your upload is successful when you see:
- ✅ **Upload response**: `{"success": true, "documentId": "uuid"}`
- ✅ **Status**: `"validated"` (not "failed")
- ✅ **Extracted data**: Contains relevant fields for document type
- ✅ **No errors**: No error messages in response

## 📈 Performance Notes

- **Processing time**: ~500ms per document (OCR simulation)
- **Concurrent uploads**: Supported (Node.js event loop)
- **File size impact**: Larger files may take longer to upload
- **Memory usage**: Files are processed in memory (up to 10MB)

## 🚀 Next Steps

1. **Try the web interface**: Open `public/index.html` for the best experience
2. **Upload your own files**: Test with real invoices, receipts, or contracts
3. **Check the API**: Explore all available endpoints
4. **Extend the pipeline**: Add new document types or processing stages

Happy uploading! 🎉 