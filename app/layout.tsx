import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/cart/CartDrawer';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/layout/AuthProvider';
import ThemeProvider from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: { default: 'Ravage Style — Luxury Clothing', template: '%s | Ravage Style' },
  description: 'Premium luxury clothing. Minimal. Refined. Elevated.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)]" style={{ fontFamily: 'Jost, sans-serif' }}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <CartDrawer />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-right" toastOptions={{
              style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '0', fontFamily: 'Jost, sans-serif', fontSize: '13px' },
              success: { iconTheme: { primary: '#c9a84c', secondary: '#fff' } },
            }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
