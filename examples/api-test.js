const fs = require('fs');
const path = require('path');

// Simple HTTP client for testing
async function makeRequest(url, options = {}) {
  const http = require('http');
  const https = require('https');
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(urlObj, options, (res) => {
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
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🚀 Testing Document Processing Pipeline API\n');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await makeRequest(`${baseUrl}/health`);
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log('');
    
    // Test get all documents
    console.log('2. Testing get all documents...');
    const documents = await makeRequest(`${baseUrl}/api/documents`);
    console.log(`   Status: ${documents.status}`);
    console.log(`   Document count: ${documents.data.count || 0}`);
    console.log('');
    
    // Test get documents by status
    console.log('3. Testing get documents by status (validated)...');
    const validatedDocs = await makeRequest(`${baseUrl}/api/documents/status/validated`);
    console.log(`   Status: ${validatedDocs.status}`);
    console.log(`   Validated documents: ${validatedDocs.data.count || 0}`);
    console.log('');
    
    // Test get documents by status (failed)
    console.log('4. Testing get documents by status (failed)...');
    const failedDocs = await makeRequest(`${baseUrl}/api/documents/status/failed`);
    console.log(`   Status: ${failedDocs.status}`);
    console.log(`   Failed documents: ${failedDocs.data.count || 0}`);
    console.log('');
    
    // If we have documents, test getting a specific document status
    if (documents.data.documents && documents.data.documents.length > 0) {
      const firstDoc = documents.data.documents[0];
      console.log(`5. Testing get document status for ${firstDoc.id}...`);
      const docStatus = await makeRequest(`${baseUrl}/api/documents/${firstDoc.id}/status`);
      console.log(`   Status: ${docStatus.status}`);
      console.log(`   Document status: ${docStatus.data.status}`);
      console.log(`   Document type: ${docStatus.data.metadata?.documentType}`);
      console.log('');
    }
    
    console.log('✅ API tests completed successfully!');
    console.log('\n📝 To test file upload, you can:');
    console.log('   1. Open public/index.html in your browser');
    console.log('   2. Use curl: curl -X POST -F "document=@your-file.pdf" http://localhost:3000/api/documents/upload');
    console.log('   3. Use Postman or similar API testing tool');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the test
testAPI(); 