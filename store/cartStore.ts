import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string; name: string; image: string; price: number;
  size: string; quantity: number; maxStock: number; slug: string;
}

interface CartState {
  items: CartItem[]; isOpen: boolean;
  addItem: (item: Omit<CartItem,'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void; openCart: () => void; closeCart: () => void; toggleCart: () => void;
  totalItems: () => number; subtotal: () => number; shippingFee: () => number; total: () => number;
}

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [], isOpen: false,
  addItem: (item) => {
    const { items } = get();
    const idx = items.findIndex(i => i.productId === item.productId && i.size === item.size);
    if (idx >= 0) {
      const u = [...items];
      u[idx].quantity = Math.min(u[idx].quantity + (item.quantity || 1), item.maxStock);
      set({ items: u, isOpen: true });
    } else {
      set({ items: [...items, { ...item, quantity: item.quantity || 1 }], isOpen: true });
    }
  },
  removeItem: (pid, size) => set({ items: get().items.filter(i => !(i.productId === pid && i.size === size)) }),
  updateQuantity: (pid, size, qty) => {
    if (qty < 1) { get().removeItem(pid, size); return; }
    set({ items: get().items.map(i => i.productId === pid && i.size === size ? { ...i, quantity: Math.min(qty, i.maxStock) } : i) });
  },
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set({ isOpen: !get().isOpen }),
  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
  subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
  shippingFee: () => get().subtotal() >= 999 ? 0 : 99,
  total: () => get().subtotal() + get().shippingFee(),
}), { name: 'cart-storage', partialize: (s) => ({ items: s.items }) }));
