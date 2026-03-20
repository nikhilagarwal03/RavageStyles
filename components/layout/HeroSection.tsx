'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--bg-tertiary)]">
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,var(--text-primary) 0,var(--text-primary) 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs tracking-[0.25em] uppercase text-[var(--accent)] mb-6">New Collection — 2025</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[0.95] text-[var(--text-primary)] mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Wear the<br /><em className="italic text-gold-gradient">difference.</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base text-[var(--text-muted)] leading-relaxed max-w-md mb-10">
              Premium clothing engineered for those who refuse to compromise on quality, comfort, or style. Every stitch a statement.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-wrap gap-4">
              <Link href="/products" className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs tracking-[0.18em] uppercase font-medium hover:opacity-80 transition-opacity">Shop Collection</Link>
              <Link href="/products?sort=trending" className="px-8 py-4 border border-[var(--border)] text-[var(--text-primary)] text-xs tracking-[0.18em] uppercase font-medium hover:border-[var(--text-primary)] transition-colors">Trending Now</Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center">
              <div className="text-center opacity-10">
                <div className="text-9xl font-light text-[var(--text-primary)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>R</div>
                <div className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mt-2">Luxury Clothing</div>
              </div>
              <div className="absolute top-6 right-6 w-24 h-24 border border-[var(--accent)]/30" />
              <div className="absolute bottom-6 left-6 w-16 h-16 border border-[var(--border)]" />
              <div className="absolute inset-8 border border-[var(--border)]/40" />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 bg-[var(--accent)] text-white p-4">
              <p className="text-xs tracking-widest uppercase font-medium">Premium</p>
              <p className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Quality</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-8 bg-[var(--accent)]" />
      </motion.div>
    </section>
  );
}
