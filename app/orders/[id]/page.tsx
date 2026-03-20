'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Package, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STEPS = ['pending','confirmed','processing','shipped','delivered'];

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetch('/api/orders/'+id).then(r=>r.json()).then(d=>{ setOrder(d.data?.order); setLoading(false); }).catch(()=>setLoading(false));
  }, [id, user, router]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12"><div className="h-64 skeleton"/></div>;
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-12 text-center"><p>Order not found</p></div>;

  const step = STEPS.indexOf(order.orderStatus);
  const success = sp.get('success'), failed = sp.get('failed');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {success && <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 mb-8"><CheckCircle2 size={20} className="text-green-500 flex-shrink-0"/><div><p className="text-sm font-medium text-green-700 dark:text-green-300">Payment successful!</p><p className="text-xs text-green-600">Your order is confirmed and being processed.</p></div></motion.div>}
      {failed && <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 mb-8"><XCircle size={20} className="text-red-500 flex-shrink-0"/><div><p className="text-sm font-medium text-red-700">Payment failed</p><p className="text-xs text-red-600">Please retry or contact support.</p></div></motion.div>}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Order Details</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">#{order.orderId}</p>
          <p className="text-xs text-[var(--text-muted)]">{formatDate(order.createdAt)}</p>
        </div>
        <Link href="/orders" className="text-xs tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">← All Orders</Link>
      </div>

      {!['cancelled','refunded'].includes(order.orderStatus) && (
        <div className="mb-8 p-5 bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 h-0.5 bg-[var(--border)] top-3 z-0"/>
            <div className="absolute left-0 h-0.5 bg-[var(--accent)] top-3 z-0 transition-all duration-500" style={{ width: step>=0 ? ((step/(STEPS.length-1))*100)+'%' : '0%' }}/>
            {STEPS.map((s,i) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-1">
                <div className={'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors '+(i<=step?'bg-[var(--accent)] text-white':'bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)]')}>{i<step?'✓':i+1}</div>
                <span className="text-[9px] uppercase tracking-wide text-[var(--text-muted)] hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-light flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}><Package size={16} className="text-[var(--accent)]"/>Items</h2>
          {order.items.map((item: any) => (
            <div key={item._id} className="flex gap-4 p-4 border border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="relative w-16 h-20 bg-[var(--bg-tertiary)] flex-shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover"/></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                <p className="text-sm font-medium mt-2">{formatPrice(item.price*item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="p-4 border border-[var(--border)] bg-[var(--bg-secondary)]">
            <h3 className="text-xs tracking-[0.15em] uppercase font-medium mb-3 flex items-center gap-2"><MapPin size={12} className="text-[var(--accent)]"/>Shipping</h3>
            <div className="text-sm text-[var(--text-secondary)] space-y-0.5">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}{order.shippingAddress.line2?', '+order.shippingAddress.line2:''}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </div>
          <div className="p-4 border border-[var(--border)] bg-[var(--bg-secondary)]">
            <h3 className="text-xs tracking-[0.15em] uppercase font-medium mb-3">Payment</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Shipping</span><span>{order.shippingFee===0?<span className="text-green-500">Free</span>:formatPrice(order.shippingFee)}</span></div>
              <div className="flex justify-between font-medium pt-2 border-t border-[var(--border)]"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Status: <span className={'capitalize font-medium '+(order.paymentStatus==='paid'?'text-green-500':'text-yellow-500')}>{order.paymentStatus}</span></p>
              {order.razorpayPaymentId&&<p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono break-all">{order.razorpayPaymentId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12"><div className="h-64 skeleton"/></div>}><OrderDetail/></Suspense>;
}
