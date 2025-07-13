'use client';

type Props = {
  setFile: (file: File) => void;
};

export default function UploadArea({ setFile }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    // Make the whole label the upload box
    <label className="block cursor-pointer border border-dashed border-gray-400 rounded-lg p-6 bg-white text-center hover:bg-gray-50 transition-colors">

      {/* Hidden file input */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Inner Text */}
      <span className="block text-sm mb-4 text-gray-600">Upload PDF File</span>

      {/* Styled Button UI */}
      <div className="px-4 py-2 border border-gray-300 rounded bg-blue-500 hover:bg-blue-600 text-white inline-block ring-2 ring-blue transition-colors">
        Choose File
      </div>
    </label>
  );
}
