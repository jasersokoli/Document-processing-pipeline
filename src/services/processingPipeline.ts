import { v4 as uuidv4 } from 'uuid';
import { 
  DocumentRecord, 
  DocumentStatus, 
  DocumentMetadata, 
  DocumentType, 
  ProcessingResult 
} from '../types';
import { simulateOCR, extractMetadataFromOCR, detectDocumentType } from './ocrService';
import { validateDocument } from './validationService';
import { StorageService } from './storageService';

export class ProcessingPipeline {
  private storageService: StorageService;
  
  constructor() {
    this.storageService = new StorageService();
  }
  
  async processDocument(
    fileBuffer: Buffer, 
    originalName: string, 
    fileSize: number
  ): Promise<ProcessingResult> {
    const documentId = uuidv4();
    const documentType = detectDocumentType(originalName);
    
    try {
      // Create initial document record
      const initialMetadata: DocumentMetadata = {
        documentId,
        originalName,
        fileSize,
        uploadDate: new Date(),
        documentType,
        extractedData: {}
      };
      
      const documentRecord: DocumentRecord = {
        id: documentId,
        status: DocumentStatus.UPLOADED,
        metadata: initialMetadata,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await this.storageService.saveDocument(documentRecord);
      
      // Update status to processing
      await this.storageService.updateDocumentStatus(documentId, DocumentStatus.PROCESSING);
      
      // Simulate OCR processing
      const ocrResult = await simulateOCR(fileBuffer);
      
      // Extract metadata from OCR result
      const extractedData = extractMetadataFromOCR(ocrResult, documentType);
      
      // Update metadata with OCR result and extracted data
      const updatedMetadata: DocumentMetadata = {
        ...initialMetadata,
        extractedData,
        ocrResult
      };
      
      await this.storageService.updateDocumentMetadata(documentId, updatedMetadata);
      
      // Validate the extracted data
      const validationResult = validateDocument(extractedData, documentType);
      
      if (validationResult.isValid) {
        await this.storageService.updateDocumentStatus(documentId, DocumentStatus.VALIDATED);
        
        return {
          success: true,
          documentId,
          status: DocumentStatus.VALIDATED,
          metadata: updatedMetadata
        };
      } else {
        const errorMessage = `Validation failed: ${validationResult.errors.join(', ')}`;
        await this.storageService.updateDocumentStatus(documentId, DocumentStatus.FAILED, errorMessage);
        
        return {
          success: false,
          documentId,
          status: DocumentStatus.FAILED,
          error: errorMessage
        };
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      await this.storageService.updateDocumentStatus(documentId, DocumentStatus.FAILED, errorMessage);
      
      return {
        success: false,
        documentId,
        status: DocumentStatus.FAILED,
        error: errorMessage
      };
    }
  }
  
  async getDocumentStatus(documentId: string): Promise<DocumentRecord | null> {
    return await this.storageService.getDocument(documentId);
  }
  
  async getAllDocuments(): Promise<DocumentRecord[]> {
    return await this.storageService.getAllDocuments();
  }
  
  async getDocumentsByStatus(status: DocumentStatus): Promise<DocumentRecord[]> {
    return await this.storageService.getDocumentsByStatus(status);
  }
} 