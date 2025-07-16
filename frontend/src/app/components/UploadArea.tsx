'use client';

import { useState } from 'react';

type Props = {
  setFile: (file: File) => void;
  setSummary: (summary: string) => void; 
};

export default function UploadArea({ setFile, setSummary }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selected);

    try {
      const res = await fetch("http://localhost:8000/Uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="block cursor-pointer border border-dashed border-gray-400 rounded-lg p-6 bg-white text-center hover:bg-gray-50 transition-colors">
      {/* Hidden file input */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Uploading text */}
      <span className="block text-sm mb-4 text-gray-600">
        {uploading ? "Uploading..." : "Upload PDF File"}
      </span>

      {/* Upload Button */}
      <div className="px-4 py-2 border border-gray-300 rounded bg-blue-500 hover:bg-blue-600 text-white inline-block ring-2 ring-blue transition-colors">
        Choose File
      </div>
    </label>
  );
}
// This component handles file uploads and displays the upload area.