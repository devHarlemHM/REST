import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'coral' | 'verde' | 'amarillo' | 'rojo' | 'gray';
  children: ReactNode;
  className?: string;
}

const variants = {
  primary: 'bg-primary-light text-primary',
  secondary: 'bg-secondary-light text-secondary',
  coral: 'bg-coral-light text-coral',
  verde: 'bg-green-50 text-semaforo-verde',
  amarillo: 'bg-amber-50 text-semaforo-amarillo',
  rojo: 'bg-red-50 text-semaforo-rojo',
  gray: 'bg-gray-100 text-text-secondary',
};

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
