'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', shortDescription:'', price:'', compareAtPrice:'', category:'T-Shirts', images:'', material:'', careInstructions:'', isFeatured:false, isActive:true, sizes:[{size:'XS',stock:0},{size:'S',stock:0},{size:'M',stock:0},{size:'L',stock:0},{size:'XL',stock:0},{size:'XXL',stock:0}] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    const p = new URLSearchParams({ page:String(page), limit:'10' });
    if (search) p.set('search', search);
    const res = await fetch('/api/admin/products?' + p.toString());
    const data = await res.json();
    setProducts(data.data?.products || []);
    setPages(data.data?.pagination?.pages || 1);
    setTotal(data.data?.pagination?.total || 0);
    setLoading(false);
  };
  useEffect(() => { load(); }, [page, search]);

  const openEdit = (p: any) => {
    setForm({ ...p, price:String(p.price), compareAtPrice:String(p.compareAtPrice||''), images:p.images.join(', ') });
    setEditProduct(p); setModalOpen(true);
  };
  const openNew = () => { setForm(EMPTY); setEditProduct(null); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this product?')) return;
    const res = await fetch('/api/products/'+id, { method:'DELETE' });
    if ((await res.json()).success) { toast.success('Archived'); load(); } else toast.error('Failed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, price:parseFloat(form.price), compareAtPrice:form.compareAtPrice?parseFloat(form.compareAtPrice):undefined, images:form.images.split(',').map((s:string)=>s.trim()).filter(Boolean), sizes:form.sizes.map((s:any)=>({...s,stock:parseInt(s.stock)||0})) };
      const url = editProduct ? '/api/products/'+editProduct._id : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success(editProduct?'Updated!':'Created!');
      setModalOpen(false); load();
    } catch (e:any) { toast.error(e.message||'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-light" style={{ fontFamily:'Cormorant Garamond,serif' }}>Products</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{total} total</p>
        </div>
        <Button onClick={openNew} variant="gold"><Plus size={14}/>Add Product</Button>
      </div>
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"/>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
              {['Product','Category','Price','Stock','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_,i)=>(
                <tr key={i} className="border-b border-[var(--border)]">{[...Array(6)].map((_,j)=><td key={j} className="px-4 py-3"><div className="h-4 skeleton"/></td>)}</tr>
              )) : products.map(p=>(
                <motion.tr key={p._id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]&&<div className="relative w-9 h-11 flex-shrink-0 overflow-hidden bg-[var(--bg-tertiary)]"><Image src={p.images[0]} alt={p.name} fill className="object-cover"/></div>}
                      <div><p className="text-sm font-medium line-clamp-1">{p.name}</p><p className="text-[10px] text-[var(--text-muted)]">{p.slug}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{p.category}</td>
                  <td className="px-4 py-3"><p className="text-sm font-medium">{formatPrice(p.price)}</p>{p.compareAtPrice&&<p className="text-xs text-[var(--text-muted)] line-through">{formatPrice(p.compareAtPrice)}</p>}</td>
                  <td className="px-4 py-3"><span className={'text-xs px-2 py-0.5 '+(p.totalStock>0?'bg-green-50 text-green-600 dark:bg-green-900/20':'bg-red-50 text-red-600')}>{p.totalStock} units</span></td>
                  <td className="px-4 py-3">
                    <span className={'text-xs px-2 py-0.5 '+(p.isActive?'bg-blue-50 text-blue-600':'bg-gray-100 text-gray-400')}>{p.isActive?'Active':'Hidden'}</span>
                    {p.isFeatured&&<span className="ml-1 text-xs px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)]">Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>openEdit(p)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><Edit2 size={14}/></button>
                      <button onClick={()=>handleDelete(p._id)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </div>
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

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editProduct?'Edit Product':'New Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Input label="Product Name *" value={form.name} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))} required/></div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-[var(--text-secondary)] mb-2">Category *</label>
              <select value={form.category} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))} className="input-luxury w-full">
                {['T-Shirts','Hoodies','Jackets','Accessories'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Price (₹) *" type="number" step="0.01" value={form.price} onChange={e=>setForm((f:any)=>({...f,price:e.target.value}))} required/>
            <Input label="Compare At Price" type="number" step="0.01" value={form.compareAtPrice} onChange={e=>setForm((f:any)=>({...f,compareAtPrice:e.target.value}))}/>
            <div className="col-span-2"><Input label="Image URLs (comma-separated) *" value={form.images} onChange={e=>setForm((f:any)=>({...f,images:e.target.value}))} placeholder="https://..., https://..." required/></div>
            <div className="col-span-2">
              <label className="block text-xs tracking-wide uppercase text-[var(--text-secondary)] mb-2">Short Description</label>
              <input value={form.shortDescription} onChange={e=>setForm((f:any)=>({...f,shortDescription:e.target.value}))} className="input-luxury w-full" maxLength={200}/>
            </div>
            <div className="col-span-2">
              <label className="block text-xs tracking-wide uppercase text-[var(--text-secondary)] mb-2">Full Description *</label>
              <textarea value={form.description} onChange={e=>setForm((f:any)=>({...f,description:e.target.value}))} className="input-luxury w-full resize-none" rows={3} required/>
            </div>
            <Input label="Material" value={form.material||''} onChange={e=>setForm((f:any)=>({...f,material:e.target.value}))}/>
            <Input label="Care Instructions" value={form.careInstructions||''} onChange={e=>setForm((f:any)=>({...f,careInstructions:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-xs tracking-wide uppercase text-[var(--text-secondary)] mb-3">Stock by Size</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {form.sizes.map((s:any,i:number)=>(
                <div key={s.size} className="text-center">
                  <label className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] block mb-1">{s.size}</label>
                  <input type="number" min="0" value={s.stock} onChange={e=>{ const sizes=[...form.sizes]; sizes[i]={...sizes[i],stock:parseInt(e.target.value)||0}; setForm((f:any)=>({...f,sizes})); }} className="w-full text-center input-luxury py-2 px-1 text-sm"/>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm((f:any)=>({...f,isFeatured:e.target.checked}))} className="accent-[var(--accent)]"/><span className="text-[var(--text-secondary)]">Featured</span></label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>setForm((f:any)=>({...f,isActive:e.target.checked}))} className="accent-[var(--accent)]"/><span className="text-[var(--text-secondary)]">Active</span></label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">{editProduct?'Save Changes':'Create Product'}</Button>
            <Button type="button" variant="outline" onClick={()=>setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
