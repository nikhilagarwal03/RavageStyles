'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ name:'', phone:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setForm({ name: user.name||'', phone: user.phone||'' });
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.data.user);
      toast.success('Profile updated!');
    } catch (e:any) { toast.error(e.message||'Failed'); }
    finally { setLoading(false); }
  };

  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>My Profile</h1>
      <div className="space-y-6">
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)]">
          <h2 className="text-xl font-light mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            <Input label="Email" value={user.email} disabled className="opacity-60 cursor-not-allowed" />
            <Input label="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit mobile" />
            <Button type="submit" loading={loading}>Save Changes</Button>
          </form>
        </motion.div>
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)]">
          <h2 className="text-xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Account Details</h2>
          {user.isAdmin && <span className="inline-block mt-2 text-xs px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] tracking-wide">Admin Account</span>}
        </motion.div>
      </div>
    </div>
  );
}
