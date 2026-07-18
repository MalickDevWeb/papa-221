import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'surface';
}

const sizeClasses: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
};

const variantClasses: Record<NonNullable<IconButtonProps['variant']>, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
  secondary: 'bg-white border border-neutral-gray-200 text-on-surface hover:bg-neutral-gray-50',
  ghost: 'bg-transparent text-secondary hover:bg-neutral-gray-100',
  surface: 'bg-surface text-on-surface hover:bg-neutral-gray-100',
};

export function IconButton({
  icon,
  ariaLabel,
  size = 'md',
  variant = 'ghost',
  className = '',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children ?? (
        <span translate="no" className="material-symbols-outlined text-[20px]">
          {icon}
        </span>
      )}
    </button>
  );
}
