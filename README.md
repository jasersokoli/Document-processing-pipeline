# Document Processing Pipeline

A multi-stage document processing pipeline prototype built with TypeScript and Express. This system automatically processes, extracts, validates, and persists information from various document types (invoices, receipts, contracts) to make them available for downstream business processes.

## Features

### 1. Document Upload
- **REST API Endpoint**: `POST /api/documents/upload`
- **File Support**: PDF, JPEG, PNG, TIFF, BMP
- **File Size Limit**: 10MB
- **Drag & Drop Interface**: Modern web interface for easy file uploads

### 2. Document Processing
- **OCR Simulation**: Simulates optical character recognition with realistic processing delays
- **Document Type Detection**: Automatically detects document type based on filename
- **Metadata Extraction**: Extracts relevant data based on document type:
  - **Invoices**: Invoice number, customer info, amounts, dates, line items
  - **Receipts**: Receipt number, merchant info, transaction details, items
  - **Contracts**: Contract number, parties, terms, values, dates

### 3. Validation
- **Required Field Validation**: Ensures all required fields are present
- **Business Rule Validation**: Validates data format and business logic
- **Type-Specific Validation**: Different validation rules for each document type

### 4. Persistence & Status Management
- **File-Based Storage**: JSON-based document storage system
- **Status Tracking**: Real-time status updates (uploaded → processing → validated/failed)
- **Error Handling**: Comprehensive error tracking and reporting

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Document      │    │   Processing     │    │   Storage       │
│   Upload        │───▶│   Pipeline       │───▶│   Service       │
│   (API)         │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Validation     │
                       │   Service        │
                       └──────────────────┘
```

### Core Components

1. **API Server** (`src/index.ts`)
   - Express.js REST API
   - File upload handling with Multer
   - CORS support for web interface

2. **Processing Pipeline** (`src/services/processingPipeline.ts`)
   - Orchestrates the entire processing workflow
   - Manages document lifecycle and status updates

3. **OCR Service** (`src/services/ocrService.ts`)
   - Simulates OCR processing with realistic delays
   - Extracts metadata based on document type
   - Document type detection from filename

4. **Validation Service** (`src/services/validationService.ts`)
   - Validates required fields for each document type
   - Business rule validation
   - Error reporting

5. **Storage Service** (`src/services/storageService.ts`)
   - File-based JSON storage
   - Document CRUD operations
   - Status management

## API Endpoints

### Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data

document: [file]
```

**Response:**
```json
{
  "success": true,
  "documentId": "uuid",
  "message": "Document uploaded and processing started"
}
```

### Get Document Status
```http
GET /api/documents/{documentId}/status
```

**Response:**
```json
{
  "documentId": "uuid",
  "status": "validated",
  "metadata": {
    "documentId": "uuid",
    "originalName": "invoice.pdf",
    "fileSize": 1024,
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "documentType": "invoice",
    "extractedData": {
      "invoiceNumber": "INV-1234",
      "customerName": "Sample Customer Inc.",
      "totalAmount": 449.99,
      "currency": "USD"
    }
  }
}
```

### Get All Documents
```http
GET /api/documents
```

### Get Documents by Status
```http
GET /api/documents/status/{status}
```

### Health Check
```http
GET /health
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-processing-pipeline
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Usage

1. **Start the server**
   ```bash
   npm start
   ```

2. **Access the web interface**
   Open `public/index.html` in your browser or serve it with a local server

3. **Upload documents**
   - Use the web interface to drag and drop files
   - Or use curl/Postman to upload via API

4. **Monitor processing**
   - Check document status via API or web interface
   - View extracted metadata and validation results

## Document Types & Validation

### Invoice Documents
**Required Fields:**
- `invoiceNumber` (must start with "INV-")
- `customerName`
- `totalAmount` (must be > 0)
- `currency`
- `issueDate`

**Extracted Data:**
- Invoice number, customer information, amounts, dates
- Line items with descriptions and prices

### Receipt Documents
**Required Fields:**
- `receiptNumber` (must start with "REC-")
- `merchantName`
- `totalAmount` (must be > 0)
- `currency`
- `transactionDate`

**Extracted Data:**
- Receipt number, merchant information, transaction details
- Items purchased with quantities and prices

### Contract Documents
**Required Fields:**
- `contractNumber` (must start with "CON-")
- `partyA`
- `partyB`
- `contractType`
- `effectiveDate`
- `totalValue` (must be > 0)

**Extracted Data:**
- Contract number, parties involved, contract terms
- Effective dates, expiration dates, contract values

## File Structure

```
document-processing-pipeline/
├── src/
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces and enums
│   ├── services/
│   │   ├── ocrService.ts         # OCR simulation and metadata extraction
│   │   ├── validationService.ts  # Document validation logic
│   │   ├── storageService.ts     # File-based storage operations
│   │   └── processingPipeline.ts # Main processing orchestration
│   └── index.ts                  # Express server and API endpoints
├── public/
│   └── index.html                # Web interface for testing
├── storage/                      # Document storage (created at runtime)
│   └── documents.json            # JSON file storing all documents
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Development

### Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Run with ts-node for development
- `npm test` - Run tests (when implemented)
- `npm run lint` - Run ESLint

### Adding New Document Types

1. **Update DocumentType enum** in `src/types/index.ts`
2. **Add extraction logic** in `src/services/ocrService.ts`
3. **Add validation rules** in `src/services/validationService.ts`
4. **Update type detection** in `detectDocumentType()` function

### Extending the Pipeline

The modular architecture makes it easy to extend:

- **Add new processing stages** by extending the ProcessingPipeline class
- **Implement real OCR** by replacing the simulateOCR function
- **Add database storage** by implementing a new StorageService
- **Add authentication** by adding middleware to the Express app

## Design Decisions

### Technology Choices

1. **TypeScript**: For type safety and better developer experience
2. **Express.js**: Lightweight, flexible web framework
3. **File-based storage**: Simple, no external dependencies
4. **JSON storage**: Human-readable, easy to debug

### Architecture Decisions

1. **Service-oriented design**: Each component has a single responsibility
2. **Async/await**: Modern JavaScript patterns for better error handling
3. **Status tracking**: Clear visibility into document processing lifecycle
4. **Error handling**: Comprehensive error tracking and reporting

### Trade-offs

1. **File-based storage**: Simple but not suitable for production scale
2. **Simulated OCR**: Demonstrates the pipeline without external dependencies
3. **Single-threaded**: Node.js event loop handles concurrent requests
4. **No authentication**: Simplified for demonstration purposes

## Future Enhancements

1. **Real OCR Integration**: Connect to services like Google Vision API or Tesseract
2. **Database Storage**: PostgreSQL or MongoDB for production use
3. **Queue System**: Redis or RabbitMQ for handling high volumes
4. **Authentication**: JWT-based authentication and authorization
5. **File Storage**: Cloud storage integration (AWS S3, Google Cloud Storage)
6. **Monitoring**: Logging, metrics, and health checks
7. **Testing**: Unit tests, integration tests, and API tests
8. **Docker**: Containerization for easy deployment

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `src/index.ts` or set `PORT` environment variable
2. **File upload errors**: Check file size limits and supported formats
3. **Storage errors**: Ensure write permissions in the project directory
4. **TypeScript errors**: Run `npm install` to ensure all dependencies are installed

### Debug Mode

Run with additional logging:
```bash
DEBUG=* npm run dev
```

## License

MIT License - see LICENSE file for details. 