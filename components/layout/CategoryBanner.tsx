'use client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const cats = [
  { name: 'T-Shirts', desc: 'Essential Luxury', href: '/products?category=T-Shirts' },
  { name: 'Hoodies', desc: 'Refined Comfort', href: '/products?category=Hoodies' },
  { name: 'Jackets', desc: 'Statement Pieces', href: '/products?category=Jackets' },
];

export default function CategoryBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section ref={ref} className="py-20 px-4 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-xs tracking-[0.2em] uppercase text-[var(--accent)]">Browse By</span>
          <h2 className="text-4xl sm:text-5xl font-light mt-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Categories</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cats.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}>
              <Link href={cat.href} className="group relative h-52 bg-[var(--bg-tertiary)] flex flex-col items-center justify-center overflow-hidden block">
                <div className="absolute inset-4 border border-[var(--border)]/50 group-hover:inset-2 transition-all duration-500" />
                <p className="text-3xl font-light relative z-10" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{cat.name}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] mt-2 relative z-10">{cat.desc}</p>
                <span className="mt-4 text-xs tracking-widest uppercase text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">Shop Now →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
