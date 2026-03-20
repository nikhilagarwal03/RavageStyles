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

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      login(data.data.user, data.data.token);
      toast.success('Welcome, ' + data.data.user.name + '!');
      router.push('/');
    } catch (e: any) { toast.error(e.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl tracking-[0.2em] uppercase font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Ravage</Link>
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mt-2">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-8 bg-[var(--bg-secondary)] border border-[var(--border)]">
          <Input label="Full Name" required minLength={2} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" autoComplete="name" />
          <Input label="Email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" autoComplete="email" />
          <div className="relative">
            <Input label="Password" type={showPwd ? 'text' : 'password'} required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" autoComplete="new-password" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 bottom-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
        </form>
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">Already have an account? <Link href="/login" className="text-[var(--accent)] hover:underline">Sign in</Link></p>
      </motion.div>
    </div>
  );
}
