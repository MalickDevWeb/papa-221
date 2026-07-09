import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

/** Bouton réutilisable — variantes primaire/secondaire/ghost */
export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50';
  const sizes = { sm: 'px-3 py-1.5 text-[10px]', md: 'px-5 py-2.5 text-xs' };
  const variants = {
    primary: 'bg-brand-red-deep text-white hover:bg-brand-red-deep/90 shadow-md shadow-[#B3181C]/15',
    secondary: 'bg-white border border-neutral-gray-200 text-[#1E293B] hover:bg-neutral-gray-50',
    ghost: 'text-secondary hover:bg-secondary-container/50',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
