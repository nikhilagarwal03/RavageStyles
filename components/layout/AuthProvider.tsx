'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, user } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();
  useEffect(() => { initialize(); }, [initialize]);
  useEffect(() => { if (user) fetchWishlist(); }, [user, fetchWishlist]);
  return <>{children}</>;
}
