'use client'; // Needed because we're using useState

import { useState } from 'react';
import UploadArea from './components/UploadArea';
import PDFPreview from './components/PDFPreview';
import SummaryBox from './components/SummaryBox';
// import ChatBox from './components/ChatBox';
// import ChatInput from './components/ChatInput';

export default function Home() {
  // State for file and summary
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");

  return (
    <main className="min-h-screen flex flex-col lg:flex-row p-6 bg-gray-50 gap-6">
      
      {/* Left panel for uploading and previewing the PDF */}
      <div className="w-full lg:w-1/3 space-y-4">
        <UploadArea setFile={setFile} setSummary={setSummary} />
        <PDFPreview file={file} />
      </div>

      {/* Right panel for summary */}
      <div className="w-full lg:w-2/3 space-y-4">
        <SummaryBox summary={summary} />
        {/* <ChatBox messages={messages} />
        <ChatInput onAsk={handleAsk} /> */}
      </div>
    </main>
  );
}
