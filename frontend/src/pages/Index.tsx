'use client';

import { useState } from 'react';
import { FileText, MessageSquare } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import PDFPreview from '../components/PDFPreview';
import SummaryBox from '../components/SummaryBox';
import ChatBox, { Message } from '../components/ChatBox';
import ChatInput from '../components/ChatInput';

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const handleAsk = async (question: string) => {
    if (!file) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoadingChat(true);

    try {
      // Make API call to your FastAPI backend for chat
      const formData = new FormData();
      formData.append("question", question);
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.statusText}`);
      }

      const data = await res.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "I couldn't find an answer to your question.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat request failed:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while processing your question. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const hasSummary = summary.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PDF Summarizer</h1>
              <p className="text-sm text-muted-foreground">
                Upload, analyze, and chat with your PDF documents
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Upload & Preview */}
          <div className="lg:col-span-1 space-y-6">
            <UploadArea setFile={setFile} setSummary={setSummary} />
            <PDFPreview file={file} />
          </div>

          {/* Right Panel - Summary & Chat */}
          <div className="lg:col-span-2 space-y-6">
            {hasSummary && <SummaryBox summary={summary} />}
            
            {hasSummary && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Ask Questions About Your PDF
                  </h2>
                </div>
                
                <ChatBox messages={messages} />
                <ChatInput 
                  onAsk={handleAsk} 
                  isLoading={isLoadingChat}
                  disabled={!file}
                />
              </div>
            )}

            {!hasSummary && !file && (
              <div className="summary-card p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-accent rounded-full">
                    <FileText className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Welcome to PDF Summarizer
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Upload a PDF document to get started. I'll analyze the content, 
                      provide a comprehensive summary, and answer any questions you have.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
