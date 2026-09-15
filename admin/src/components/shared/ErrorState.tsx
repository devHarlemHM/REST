import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Algo salió mal', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <AlertTriangle className="h-12 w-12 text-coral mb-4" />
      <p className="text-text-secondary mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
