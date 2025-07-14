const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Simple HTTP client for file uploads
async function uploadFile(filePath, baseUrl = 'http://localhost:3000') {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const url = require('url');
    
    const fileStream = fs.createReadStream(filePath);
    const form = new FormData();
    form.append('document', fileStream);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/documents/upload',
      method: 'POST',
      headers: form.getHeaders()
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    form.pipe(req);
  });
}

async function getDocumentStatus(documentId, baseUrl = 'http://localhost:3000') {
  const http = require('http');
  
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/documents/${documentId}/status`,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function getAllDocuments(baseUrl = 'http://localhost:3000') {
  const http = require('http');
  
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/documents',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testUploads() {
  console.log('🚀 Testing Document Upload and Processing Pipeline\n');
  
  const samplesDir = path.join(__dirname, '..', 'samples');
  const sampleFiles = [
    'invoice-sample.pdf',
    'receipt-sample.pdf', 
    'contract-sample.pdf'
  ];
  
  const uploadResults = [];
  
  // Upload each sample file
  for (const fileName of sampleFiles) {
    const filePath = path.join(samplesDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${fileName}`);
      continue;
    }
    
    console.log(`📤 Uploading ${fileName}...`);
    
    try {
      const result = await uploadFile(filePath);
      
      if (result.status === 200 && result.data.success) {
        console.log(`✅ Upload successful! Document ID: ${result.data.documentId}`);
        uploadResults.push({
          fileName,
          documentId: result.data.documentId,
          success: true
        });
      } else {
        console.log(`❌ Upload failed: ${result.data.error || 'Unknown error'}`);
        uploadResults.push({
          fileName,
          success: false,
          error: result.data.error
        });
      }
    } catch (error) {
      console.log(`❌ Upload error for ${fileName}: ${error.message}`);
      uploadResults.push({
        fileName,
        success: false,
        error: error.message
      });
    }
    
    console.log('');
  }
  
  // Wait a moment for processing to complete
  console.log('⏳ Waiting for processing to complete...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check status of uploaded documents
  console.log('📊 Checking document statuses...\n');
  
  for (const result of uploadResults) {
    if (result.success) {
      try {
        const statusResult = await getDocumentStatus(result.documentId);
        
        if (statusResult.status === 200) {
          const doc = statusResult.data;
          console.log(`📄 ${result.fileName}:`);
          console.log(`   Status: ${doc.status}`);
          console.log(`   Type: ${doc.metadata?.documentType}`);
          
          if (doc.metadata?.extractedData) {
            console.log(`   Extracted Data:`);
            Object.entries(doc.metadata.extractedData).forEach(([key, value]) => {
              if (typeof value === 'object') {
                console.log(`     ${key}: [Object]`);
              } else {
                console.log(`     ${key}: ${value}`);
              }
            });
          }
          
          if (doc.errorMessage) {
            console.log(`   Error: ${doc.errorMessage}`);
          }
        } else {
          console.log(`❌ Failed to get status for ${result.fileName}`);
        }
      } catch (error) {
        console.log(`❌ Error checking status for ${result.fileName}: ${error.message}`);
      }
      
      console.log('');
    }
  }
  
  // Show all documents
  console.log('📋 All Documents Summary:');
  try {
    const allDocs = await getAllDocuments();
    if (allDocs.status === 200 && allDocs.data.success) {
      console.log(`Total documents: ${allDocs.data.count}`);
      allDocs.data.documents.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.metadata.originalName} (${doc.status})`);
      });
    }
  } catch (error) {
    console.log(`❌ Error getting all documents: ${error.message}`);
  }
  
  console.log('\n🎉 Upload and processing test completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Open public/index.html in your browser to see the web interface');
  console.log('   2. Try uploading your own PDF files');
  console.log('   3. Check the API endpoints for more details');
}

// Run the test
testUploads().catch(console.error); 