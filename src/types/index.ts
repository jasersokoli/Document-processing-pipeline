export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  VALIDATED = 'validated',
  FAILED = 'failed'
}

export enum DocumentType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  CONTRACT = 'contract'
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
}

export interface DocumentMetadata {
  documentId: string;
  originalName: string;
  fileSize: number;
  uploadDate: Date;
  documentType: DocumentType;
  extractedData: Record<string, any>;
  ocrResult?: OCRResult;
}

export interface DocumentRecord {
  id: string;
  status: DocumentStatus;
  metadata: DocumentMetadata;
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  missingFields: string[];
}

export interface ProcessingResult {
  success: boolean;
  documentId: string;
  status: DocumentStatus;
  metadata?: DocumentMetadata;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  message: string;
}

export interface StatusResponse {
  documentId: string;
  status: DocumentStatus;
  metadata?: DocumentMetadata;
  errorMessage?: string;
} 