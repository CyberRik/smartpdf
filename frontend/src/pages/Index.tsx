'use client';

import { useState } from 'react';
import { FileText, MessageSquare, Sparkles } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import PDFPreview from '../components/PDFPreview';
import SummaryBox from '../components/SummaryBox';
import ChatBox, { Message } from '../components/ChatBox';
import ChatInput from '../components/ChatInput';
import { Toaster } from '../components/ui/toaster';

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

  const hasSummary = summary?.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 bg-gradient-to-br from-primary to-primary-hover rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                  <span>PDF Summarizer</span>
                  <Sparkles className="h-5 w-5 text-primary" />
                </h1>
                <p className="text-sm text-muted-foreground">
                  Upload, analyze, and chat with your PDF documents using AI
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>Ready</span>
              </div>
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
                
                <ChatBox messages={messages} isLoading={isLoadingChat} />
                <ChatInput 
                  onAsk={handleAsk} 
                  isLoading={isLoadingChat}
                  disabled={!file}
                />
              </div>
            )}

            {!hasSummary && !file && (
              <div className="summary-card p-12 text-center hover-lift">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-warning-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      Welcome to AI PDF Summarizer
                    </h3>
                    <p className="text-muted-foreground max-w-lg leading-relaxed">
                      Transform your PDF documents into concise summaries and interactive conversations. 
                      Upload any PDF to get started with intelligent analysis powered by AI.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg text-sm">
                    <div className="text-center p-3 rounded-lg bg-accent/30">
                      <div className="font-medium text-foreground mb-1">📄 Upload</div>
                      <div className="text-muted-foreground">Any PDF up to 100MB</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent/30">
                      <div className="font-medium text-foreground mb-1">🤖 Analyze</div>
                      <div className="text-muted-foreground">AI-powered insights</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent/30">
                      <div className="font-medium text-foreground mb-1">💬 Chat</div>
                      <div className="text-muted-foreground">Ask questions</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Powered by AI • Built with React & FastAPI
            </div>
            <div className="flex items-center space-x-4">
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}
