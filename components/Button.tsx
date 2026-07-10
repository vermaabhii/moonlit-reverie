import { cn } from '@/lib/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-sign border-2 border-coffee font-display text-lg tracking-wide transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50',
          size === 'md' ? 'h-11 px-5' : 'h-14 px-6 text-xl',
          variant === 'primary' && 'bg-rust text-cream shadow-sign hover:bg-rust-dark',
          variant === 'secondary' && 'bg-mustard text-coffee shadow-sign hover:bg-mustard-muted',
          variant === 'ghost' && 'border-transparent bg-transparent text-coffee shadow-none hover:bg-coffee/5',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
