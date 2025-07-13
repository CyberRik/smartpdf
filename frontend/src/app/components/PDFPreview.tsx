'use client';

type Props = {
  file: File | null;
};

export default function PDFPreview({ file }: Props) {
  if (!file) return null;

  const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">File Preview</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        <li><strong>Name:</strong> {file.name}</li>
        <li><strong>Size:</strong> {fileSizeInMB} MB</li>
        <li><strong>Type:</strong> {file.type}</li>
      </ul>
    </div>
  );
}
// This component displays a preview of the uploaded PDF file's details.