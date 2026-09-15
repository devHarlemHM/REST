import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-xl border border-gray-100 shadow-sm ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
