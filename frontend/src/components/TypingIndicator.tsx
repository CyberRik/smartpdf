'use client';

import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="p-2 bg-muted rounded-full">
        <Bot className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="chat-message chat-message-bot flex items-center space-x-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce-gentle" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce-gentle" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce-gentle" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
      </div>
    </div>
  );
}