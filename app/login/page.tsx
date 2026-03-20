'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      login(data.data.user, data.data.token);
      toast.success('Welcome back, ' + data.data.user.name + '!');
      router.push(data.data.user.isAdmin ? '/admin/products' : '/');
    } catch (e: any) { toast.error(e.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl tracking-[0.2em] uppercase font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Ravage</Link>
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mt-2">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-8 bg-[var(--bg-secondary)] border border-[var(--border)]">
          <Input label="Email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" autoComplete="email" />
          <div className="relative">
            <Input label="Password" type={showPwd ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" autoComplete="current-password" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 bottom-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
        </form>
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">Don't have an account? <Link href="/signup" className="text-[var(--accent)] hover:underline">Create one</Link></p>
      </motion.div>
    </div>
  );
}
