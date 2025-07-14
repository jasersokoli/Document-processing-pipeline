import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { ProcessingPipeline } from './services/processingPipeline';
import { DocumentStatus, UploadResponse, StatusResponse } from './types';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/bmp'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
  }
});

const processingPipeline = new ProcessingPipeline();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Upload document endpoint
app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const result = await processingPipeline.processDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.size
    );

    const response: UploadResponse = {
      success: result.success,
      documentId: result.documentId,
      message: result.success 
        ? 'Document uploaded and processing started' 
        : `Processing failed: ${result.error}`
    };

    res.status(result.success ? 200 : 400).json(response);
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get document status endpoint
app.get('/api/documents/:documentId/status', async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await processingPipeline.getDocumentStatus(documentId);
    
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document not found' 
      });
    }

    const response: StatusResponse = {
      documentId: document.id,
      status: document.status,
      metadata: document.metadata,
      errorMessage: document.errorMessage
    };

    res.json(response);
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get all documents endpoint
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await processingPipeline.getAllDocuments();
    res.json({ 
      success: true, 
      documents,
      count: documents.length 
    });
    
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get documents by status endpoint
app.get('/api/documents/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!Object.values(DocumentStatus).includes(status as DocumentStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status' 
      });
    }

    const documents = await processingPipeline.getDocumentsByStatus(status as DocumentStatus);
    res.json({ 
      success: true, 
      documents,
      count: documents.length,
      status 
    });
    
  } catch (error) {
    console.error('Get documents by status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    error: error.message || 'Internal server error' 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Document processing pipeline server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Upload endpoint: http://localhost:${port}/api/documents/upload`);
}); 