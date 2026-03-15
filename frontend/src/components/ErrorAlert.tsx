import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormAlertProps {
  message: string;
  className?: string;
  onClose?: () => void;
}

const ErrorAlert = ({ message, className = 'mb-6', onClose }: FormAlertProps) => {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      className={`${className} bg-red-500/10 border-red-500/30 flex items-center justify-between gap-2`}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <AlertDescription className="mt-0">{message}</AlertDescription>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          type="button"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
};

export default ErrorAlert;
