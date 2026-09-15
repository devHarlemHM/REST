import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon && <div className="text-text-muted mb-4">{icon}</div>}
      <p className="text-text-primary font-medium mb-1">{title}</p>
      {description && <p className="text-text-secondary text-sm">{description}</p>}
    </div>
  );
}
