'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, cn } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import ReviewSection from '@/components/product/ReviewSection';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('');
  const [sizeErr, setSizeErr] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!slug) return;
    fetch('/api/products/' + slug).then(r => r.json()).then(d => { setProduct(d.data?.product); setLoading(false); }).catch(() => { setLoading(false); router.push('/products'); });
  }, [slug, router]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-[3/4] skeleton" />
        <div className="space-y-4 pt-4"><div className="h-4 w-24 skeleton" /><div className="h-10 w-full skeleton" /><div className="h-6 w-32 skeleton" /></div>
      </div>
    </div>
  );
  if (!product) return null;

  const available = product.sizes.filter((s: any) => s.stock > 0);
  const inWishlist = isInWishlist(product._id);
  const sizeObj = product.sizes.find((s: any) => s.size === size);

  const handleAdd = () => {
    if (!size) { setSizeErr(true); toast.error('Please select a size'); return; }
    if (!sizeObj || sizeObj.stock === 0) { toast.error('Out of stock'); return; }
    setAdding(true);
    addItem({ productId: product._id, name: product.name, image: product.images[0], price: product.price, size, maxStock: sizeObj.stock, slug: product.slug });
    toast.success('Added to cart!');
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    await toggle(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8 tracking-wide">
        <a href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</a>
        <span>/</span><a href="/products" className="hover:text-[var(--text-primary)] transition-colors">Products</a>
        <span>/</span><a href={'/products?category=' + product.category} className="hover:text-[var(--text-primary)] transition-colors">{product.category}</a>
        <span>/</span><span className="text-[var(--text-primary)]">{product.name}</span>
      </nav>
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="space-y-3">
          <motion.div key={activeImg} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="relative aspect-[3/4] bg-[var(--bg-tertiary)] overflow-hidden">
            <Image src={product.images[activeImg] || product.images[0]} alt={product.name} fill className="object-cover" priority />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => Math.max(0,i-1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--bg-secondary)]/80 flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors">‹</button>
                <button onClick={() => setActiveImg(i => Math.min(product.images.length-1,i+1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--bg-secondary)]/80 flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors">›</button>
              </>
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={cn('relative w-16 h-20 flex-shrink-0 overflow-hidden transition-all', activeImg===i ? 'ring-1 ring-[var(--accent)] ring-offset-1' : 'opacity-60 hover:opacity-100')}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="lg:pt-4">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--accent)] mb-3">{product.category}</p>
          <h1 className="text-4xl sm:text-5xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{product.name}</h1>
          {product.totalReviews > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.averageRating} />
              <span className="text-sm text-[var(--text-muted)]">({product.totalReviews} reviews)</span>
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.compareAtPrice && <span className="text-base text-[var(--text-muted)] line-through">{formatPrice(product.compareAtPrice)}</span>}
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">{product.shortDescription || product.description?.substring(0,200)}</p>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Select Size</span>
              {sizeErr && <span className="text-xs text-red-500">Please select a size</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s: any) => {
                const oos = s.stock === 0;
                return (
                  <button key={s.size} disabled={oos} onClick={() => { setSize(s.size); setSizeErr(false); }}
                    className={cn('w-12 h-12 text-sm font-medium transition-all relative', oos ? 'border border-[var(--border)] text-[var(--border)] cursor-not-allowed' : size===s.size ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)]' : 'border border-[var(--border)] hover:border-[var(--text-primary)]')}>
                    {s.size}
                    {oos && <span className="absolute inset-0 flex items-center justify-center"><span className="block w-full h-px bg-[var(--border)] rotate-45 absolute" /></span>}
                  </button>
                );
              })}
            </div>
            {sizeObj && <p className="text-xs text-[var(--text-muted)] mt-2">{sizeObj.stock <= 5 ? <span className="text-orange-500">Only {sizeObj.stock} left!</span> : sizeObj.stock + ' in stock'}</p>}
          </div>
          <div className="flex gap-3 mb-8">
            <Button onClick={handleAdd} loading={adding} size="lg" className="flex-1"><ShoppingBag size={16} />{adding ? 'Added!' : 'Add to Cart'}</Button>
            <button onClick={handleWishlist} className={cn('w-14 h-14 border flex items-center justify-center transition-all', inWishlist ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-red-500 hover:text-red-500')}>
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="space-y-3 border-t border-[var(--border)] pt-6">
            {[{I:Truck,t:'Free shipping on orders over ₹999'},{I:RotateCcw,t:'Easy 30-day returns'},{I:Shield,t:'Premium quality guaranteed'}].map(({I,t}) => (
              <div key={t} className="flex items-center gap-3 text-sm text-[var(--text-muted)]"><I size={14} className="text-[var(--accent)] flex-shrink-0" />{t}</div>
            ))}
          </div>
          {(product.material || product.description) && (
            <div className="border-t border-[var(--border)] mt-6 pt-6 space-y-4">
              {[{label:'Description',text:product.description},{label:'Materials',text:product.material},{label:'Care Instructions',text:product.careInstructions}].filter(i=>i.text).map(item => (
                <details key={item.label} className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-xs tracking-[0.15em] uppercase font-medium list-none">
                    {item.label}<span className="text-[var(--text-muted)] group-open:rotate-45 transition-transform duration-200 inline-block">+</span>
                  </summary>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-3">{item.text}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
      <ReviewSection productId={product._id} />
    </div>
  );
}
