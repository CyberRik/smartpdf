'use client';

import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  summary: string;
};

export default function SummaryBox({ summary }: Props) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="summary-card p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">PDF Summary</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {summary}
        </p>
      </div>
    </div>
  );
}