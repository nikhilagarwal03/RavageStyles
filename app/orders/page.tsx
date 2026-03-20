'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package } from 'lucide-react';

const SC: Record<string,string> = { pending:'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20', confirmed:'text-blue-600 bg-blue-50 dark:bg-blue-900/20', processing:'text-purple-600 bg-purple-50', shipped:'text-indigo-600 bg-indigo-50', delivered:'text-green-600 bg-green-50 dark:bg-green-900/20', cancelled:'text-red-600 bg-red-50', refunded:'text-gray-500 bg-gray-100' };

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetch('/api/orders').then(r=>r.json()).then(d=>{ setOrders(d.data?.orders||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, [user, router]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-32 skeleton"/>)}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-24">
          <Package size={48} className="text-[var(--border)] mx-auto mb-4" />
          <p className="text-2xl font-light text-[var(--text-muted)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>No orders yet</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order,i) => (
            <motion.div key={order._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }} className="border border-[var(--border)] bg-[var(--bg-secondary)] p-5 hover:border-[var(--border-strong)] transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)] tracking-wide">#{order.orderId}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={'text-xs px-2 py-0.5 capitalize tracking-wide ' + (SC[order.orderStatus]||SC.pending)}>{order.orderStatus}</span>
                  <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {order.items.map((item: any) => (
                  <div key={item._id} className="relative w-12 h-14 flex-shrink-0 bg-[var(--bg-tertiary)] overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <Link href={'/orders/'+order._id} className="text-xs tracking-[0.12em] uppercase text-[var(--accent)] hover:underline">View Details →</Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
