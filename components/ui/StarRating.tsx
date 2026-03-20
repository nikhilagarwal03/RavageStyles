import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props { rating: number; max?: number; size?: number; interactive?: boolean; onRate?: (r: number) => void; }

export default function StarRating({ rating, max=5, size=14, interactive=false, onRate }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_,i) => (
        <button key={i} type="button" disabled={!interactive} onClick={() => onRate?.(i+1)}
          className={cn('transition-transform', interactive && 'hover:scale-110 cursor-pointer')}>
          <Star size={size} className={cn(i < Math.floor(rating) ? 'text-[var(--accent)] fill-[var(--accent)]' : 'text-[var(--border)]')} />
        </button>
      ))}
    </div>
  );
}
