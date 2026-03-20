'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetch('/api/wishlist').then(r=>r.json()).then(d=>{ setProducts(d.data?.wishlist||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, [user, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Heart size={20} className="text-[var(--accent)]"/>
        <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>My Wishlist</h1>
        {!loading&&<span className="text-sm text-[var(--text-muted)]">({products.length} items)</span>}
      </div>
      {loading ? <ProductSkeleton count={8}/> : products.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="text-[var(--border)] mx-auto mb-4"/>
          <p className="text-2xl font-light text-[var(--text-muted)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Your wishlist is empty</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
          {products.map((p:any,i)=><ProductCard key={p._id} product={p} index={i}/>)}
        </div>
      )}
    </div>
  );
}
