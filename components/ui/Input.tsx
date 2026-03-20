import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-xs tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-2">{label}</label>}
    <input ref={ref}
      className={cn('w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors duration-200', error && 'border-red-500', className)}
      {...props} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
