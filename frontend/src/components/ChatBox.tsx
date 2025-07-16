'use client';

import { MessageCircle, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type Props = {
  messages: Message[];
};

export default function ChatBox({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="summary-card p-8 text-center animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-accent rounded-full">
            <MessageCircle className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Chat with Your PDF
            </h3>
            <p className="text-muted-foreground">
              Ask questions about the document content, request clarifications, or explore specific topics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-card p-4 animate-scale-in">
      <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-border">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Chat</h2>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.isUser 
                  ? 'bg-primary' 
                  : 'bg-accent'
              }`}>
                {message.isUser ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-accent-foreground" />
                )}
              </div>
              
              <div className={`chat-message ${
                message.isUser 
                  ? 'chat-message-user' 
                  : 'chat-message-bot'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className={`text-xs mt-1 opacity-70 ${
                  message.isUser ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}