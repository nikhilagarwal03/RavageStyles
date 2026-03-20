import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; isLoading: boolean;
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(persist((set, get) => ({
  items: [], isLoading: false,
  toggle: async (productId) => {
    try {
      const res = await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
      if (res.ok) { const { data } = await res.json(); set({ items: data.wishlist.map((x: any) => x._id || x) }); }
    } catch {}
  },
  isInWishlist: (id) => get().items.includes(id),
  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) { const { data } = await res.json(); set({ items: data.wishlist.map((p: any) => p._id || p) }); }
    } catch {} finally { set({ isLoading: false }); }
  },
}), { name: 'wishlist-storage', partialize: (s) => ({ items: s.items }) }));
