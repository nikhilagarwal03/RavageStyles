'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm'|'md'|'lg'; }

export default function Modal({ isOpen, onClose, title, children, size='md' }: Props) {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  useEffect(() => { const fn = (e: KeyboardEvent) => { if (e.key==='Escape') onClose(); }; document.addEventListener('keydown',fn); return () => document.removeEventListener('keydown',fn); }, [onClose]);
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-3xl' };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className={cn('relative w-full bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl', sizes[size])}>
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                <h3 className="text-lg font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{title}</h3>
                <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><X size={18} /></button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
