import { OCRResult, DocumentType } from '../types';

export function simulateOCR(imageBuffer: Buffer): Promise<OCRResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "This is a simulated OCR result.",
        confidence: 0.98,
        language: "en",
      });
    }, 500);
  });
}

export function extractMetadataFromOCR(ocrResult: OCRResult, documentType: DocumentType): Record<string, any> {
  const extractedData: Record<string, any> = {};
  
  // Simulate extracting different data based on document type
  switch (documentType) {
    case DocumentType.INVOICE:
      extractedData.invoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
      extractedData.customerName = "Sample Customer Inc.";
      extractedData.customerEmail = "customer@example.com";
      extractedData.totalAmount = Math.floor(Math.random() * 10000) / 100;
      extractedData.currency = "USD";
      extractedData.issueDate = new Date().toISOString().split('T')[0];
      extractedData.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      extractedData.items = [
        { description: "Consulting Services", quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: "Software License", quantity: 1, unitPrice: 299.99, total: 299.99 }
      ];
      break;
      
    case DocumentType.RECEIPT:
      extractedData.receiptNumber = `REC-${Math.floor(Math.random() * 10000)}`;
      extractedData.merchantName = "Sample Store";
      extractedData.merchantAddress = "123 Main St, City, State 12345";
      extractedData.totalAmount = Math.floor(Math.random() * 1000) / 100;
      extractedData.currency = "USD";
      extractedData.transactionDate = new Date().toISOString();
      extractedData.paymentMethod = "Credit Card";
      extractedData.items = [
        { description: "Product A", quantity: 2, unitPrice: 25.00, total: 50.00 },
        { description: "Product B", quantity: 1, unitPrice: 15.99, total: 15.99 }
      ];
      break;
      
    case DocumentType.CONTRACT:
      extractedData.contractNumber = `CON-${Math.floor(Math.random() * 10000)}`;
      extractedData.partyA = "Company A";
      extractedData.partyB = "Company B";
      extractedData.contractType = "Service Agreement";
      extractedData.effectiveDate = new Date().toISOString().split('T')[0];
      extractedData.expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      extractedData.totalValue = Math.floor(Math.random() * 100000) / 100;
      extractedData.currency = "USD";
      break;
  }
  
  return extractedData;
}

export function detectDocumentType(filename: string): DocumentType {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('invoice') || lowerFilename.includes('inv')) {
    return DocumentType.INVOICE;
  } else if (lowerFilename.includes('receipt') || lowerFilename.includes('rec')) {
    return DocumentType.RECEIPT;
  } else if (lowerFilename.includes('contract') || lowerFilename.includes('con')) {
    return DocumentType.CONTRACT;
  }
  
  // Default to invoice if type cannot be determined
  return DocumentType.INVOICE;
} 