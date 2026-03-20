'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--bg-tertiary)]">
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,var(--text-primary) 0,var(--text-primary) 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs tracking-[0.25em] uppercase text-[var(--accent)] mb-4 sm:mb-6">New Collection — 2025</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight sm:leading-[0.95] text-[var(--text-primary)] mb-5 sm:mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Wear the<br /><em className="italic text-gold-gradient">difference.</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-md mb-6 sm:mb-10">
              Premium clothing engineered for those who refuse to compromise on quality, comfort, or style. Every stitch a statement.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full max-w-xs">
              <Link href="/products" className="w-full xs:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs tracking-[0.18em] uppercase font-medium hover:opacity-80 transition-opacity text-center">Shop Collection</Link>
              <Link href="/products?sort=trending" className="w-full xs:w-auto px-6 py-3 sm:px-8 sm:py-4 border border-[var(--border)] text-[var(--text-primary)] text-xs tracking-[0.18em] uppercase font-medium hover:border-[var(--text-primary)] transition-colors text-center">Trending Now</Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="order-1 lg:order-2 relative mt-8 sm:mt-0">
            <div className="relative aspect-[4/5] bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center w-4/5 xs:w-3/4 sm:w-full mx-auto">
              <div className="text-center opacity-10">
                <div className="text-6xl xs:text-7xl sm:text-9xl font-light text-[var(--text-primary)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>R</div>
                <div className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mt-2">Luxury Clothing</div>
              </div>
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-24 sm:h-24 border border-[var(--accent)]/30" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-8 h-8 sm:w-16 sm:h-16 border border-[var(--border)]" />
              <div className="absolute inset-4 sm:inset-8 border border-[var(--border)]/40" />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-[var(--accent)] text-white p-3 sm:p-4">
              <p className="text-xs tracking-widest uppercase font-medium">Premium</p>
              <p className="text-lg sm:text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Quality</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
