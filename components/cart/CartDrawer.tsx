'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, shippingFee, total } = useCartStore();
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} className="fixed inset-0 bg-black/50 z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.35, ease: [0.25,0,0,1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--bg-secondary)] z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3"><ShoppingBag size={18} className="text-[var(--accent)]" /><span className="text-sm tracking-[0.12em] uppercase font-medium">Your Cart ({items.length})</span></div>
              <button onClick={closeCart} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-[var(--border)] mb-4" />
                  <p className="text-xl font-light text-[var(--text-muted)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Your cart is empty</p>
                  <Link href="/products" onClick={closeCart} className="mt-6 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs tracking-widest uppercase hover:opacity-80 transition-opacity">Shop Now</Link>
                </div>
              ) : items.map(item => (
                <motion.div key={item.productId + item.size} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex gap-4">
                  <Link href={'/products/' + item.slug} onClick={closeCart} className="relative w-20 h-24 bg-[var(--bg-tertiary)] flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={'/products/' + item.slug} onClick={closeCart} className="text-sm font-medium hover:text-[var(--accent)] transition-colors line-clamp-1">{item.name}</Link>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Size: {item.size}</p>
                      </div>
                      <button onClick={() => removeItem(item.productId, item.size)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[var(--border)]">
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity-1)} className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"><Minus size={12} /></button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity+1)} disabled={item.quantity >= item.maxStock} className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-40"><Plus size={12} /></button>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[var(--border)] px-6 py-6 space-y-3">
                <div className="flex justify-between text-sm text-[var(--text-muted)]"><span>Subtotal</span><span>{formatPrice(subtotal())}</span></div>
                <div className="flex justify-between text-sm text-[var(--text-muted)]"><span>Shipping</span><span>{shippingFee() === 0 ? <span className="text-green-500">Free</span> : formatPrice(shippingFee())}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t border-[var(--border)]"><span className="text-sm tracking-wide">Total</span><span>{formatPrice(total())}</span></div>
                <Link href="/checkout" onClick={closeCart} className="block w-full text-center py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs tracking-[0.15em] uppercase font-medium hover:opacity-90 transition-opacity mt-4">Proceed to Checkout</Link>
                <button onClick={closeCart} className="block w-full text-center text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Continue Shopping</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
