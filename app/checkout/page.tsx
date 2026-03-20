'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<'address'|'review'>('address');
  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState({ name:'', phone:'', line1:'', line2:'', city:'', state:'', pincode:'', country:'India' });

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    if (items.length === 0) { router.push('/products'); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.head.appendChild(s);
    if (user) setAddr(a => ({ ...a, name: user.name }));
  }, [user, items.length, router]);

  const handlePay = async () => {
    const required = ['name','phone','line1','city','state','pincode'];
    if (required.some(k => !addr[k as keyof typeof addr])) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const orderRes = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: items.map(i=>({ product:i.productId, size:i.size, quantity:i.quantity })), shippingAddress: addr }) });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);
      const order = orderData.data.order;

      const rpRes = await fetch('/api/razorpay/create-order', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderId: order._id }) });
      const rpData = await rpRes.json();
      if (!rpData.success) throw new Error(rpData.message);

      new window.Razorpay({
        key: rpData.data.key, amount: rpData.data.amount, currency: rpData.data.currency,
        order_id: rpData.data.razorpayOrderId, name:'Ravage Style', description:'Premium Clothing',
        prefill: { name: user?.name, email: user?.email, contact: addr.phone },
        theme: { color:'#c9a84c' },
        handler: async (response: any) => {
          const vRes = await fetch('/api/razorpay/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...response, orderId: order._id }) });
          const vData = await vRes.json();
          if (!vData.success) { toast.error('Payment verification failed'); router.push('/orders/' + order._id + '?failed=1'); return; }
          clearCart();
          router.push('/orders/' + order._id + '?success=1');
        },
        modal: { ondismiss: () => { toast('Payment cancelled'); setLoading(false); } },
      }).open();
    } catch (e: any) { toast.error(e.message || 'Failed to place order'); setLoading(false); }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Checkout</h1>
        <div className="flex items-center gap-3 mt-3">
          {['address','review'].map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={'w-6 h-6 flex items-center justify-center text-xs font-medium ' + (s===step||step==='review'&&s==='address' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'border border-[var(--border)] text-[var(--text-muted)]')}>{i+1}</div>
              <span className={'text-xs tracking-wide capitalize ' + (s===step ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]')}>{s}</span>
              {i<1 && <div className="w-8 h-px bg-[var(--border)]" />}
            </div>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div>
          {step === 'address' && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
              <h2 className="text-2xl font-light mb-6 flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}><Truck size={18} className="text-[var(--accent)]" />Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name *" value={addr.name} onChange={e=>setAddr(a=>({...a,name:e.target.value}))} placeholder="John Doe" />
                  <Input label="Phone *" value={addr.phone} onChange={e=>setAddr(a=>({...a,phone:e.target.value}))} placeholder="10-digit mobile" />
                </div>
                <Input label="Address Line 1 *" value={addr.line1} onChange={e=>setAddr(a=>({...a,line1:e.target.value}))} placeholder="House/Flat No, Street" />
                <Input label="Address Line 2" value={addr.line2} onChange={e=>setAddr(a=>({...a,line2:e.target.value}))} placeholder="Area, Landmark (optional)" />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="City *" value={addr.city} onChange={e=>setAddr(a=>({...a,city:e.target.value}))} />
                  <Input label="State *" value={addr.state} onChange={e=>setAddr(a=>({...a,state:e.target.value}))} />
                  <Input label="Pincode *" value={addr.pincode} onChange={e=>setAddr(a=>({...a,pincode:e.target.value}))} maxLength={6} />
                </div>
                <Button onClick={() => setStep('review')} size="lg" className="w-full mt-2">Continue to Review</Button>
              </div>
            </motion.div>
          )}
          {step === 'review' && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
              <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Review Order</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.productId+item.size} className="flex gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="relative w-16 h-20 bg-[var(--bg-tertiary)] flex-shrink-0 overflow-hidden"><Image src={item.image} alt={item.name} fill className="object-cover" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-2">{formatPrice(item.price*item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)] mb-6 space-y-1">
                <p className="text-xs font-medium tracking-wide uppercase mb-2">Shipping to</p>
                <p className="text-sm text-[var(--text-secondary)]">{addr.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{addr.line1}{addr.line2?', '+addr.line2:''}</p>
                <p className="text-sm text-[var(--text-secondary)]">{addr.city}, {addr.state} - {addr.pincode}</p>
                <button onClick={() => setStep('address')} className="text-xs text-[var(--accent)] mt-2 hover:underline">Change</button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('address')}>Back</Button>
                <Button onClick={handlePay} loading={loading} size="lg" className="flex-1"><Lock size={14} />Pay {formatPrice(total())}</Button>
              </div>
            </motion.div>
          )}
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 h-fit sticky top-24">
          <h3 className="text-xl font-light mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Order Summary</h3>
          <div className="space-y-2 mb-5">
            {items.map(item => (
              <div key={item.productId+item.size} className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)] line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                <span className="flex-shrink-0">{formatPrice(item.price*item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Subtotal</span><span>{formatPrice(subtotal())}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Shipping</span><span>{shippingFee()===0?<span className="text-green-500">Free</span>:formatPrice(shippingFee())}</span></div>
            <div className="flex justify-between font-medium pt-2 border-t border-[var(--border)]"><span className="text-sm tracking-wide">Total</span><span className="text-lg">{formatPrice(total())}</span></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]"><Lock size={10} />Secured by Razorpay</div>
        </div>
      </div>
    </div>
  );
}
