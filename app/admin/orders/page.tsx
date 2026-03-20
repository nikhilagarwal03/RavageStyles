'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice, formatDate, ORDER_STATUSES } from '@/lib/utils';
import toast from 'react-hot-toast';

const SC: Record<string,string> = { pending:'text-yellow-600 bg-yellow-50', confirmed:'text-blue-600 bg-blue-50', processing:'text-purple-600 bg-purple-50', shipped:'text-indigo-600 bg-indigo-50', delivered:'text-green-600 bg-green-50 dark:bg-green-900/20', cancelled:'text-red-600 bg-red-50', refunded:'text-gray-500 bg-gray-100' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string|null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/orders?page='+page+'&limit=15');
    const data = await res.json();
    setOrders(data.data?.orders||[]);
    setPages(data.data?.pagination?.pages||1);
    setTotal(data.data?.pagination?.total||0);
    setLoading(false);
  };
  useEffect(()=>{ load(); }, [page]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/orders/'+id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ orderStatus:status }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success('Status updated');
      setOrders(orders.map(o=>o._id===id?{...o,orderStatus:status}:o));
    } catch (e:any) { toast.error(e.message||'Failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-light" style={{ fontFamily:'Cormorant Garamond,serif' }}>Orders</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">{total} total orders</p>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
              {['Order','Customer','Date','Items','Total','Payment','Status','Update'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)] font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? [...Array(8)].map((_,i)=>(
                <tr key={i} className="border-b border-[var(--border)]">{[...Array(8)].map((_,j)=><td key={j} className="px-4 py-3"><div className="h-4 skeleton"/></td>)}</tr>
              )) : orders.map(o=>(
                <motion.tr key={o._id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3"><p className="text-xs font-mono">{o.orderId}</p></td>
                  <td className="px-4 py-3"><p className="text-sm">{o.user?.name}</p><p className="text-[10px] text-[var(--text-muted)]">{o.user?.email}</p></td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">{o.items.length}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><span className={'text-xs px-2 py-0.5 capitalize '+(o.paymentStatus==='paid'?'bg-green-50 text-green-600 dark:bg-green-900/20':'bg-yellow-50 text-yellow-600')}>{o.paymentStatus}</span></td>
                  <td className="px-4 py-3"><span className={'text-xs px-2 py-0.5 capitalize '+(SC[o.orderStatus]||SC.pending)}>{o.orderStatus}</span></td>
                  <td className="px-4 py-3">
                    <select value={o.orderStatus} onChange={e=>updateStatus(o._id,e.target.value)} disabled={updating===o._id}
                      className="text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] px-2 py-1 focus:outline-none disabled:opacity-50">
                      {ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages>1&&<div className="flex justify-center gap-2 p-4 border-t border-[var(--border)]">
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} className={'w-8 h-8 text-xs transition-colors '+(p===page?'bg-[var(--text-primary)] text-[var(--bg-primary)]':'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)]')}>{p}</button>
          ))}
        </div>}
      </div>
    </div>
  );
}
