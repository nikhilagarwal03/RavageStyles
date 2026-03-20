import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'|'secondary'|'outline'|'ghost'|'gold';
  size?: 'sm'|'md'|'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(({ children, className, variant='primary', size='md', loading, disabled, ...props }, ref) => {
  const variants = {
    primary: 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80',
    secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)]',
    outline: 'border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-primary)] bg-transparent',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] bg-transparent',
    gold: 'bg-[var(--accent)] text-white hover:opacity-90',
  };
  const sizes = { sm: 'px-4 py-2 text-xs', md: 'px-6 py-3 text-xs', lg: 'px-8 py-4 text-sm' };
  return (
    <button ref={ref} disabled={disabled||loading}
      className={cn('inline-flex items-center justify-center gap-2 tracking-[0.12em] uppercase font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
      {...props}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;
