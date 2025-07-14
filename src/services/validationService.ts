import { ValidationResult, DocumentType } from '../types';

export function validateDocument(extractedData: Record<string, any>, documentType: DocumentType): ValidationResult {
  const errors: string[] = [];
  const missingFields: string[] = [];
  
  const requiredFields = getRequiredFields(documentType);
  
  for (const field of requiredFields) {
    if (!extractedData[field] || extractedData[field] === '') {
      missingFields.push(field);
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Additional validation rules
  switch (documentType) {
    case DocumentType.INVOICE:
      if (extractedData.totalAmount && extractedData.totalAmount <= 0) {
        errors.push('Invoice total amount must be greater than 0');
      }
      if (extractedData.invoiceNumber && !extractedData.invoiceNumber.startsWith('INV-')) {
        errors.push('Invoice number must start with INV-');
      }
      break;
      
    case DocumentType.RECEIPT:
      if (extractedData.totalAmount && extractedData.totalAmount <= 0) {
        errors.push('Receipt total amount must be greater than 0');
      }
      if (extractedData.receiptNumber && !extractedData.receiptNumber.startsWith('REC-')) {
        errors.push('Receipt number must start with REC-');
      }
      break;
      
    case DocumentType.CONTRACT:
      if (extractedData.totalValue && extractedData.totalValue <= 0) {
        errors.push('Contract total value must be greater than 0');
      }
      if (extractedData.contractNumber && !extractedData.contractNumber.startsWith('CON-')) {
        errors.push('Contract number must start with CON-');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    missingFields
  };
}

function getRequiredFields(documentType: DocumentType): string[] {
  switch (documentType) {
    case DocumentType.INVOICE:
      return ['invoiceNumber', 'customerName', 'totalAmount', 'currency', 'issueDate'];
      
    case DocumentType.RECEIPT:
      return ['receiptNumber', 'merchantName', 'totalAmount', 'currency', 'transactionDate'];
      
    case DocumentType.CONTRACT:
      return ['contractNumber', 'partyA', 'partyB', 'contractType', 'effectiveDate', 'totalValue'];
      
    default:
      return [];
  }
} 