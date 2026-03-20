'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [dist, setDist] = useState<Record<number,number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const { user } = useAuthStore();

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/products/' + productId + '/reviews');
    const data = await res.json();
    setReviews(data.data?.reviews || []);
    setDist(data.data?.ratingDistribution || {});
    setTotal(data.data?.total || 0);
    setLoading(false);
  };
  useEffect(() => { load(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.comment) { toast.error('Please fill all fields'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/products/' + productId + '/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success('Review submitted!');
      setShowForm(false);
      setForm({ rating: 5, title: '', comment: '' });
      load();
    } catch (e: any) { toast.error(e.message || 'Failed to submit'); }
    finally { setSubmitting(false); }
  };

  const avg = total > 0 ? Object.entries(dist).reduce((s,[r,c]) => s + Number(r)*c, 0) / total : 0;

  return (
    <section className="mt-20 pt-12 border-t border-[var(--border)]">
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase text-[var(--accent)]">Customer Feedback</span>
        <h2 className="text-4xl font-light mt-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Reviews</h2>
      </div>
      {total > 0 && (
        <div className="grid sm:grid-cols-2 gap-8 mb-10 p-6 bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-6xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{avg.toFixed(1)}</p>
              <StarRating rating={avg} size={16} />
              <p className="text-xs text-[var(--text-muted)] mt-1">{total} reviews</p>
            </div>
          </div>
          <div className="space-y-2">
            {[5,4,3,2,1].map(r => {
              const c = dist[r] || 0;
              const pct = total > 0 ? (c/total)*100 : 0;
              return (
                <div key={r} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-[var(--text-muted)]">{r}</span>
                  <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] overflow-hidden">
                    <div className="h-full bg-[var(--accent)] transition-all duration-500" style={{ width: pct + '%' }} />
                  </div>
                  <span className="w-5 text-[var(--text-muted)]">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {user && (
        <div className="mb-8">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} variant="outline">Write a Review</Button>
          ) : (
            <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="p-6 border border-[var(--border)] bg-[var(--bg-secondary)] space-y-4">
              <h3 className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Share Your Experience</h3>
              <div>
                <label className="block text-xs tracking-wide uppercase text-[var(--text-secondary)] mb-2">Rating</label>
                <StarRating rating={form.rating} size={20} interactive onRate={r => setForm(f => ({ ...f, rating: r }))} />
              </div>
              <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Summarise your experience" />
              <div>
                <label className="block text-xs tracking-wide uppercase text-[var(--text-secondary)] mb-2">Review</label>
                <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} rows={4} placeholder="Share your thoughts..." className="input-luxury w-full resize-none" />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={submitting}>Submit Review</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </motion.form>
          )}
        </div>
      )}
      {loading ? <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-24 skeleton" />)}</div>
        : reviews.length === 0 ? <p className="text-center text-[var(--text-muted)] py-12 text-sm">No reviews yet. Be the first!</p>
        : (
          <div className="space-y-6">
            {reviews.map(r => (
              <div key={r._id} className="pb-6 border-b border-[var(--border)] last:border-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-medium">{r.user?.name || 'Anonymous'}</p>
                      {r.isVerifiedPurchase && <span className="flex items-center gap-1 text-[10px] text-green-500"><CheckCircle2 size={10} /> Verified</span>}
                    </div>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{formatDate(r.createdAt)}</p>
                </div>
                <p className="text-sm font-medium mb-1">{r.title}</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
    </section>
  );
}
