#!/bin/bash

# Document Processing Pipeline - curl Examples
# Make sure the server is running: npm start

echo "🚀 Document Processing Pipeline - curl Examples"
echo "=============================================="
echo ""

# Check if server is running
echo "1. Testing server health..."
curl -s http://localhost:3000/health | jq .
echo ""

# Upload sample files
echo "2. Uploading sample invoice..."
curl -X POST \
  -F "document=@samples/invoice-sample.pdf" \
  http://localhost:3000/api/documents/upload | jq .
echo ""

echo "3. Uploading sample receipt..."
curl -X POST \
  -F "document=@samples/receipt-sample.pdf" \
  http://localhost:3000/api/documents/upload | jq .
echo ""

echo "4. Uploading sample contract..."
curl -X POST \
  -F "document=@samples/contract-sample.pdf" \
  http://localhost:3000/api/documents/upload | jq .
echo ""

# Wait for processing
echo "5. Waiting for processing to complete..."
sleep 3

# Get all documents
echo "6. Getting all documents..."
curl -s http://localhost:3000/api/documents | jq .
echo ""

echo "✅ curl examples completed!"
echo ""
echo "💡 Additional curl commands you can try:"
echo "   # Get documents by status"
echo "   curl http://localhost:3000/api/documents/status/validated"
echo ""
echo "   # Get specific document status (replace DOCUMENT_ID)"
echo "   curl http://localhost:3000/api/documents/DOCUMENT_ID/status"
echo ""
echo "   # Upload your own PDF file"
echo "   curl -X POST -F \"document=@your-file.pdf\" http://localhost:3000/api/documents/upload" 