'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import ProgressBar from './ProgressBar';

type Props = {
  setFile: (file: File) => void;
  setSummary: (summary: string) => void; 
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function UploadArea({ setFile, setSummary }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please select a PDF file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setUploadSuccess(false);
    setFile(file);
    setUploading(true);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/Uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      setProgress(100);
      setTimeout(() => {
        setSummary(data.summary);
        setUploadSuccess(true);
        toast({
          title: "Success!",
          description: "PDF analyzed and summary generated successfully.",
        });
      }, 500);
    } catch (err) {
      console.error("Upload failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
      e.dataTransfer.clearData();
    }
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div
        className={`upload-zone ${dragActive ? 'upload-zone-active' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {uploadSuccess ? (
            <div className="animate-scale-in">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          ) : uploading ? (
            <div className="animate-pulse-slow">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}

          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {uploadSuccess 
                ? 'Analysis Complete!' 
                : uploading 
                  ? 'Processing PDF...' 
                  : 'Upload PDF File'
              }
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {uploadSuccess
                ? 'Your PDF has been analyzed successfully'
                : uploading 
                  ? 'Analyzing document and generating summary...' 
                  : 'Drag and drop your PDF here, or click to browse'
              }
            </p>
          </div>

          {uploading && (
            <div className="w-full max-w-xs">
              <ProgressBar progress={progress} />
            </div>
          )}

          {!uploading && !uploadSuccess && (
            <Button variant="secondary" className="pointer-events-none">
              Choose File
            </Button>
          )}

          {uploadSuccess && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setUploadSuccess(false);
                setFile(null);
                setSummary('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="pointer-events-auto"
            >
              Upload Another File
            </Button>
          )}

          <div className="text-xs text-muted-foreground">
            Maximum file size: 100MB • PDF files only
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-slide-up">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}