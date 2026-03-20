'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Package, ShoppingCart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [{ l:'Products', h:'/admin/products', I:Package }, { l:'Orders', h:'/admin/orders', I:ShoppingCart }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { if (!isLoading && (!user||!user.isAdmin)) router.push('/login'); }, [user, isLoading, router]);

  if (isLoading || !user?.isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <aside className="w-56 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col fixed left-0 top-0 h-full z-30">
        <div className="p-5 border-b border-[var(--border)]">
          <Link href="/" className="text-xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Ravage</Link>
          <p className="text-[10px] tracking-[0.15em] uppercase text-[var(--accent)] mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ l, h, I }) => (
            <Link key={h} href={h} className={cn('flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition-colors', pathname.startsWith(h) ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]')}>
              <I size={15}/>{l}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
          </div>
          <button onClick={async()=>{ await logout(); router.push('/'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
            <LogOut size={13}/>Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 min-h-screen"><div className="p-6 sm:p-8">{children}</div></main>
    </div>
  );
}
