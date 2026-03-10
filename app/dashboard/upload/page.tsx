'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Trash2, CheckCircle } from 'lucide-react';

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const fileTypeOptions = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'receipt', label: 'Receipt' },
    { value: 'personal', label: 'Personal Document' },
    { value: 'finance', label: 'Finance Record' },
    { value: 'work', label: 'Work Document' },
    { value: 'legal', label: 'Legal Document' },
    { value: 'other', label: 'Other' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setIsProcessed(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadedFile(e.target.files[0]);
      setIsProcessed(false);
    }
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsProcessed(true);
  };

  const handleClear = () => {
    setUploadedFile(null);
    setFileType('');
    setIsProcessed(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Upload Document
        </h1>
        <p className="text-muted-foreground">
          Upload, categorize, and process your documents with AI-powered OCR
        </p>
      </div>

      {/* Main Upload Area */}
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Select & Upload Document</CardTitle>
            <CardDescription>
              Upload images, PDFs, or scanned documents for intelligent processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-primary bg-accent/20'
                  : 'border-border bg-muted hover:bg-muted/80'
              }`}
            >
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-foreground text-lg">
                      {isDragging ? 'Drop your file here' : 'Drag and drop your document here'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse from your device
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports: PDF, JPG, PNG, TIFF, GIF (Max 50MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.tiff"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload document"
                />
              </label>
            </div>

            {/* Uploaded File Info */}
            {uploadedFile && (
              <div
                style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}
                className="border rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-foreground text-lg">
                        {uploadedFile.name}
                      </p>
                      {isProcessed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    aria-label="Clear uploaded file"
                    className="text-foreground hover:bg-primary/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* File Type Dropdown */}
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-foreground">
                    Document Type *
                  </label>
                  <Select value={fileType} onValueChange={setFileType}>
                    <SelectTrigger className="w-full border-border bg-background text-foreground">
                      <SelectValue placeholder="Select document type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Message */}
                {isProcessed && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
                    <p className="text-sm text-green-800">
                      Document processed successfully! OCR extraction is complete.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 border-border"
                    aria-label="Download document"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleProcess}
                    disabled={!fileType || isProcessing || isProcessed}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label="Process document"
                  >
                    {isProcessing ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : isProcessed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Processed
                      </>
                    ) : (
                      'Process Document'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF documents</li>
                <li>• JPEG images</li>
                <li>• PNG images</li>
                <li>• TIFF scans</li>
                <li>• GIF files</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Document Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invoices & Receipts</li>
                <li>• Finance Records</li>
                <li>• Personal Documents</li>
                <li>• Work & Business</li>
                <li>• Legal Documents</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
