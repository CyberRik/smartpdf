import { CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'idle' | 'uploading' | 'processing' | 'ready' | 'error';
  message?: string;
}

export default function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: Upload,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          label: 'Uploading...',
        };
      case 'processing':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Processing...',
        };
      case 'ready':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Ready',
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          label: 'Error',
        };
      default:
        return {
          icon: Clock,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/30',
          label: 'Idle',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("p-1.5 rounded-full", config.bgColor)}>
        <Icon className={cn("h-3 w-3", config.color)} />
      </div>
      <div className="flex flex-col">
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
        {message && (
          <span className="text-xs text-muted-foreground">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}