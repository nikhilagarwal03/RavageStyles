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
              <span key={i} className="mx-10">New Arrivals Launched &nbsp;·&nbsp; Premium Quality &nbsp;·&nbsp;Big Discounts</span>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[var(--text-secondary)]">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo Section */}
            <Link href="/" className="flex-1 flex justify-center md:justify-start">
              <span className="text-xl md:text-2xl font-bold tracking-tighter">
                RAVAGE 
              </span>
            </Link>

            {/* Desktop Navigation stays the same */}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* 1. Semi-transparent Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* 2. Sliding Side Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white dark:bg-zinc-900 z-50 p-6 shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header with Branding and Close Button */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-black tracking-tighter">
                    RAVAGE <span className="text-gray-500">STYLE</span>
                  </span>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  {NAV.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-2xl font-bold uppercase tracking-tight transition-colors ${
                        pathname === link.href ? 'text-ravage-red' : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Bottom Actions (User, Wishlist) */}
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 text-lg font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User size={20} /> Account
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className="flex items-center gap-3 text-lg font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Heart size={20} /> Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
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
