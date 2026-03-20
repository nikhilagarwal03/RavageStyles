'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Product { _id: string; name: string; slug: string; price: number; compareAtPrice?: number; images: string[]; category: string; averageRating: number; totalReviews: number; sizes: { size: string; stock: number }[]; totalStock: number; }

export default function ProductCard({ product, index=0 }: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const [quickSize, setQuickSize] = useState('');
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const inWishlist = isInWishlist(product._id);
  const available = product.sizes.filter(s => s.stock > 0);
  const discount = product.compareAtPrice ? calculateDiscount(product.compareAtPrice, product.price) : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    await toggle(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!quickSize && available.length > 1) { toast('Select a size', { icon: '📏' }); return; }
    const size = quickSize || available[0]?.size;
    if (!size) { toast.error('Out of stock'); return; }
    const sizeObj = product.sizes.find(s => s.size === size)!;
    setAdding(true);
    addItem({ productId: product._id, name: product.name, image: product.images[0], price: product.price, size, maxStock: sizeObj.stock, slug: product.slug });
    toast.success('Added to cart!');
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }} className="group relative">
      <Link href={'/products/' + product.slug}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-tertiary)] mb-3" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <Image src={product.images[0]} alt={product.name} fill className={cn('object-cover transition-all duration-700', hovered && product.images[1] ? 'opacity-0' : 'opacity-100')} />
          {product.images[1] && <Image src={product.images[1]} alt="" fill className={cn('object-cover transition-all duration-700 absolute inset-0', hovered ? 'opacity-100' : 'opacity-0')} />}

          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && <span className="bg-[var(--accent)] text-white text-[10px] px-2 py-0.5">-{discount}%</span>}
            {product.totalStock === 0 && <span className="bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] px-2 py-0.5">Sold Out</span>}
          </div>

          <button onClick={handleWishlist} className={cn('absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[var(--bg-secondary)]/80 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100', inWishlist ? 'text-red-500' : 'text-[var(--text-muted)] hover:text-red-500')}>
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          <div className={cn('absolute bottom-0 left-0 right-0 bg-[var(--bg-secondary)]/95 backdrop-blur-sm p-3 transition-all duration-300 translate-y-full group-hover:translate-y-0')}>
            {available.length > 1 ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1 flex-wrap">
                  {available.map(s => (
                    <button key={s.size} onClick={e => { e.preventDefault(); setQuickSize(s.size); }}
                      className={cn('text-[10px] px-2 py-1 border transition-colors', quickSize === s.size ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)]')}>
                      {s.size}
                    </button>
                  ))}
                </div>
                <button onClick={handleQuickAdd} disabled={adding || !quickSize} className="p-2 bg-[var(--text-primary)] text-[var(--bg-primary)] disabled:opacity-50 hover:opacity-80 transition-opacity flex-shrink-0">
                  <ShoppingBag size={14} />
                </button>
              </div>
            ) : available.length === 1 ? (
              <button onClick={handleQuickAdd} disabled={adding} className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-50">
                <ShoppingBag size={12} />{adding ? 'Added!' : 'Quick Add'}
              </button>
            ) : (
              <p className="text-center text-xs text-[var(--text-muted)] py-1">Out of Stock</p>
            )}
          </div>
        </div>
      </Link>
      <div className="space-y-1">
        <p className="text-[10px] tracking-[0.12em] uppercase text-[var(--text-muted)]">{product.category}</p>
        <Link href={'/products/' + product.slug}>
          <h3 className="text-sm font-medium hover:text-[var(--accent)] transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            {product.compareAtPrice && <span className="text-xs text-[var(--text-muted)] line-through">{formatPrice(product.compareAtPrice)}</span>}
          </div>
          {product.totalReviews > 0 && (
            <div className="flex items-center gap-1">
              <Star size={10} className="text-[var(--accent)] fill-[var(--accent)]" />
              <span className="text-[10px] text-[var(--text-muted)]">{product.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
