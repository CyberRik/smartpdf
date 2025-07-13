'use client'; // Needed because we're using useState

import { useState } from 'react';
import UploadArea from './components/UploadArea';
import PDFPreview from './components/PDFPreview';
// import SummaryBox from './components/SummaryBox';
// import ChatBox from './components/ChatBox';
// import ChatInput from './components/ChatInput';

// Main Home component
export default function Home() {
  // file state lives here — shared by UploadArea and PDFPreview
  const [file, setFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row p-6 bg-gray-50 gap-6">
      
      {/* Left panel for uploading and previewing the PDF */}
      <div className="w-full lg:w-1/3 space-y-4">
        <UploadArea setFile={setFile} />        {/* Uploads file and sets it */}
        <PDFPreview file={file} />              {/* Shows file info if available */}
      </div>

      {/* Right panel for summary and Q&A
      <div className="w-full lg:w-2/3 flex flex-col space-y-4">
        <SummaryBox />
        <ChatBox />
        <ChatInput />
      </div> */}
    </main>
  );
}
// This is the main page of the app, where users can upload a PDF, see its details, and interact with the summary and chat features.