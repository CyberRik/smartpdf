'use client';

import { File, Calendar, HardDrive } from 'lucide-react';

type Props = {
  file: File | null;
};

export default function PDFPreview({ file }: Props) {
  if (!file) return null;

  const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  const lastModified = new Date(file.lastModified).toLocaleDateString();

  return (
    <div className="file-preview-card animate-slide-up">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-accent rounded-lg">
          <File className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">File Details</h3>
          <p className="text-sm text-muted-foreground">PDF Document</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="text-sm font-medium text-muted-foreground min-w-[60px]">Name:</div>
          <div className="text-sm text-foreground break-all">{file.name}</div>
        </div>
        
        <div className="flex items-center space-x-3">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-foreground">{fileSizeInMB} MB</div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-foreground">Modified {lastModified}</div>
        </div>
      </div>
    </div>
  );
}