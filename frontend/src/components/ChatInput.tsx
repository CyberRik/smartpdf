'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  onAsk: (question: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function ChatInput({ onAsk, isLoading = false, disabled = false }: Props) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || disabled) return;

    const currentQuestion = question.trim();
    setQuestion('');
    await onAsk(currentQuestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSubmitDisabled = !question.trim() || isLoading || disabled;

  return (
    <div className="border border-border rounded-lg p-4 bg-card animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled 
              ? "Upload a PDF to start asking questions..." 
              : "Ask a question about the PDF content..."
          }
          disabled={disabled || isLoading}
          className="min-h-[80px] resize-none border-0 p-3 focus:ring-0 focus:border-0"
        />
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitDisabled}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Thinking...' : 'Send'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}