'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

export default function TrendingSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    fetch('/api/products?trending=true&limit=4').then(r => r.json()).then(d => { setProducts(d.data?.products || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 mb-3"><TrendingUp size={14} className="text-[var(--accent)]" /><span className="text-xs tracking-[0.2em] uppercase text-[var(--accent)]">Right Now</span></div>
          <h2 className="text-4xl sm:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Trending</h2>
        </div>
        <Link href="/products?sort=trending" className="hidden sm:block text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">View All</Link>
      </motion.div>
      {loading ? <ProductSkeleton count={4} /> : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8">
          {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      ) : <p className="text-center text-[var(--text-muted)] py-20 text-sm">No trending products yet.</p>}
    </section>
  );
}
