'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
export default function BrandStatement() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
        <div className="w-8 h-px bg-[var(--accent)] mx-auto mb-8" />
        <p className="text-3xl sm:text-4xl md:text-5xl font-light leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          "Luxury is not about price — it's about the <em className="italic text-[var(--accent)]">feeling</em> of wearing something made entirely for you."
        </p>
        <div className="w-8 h-px bg-[var(--accent)] mx-auto mt-8" />
      </motion.div>
    </section>
  );
}
