'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, user } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { initialize(); }, [initialize]);
  useEffect(() => { if (user) fetchWishlist(); }, [user, fetchWishlist]);
  if (!mounted) return null;
  return <>{children}</>;
}
