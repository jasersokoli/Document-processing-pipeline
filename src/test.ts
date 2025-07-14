import { ProcessingPipeline } from './services/processingPipeline';
import { DocumentType } from './types';

async function testPipeline() {
  console.log('Testing Document Processing Pipeline\n');
  
  const pipeline = new ProcessingPipeline();
  
  // Create a mock file buffer
  const mockBuffer = Buffer.from('Mock document content');
  
  // Test different document types
  const testCases = [
    { name: 'invoice.pdf', type: DocumentType.INVOICE },
    { name: 'receipt.jpg', type: DocumentType.RECEIPT },
    { name: 'contract.docx', type: DocumentType.CONTRACT }
  ];
  
  for (const testCase of testCases) {
    console.log(`Processing ${testCase.name}...`);
    
    try {
      const result = await pipeline.processDocument(
        mockBuffer,
        testCase.name,
        1024
      );
      
      if (result.success) {
        console.log(`Success! Document ID: ${result.documentId}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Type: ${result.metadata?.documentType}`);
        console.log(`   Extracted Data:`, result.metadata?.extractedData);
      } else {
        console.log(`Failed: ${result.error}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`Error processing ${testCase.name}:`, error);
    }
  }
  
  // Test status retrieval
  console.log('Retrieving all documents...');
  const allDocuments = await pipeline.getAllDocuments();
  console.log(`Found ${allDocuments.length} documents`);
  
  for (const doc of allDocuments) {
    console.log(`   - ${doc.metadata.originalName} (${doc.status})`);
  }
  
  console.log('\nTest completed!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPipeline().catch(console.error);
}

export { testPipeline }; 