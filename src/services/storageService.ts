import * as fs from 'fs-extra';
import * as path from 'path';
import { DocumentRecord, DocumentStatus, DocumentMetadata } from '../types';

export class StorageService {
  private readonly storageDir: string;
  private readonly documentsFile: string;
  
  constructor() {
    this.storageDir = path.join(process.cwd(), 'storage');
    this.documentsFile = path.join(this.storageDir, 'documents.json');
    this.ensureStorageExists();
  }
  
  private async ensureStorageExists(): Promise<void> {
    await fs.ensureDir(this.storageDir);
    if (!await fs.pathExists(this.documentsFile)) {
      await fs.writeJson(this.documentsFile, []);
    }
  }
  
  async saveDocument(document: DocumentRecord): Promise<void> {
    const documents = await this.getAllDocuments();
    const existingIndex = documents.findIndex(doc => doc.id === document.id);
    
    if (existingIndex >= 0) {
      documents[existingIndex] = document;
    } else {
      documents.push(document);
    }
    
    await fs.writeJson(this.documentsFile, documents, { spaces: 2 });
  }
  
  async getDocument(documentId: string): Promise<DocumentRecord | null> {
    const documents = await this.getAllDocuments();
    return documents.find(doc => doc.id === documentId) || null;
  }
  
  async getAllDocuments(): Promise<DocumentRecord[]> {
    try {
      return await fs.readJson(this.documentsFile);
    } catch (error) {
      return [];
    }
  }
  
  async updateDocumentStatus(documentId: string, status: DocumentStatus, errorMessage?: string): Promise<void> {
    const document = await this.getDocument(documentId);
    if (document) {
      document.status = status;
      document.updatedAt = new Date();
      if (errorMessage) {
        document.errorMessage = errorMessage;
      }
      await this.saveDocument(document);
    }
  }
  
  async updateDocumentMetadata(documentId: string, metadata: DocumentMetadata): Promise<void> {
    const document = await this.getDocument(documentId);
    if (document) {
      document.metadata = metadata;
      document.updatedAt = new Date();
      await this.saveDocument(document);
    }
  }
  
  async getDocumentsByStatus(status: DocumentStatus): Promise<DocumentRecord[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.status === status);
  }
  
  async deleteDocument(documentId: string): Promise<boolean> {
    const documents = await this.getAllDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== documentId);
    
    if (filteredDocuments.length < documents.length) {
      await fs.writeJson(this.documentsFile, filteredDocuments, { spaces: 2 });
      return true;
    }
    
    return false;
  }
} 