'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Sun, Moon, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV = [
  { label: 'New Arrivals', href: '/products?sort=createdAt_desc' },
  { label: 'T-Shirts', href: '/products?category=T-Shirts' },
  { label: 'Hoodies', href: '/products?category=Hoodies' },
  { label: 'Jackets', href: '/products?category=Jackets' },
  { label: 'Trending', href: '/products?sort=trending' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { setDark(localStorage.getItem('theme') === 'dark'); }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const toggleTheme = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  const handleLogout = async () => { await logout(); setUserOpen(false); toast.success('Logged out'); router.push('/'); };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { router.push('/products?search=' + encodeURIComponent(q.trim())); setSearchOpen(false); setQ(''); }
  };
  const cartCount = totalItems();

  return (
    <>
      <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[var(--bg-secondary)]/95 backdrop-blur-md border-b border-[var(--border)]' : 'bg-transparent')}>
        {/* Announcement */}
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] text-center py-2 text-xs tracking-[0.15em] uppercase overflow-hidden">
          <div className="inline-flex animate-marquee whitespace-nowrap">
            {[...Array(4)].map((_,i) => (
              <span key={i} className="mx-10">Free shipping over ₹999 &nbsp;·&nbsp; New arrivals weekly &nbsp;·&nbsp; Premium quality &nbsp;·&nbsp; Easy 30-day returns</span>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[var(--text-secondary)]">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <span className="text-2xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Ravage</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map(l => (
                <Link key={l.href} href={l.href} className={cn('text-xs tracking-[0.12em] uppercase transition-colors relative group', pathname === l.href ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')}>
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--accent)] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Search size={18} /></button>
              <button onClick={toggleTheme} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
              <Link href="/wishlist" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Heart size={18} /></Link>
              <div className="relative" ref={menuRef}>
                <button onClick={() => user ? setUserOpen(!userOpen) : router.push('/login')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><User size={18} /></button>
                <AnimatePresence>
                  {userOpen && user && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--shadow-lg)] z-50">
                      <div className="p-3 border-b border-[var(--border)]">
                        <p className="text-xs font-medium truncate">{user.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {[{l:'Profile',h:'/profile'},{l:'Orders',h:'/orders'},{l:'Wishlist',h:'/wishlist'},...(user.isAdmin?[{l:'Admin',h:'/admin/products'}]:[])].map(item => (
                          <Link key={item.h} href={item.h} onClick={() => setUserOpen(false)} className="block px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">{item.l}</Link>
                        ))}
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-[var(--bg-tertiary)] transition-colors">Log Out</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={toggleCart} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-[var(--accent)] text-white text-[10px] flex items-center justify-center rounded-full font-medium">
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-72 bg-[var(--bg-secondary)] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <span className="text-xl tracking-widest font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>RAVAGE</span>
                <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
              </div>
              <nav className="flex-1 p-6 space-y-5">
                {NAV.map(l => (<Link key={l.href} href={l.href} className="block text-sm tracking-[0.1em] uppercase text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">{l.label}</Link>))}
              </nav>
              <div className="p-6 border-t border-[var(--border)]">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <button onClick={handleLogout} className="text-xs text-red-500">Log Out</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block w-full text-center py-2 border border-[var(--border)] text-sm tracking-widest uppercase hover:bg-[var(--bg-tertiary)] transition-colors">Login</Link>
                    <Link href="/signup" className="block w-full text-center py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm tracking-widest uppercase">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--bg-primary)]/96 backdrop-blur-sm flex items-start justify-center pt-32 px-4">
            <div className="w-full max-w-2xl">
              <form onSubmit={handleSearch}>
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..."
                  className="w-full bg-transparent border-b-2 border-[var(--text-primary)] pb-4 text-3xl font-light text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }} />
              </form>
              <button onClick={() => setSearchOpen(false)} className="mt-6 text-sm text-[var(--text-muted)] tracking-widest uppercase hover:text-[var(--text-primary)] transition-colors">Close (Esc)</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: 'calc(2rem + 64px)' }} />
    </>
  );
}
