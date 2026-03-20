'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import { CATEGORIES } from '@/lib/utils';
import { X } from 'lucide-react';

const SORTS = [{ l:'Newest',v:'createdAt_desc' },{ l:'Oldest',v:'createdAt_asc' },{ l:'Price: Low',v:'price_asc' },{ l:'Price: High',v:'price_desc' },{ l:'Trending',v:'trending' },{ l:'Top Rated',v:'rating' }];

function ProductsContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page:1, pages:1, total:0 });

  const category = sp.get('category') || '';
  const sort = sp.get('sort') || 'createdAt_desc';
  const search = sp.get('search') || '';
  const page = parseInt(sp.get('page') || '1');
  const featured = sp.get('featured') || '';

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (category) p.set('category', category);
      if (sort) p.set('sort', sort);
      if (search) p.set('search', search);
      if (featured) p.set('featured', featured);
      p.set('page', String(page)); p.set('limit', '12');
      const res = await fetch('/api/products?' + p.toString());
      const data = await res.json();
      setProducts(data.data?.products || []);
      setPagination(data.data?.pagination || { page:1, pages:1, total:0 });
    } finally { setLoading(false); }
  }, [category, sort, search, page, featured]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const set_ = (key: string, val: string) => {
    const p = new URLSearchParams(sp.toString());
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    router.push('/products?' + p.toString());
  };

  const clear = () => router.push('/products');
  const hasFilters = !!(category || search || featured || sort !== 'createdAt_desc');
  const title = search ? 'Search: ' + search : category || (featured ? 'Featured' : sort === 'trending' ? 'Trending' : 'All Products');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{title}</h1>
        {!loading && <p className="text-sm text-[var(--text-muted)] mt-1">{pagination.total} products</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => set_('category','')} className={'px-3 py-1.5 text-xs tracking-wide uppercase transition-colors ' + (!category ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]')}>All</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => set_('category', cat)} className={'px-3 py-1.5 text-xs tracking-wide uppercase transition-colors ' + (category===cat ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]')}>{cat}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {hasFilters && <button onClick={clear} className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors"><X size={12} /> Clear</button>}
          <select value={sort} onChange={e => set_('sort',e.target.value)} className="bg-transparent border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors">
            {SORTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      </div>
      {loading ? <ProductSkeleton count={12} /> : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-3xl font-light text-[var(--text-muted)] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>No products found</p>
          <button onClick={clear} className="text-sm text-[var(--accent)] hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
          {products.map((p,i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-16">
          {Array.from({ length: pagination.pages },(_,i)=>i+1).map(p => (
            <button key={p} onClick={() => set_('page',String(p))} className={'w-9 h-9 text-sm transition-colors ' + (p===pagination.page ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)]')}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><ProductSkeleton count={12} /></div>}><ProductsContent /></Suspense>;
}
