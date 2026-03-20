import Link from 'next/link';
const cols = {
  Shop: [['New Arrivals','/products?sort=createdAt_desc'],['T-Shirts','/products?category=T-Shirts'],['Hoodies','/products?category=Hoodies'],['Jackets','/products?category=Jackets']],
  Account: [['Orders','/orders'],['Wishlist','/wishlist'],['Profile','/profile'],['Login','/login']],
  Info: [['About','#'],['Contact','#'],['Returns','#'],['Size Guide','#']],
};
export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          <div>
            <h2 className="font-display text-3xl font-light tracking-widest uppercase mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Ravage</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">Premium luxury clothing. Crafted for those who demand more.</p>
          </div>
          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium mb-4">{title}</h3>
              <ul className="space-y-2">{items.map(([label,href], idx) => (
                <li key={label + '-' + idx}><Link href={href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">{label}</Link></li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} Ravage Style. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-[var(--text-muted)]">
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
