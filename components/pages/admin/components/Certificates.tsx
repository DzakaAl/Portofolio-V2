'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, AlertTriangle, GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
} from '@/lib/api';
import type { Certificate } from '@/lib/types';

interface Props {
  onShowMessage: (type: 'success' | 'error', text: string) => void;
  onCountChange?: (count: number) => void;
}

interface FormState {
  title: string;
  issuer: string;
  year: string;
  image: string;
  link: string;
}

const EMPTY: FormState = { title: '', issuer: '', year: '', image: '', link: '' };

export default function CertificatesAdmin({ onShowMessage, onCountChange }: Props) {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getCertificates();
    setItems(data);
    onCountChange?.(data.length);
  };

  const handleDragStart = (_e: React.DragEvent, index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const next = [...items];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setDraggedIndex(index);
    setItems(next);
  };
  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      await reorderCertificates(items.map((it, idx) => ({ id: it.id, order: idx + 1 })));
      onShowMessage('success', 'Urutan certificate diperbarui!');
    } catch {
      onShowMessage('error', 'Gagal memperbarui urutan');
    }
  };

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setFile(null); setIsFormOpen(true); };
  const openEdit = (it: Certificate) => {
    setEditingId(it.id);
    setForm({ title: it.title, issuer: it.issuer, year: it.year, image: it.image, link: it.link || '' });
    setFile(null);
    setIsFormOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload: FormData | Partial<Certificate>;
      if (file) {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('issuer', form.issuer);
        fd.append('year', form.year);
        if (form.link) fd.append('link', form.link);
        if (form.image) fd.append('image', form.image);
        fd.append('image_file', file);
        payload = fd;
      } else {
        payload = { ...form, link: form.link || null };
      }
      if (editingId) {
        await updateCertificate(editingId, payload);
        onShowMessage('success', 'Certificate diperbarui!');
      } else {
        await createCertificate(payload);
        onShowMessage('success', 'Certificate ditambahkan!');
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err) {
      onShowMessage('error', (err as Error).message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCertificate(deleteId);
      onShowMessage('success', 'Certificate dihapus');
      setDeleteId(null);
      fetchItems();
    } catch {
      onShowMessage('error', 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-4 sm:p-6 rounded-2xl flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-tech text-white uppercase tracking-tight">
          Certificates
        </h2>
        <Button onClick={openAdd} variant="primary" icon={Plus} size="sm">TAMBAH</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, index) => (
          <div
            key={it.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`glass-card p-3 rounded-2xl flex flex-col gap-3 border transition-all cursor-grab active:cursor-grabbing ${
              draggedIndex === index ? 'opacity-40 border-sky-400' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="aspect-[800/560] rounded-xl overflow-hidden bg-black/40 border border-white/5">
              {it.image && <img src={it.image} alt={it.title} className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-100 text-sm truncate">{it.title}</div>
              <div className="text-xs text-slate-400 truncate">{it.issuer} · {it.year}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => openEdit(it)} className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 py-1.5 rounded-xl border border-sky-500/20"><Edit className="w-3 h-3" /> EDIT</button>
              <button onClick={() => setDeleteId(it.id)} className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 py-1.5 rounded-xl border border-red-500/20"><Trash2 className="w-3 h-3" /> DELETE</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-500 text-sm">Belum ada certificate.</p>}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-2xl font-bold font-tech text-white uppercase tracking-tight">
            {editingId ? 'EDIT CERTIFICATE' : 'TAMBAH CERTIFICATE'}
          </h2>
          {([
            ['title', 'Judul Sertifikat'],
            ['issuer', 'Penerbit (mis. Coursera)'],
            ['year', 'Tahun'],
            ['link', 'Link kredensial (opsional)'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">{label}</label>
              <input
                required={key !== 'link'}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Gambar Sertifikat</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-slate-300 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:font-bold"
            />
            <p className="text-[11px] text-slate-500 mt-2">Atau isi URL gambar:</p>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/certs/... atau https://..."
              className="mt-1 w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-2.5 rounded-xl outline-none text-sm"
            />
          </div>
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
            <Button type="button" variant="danger" onClick={() => setIsFormOpen(false)} size="sm">BATAL</Button>
            <Button type="submit" disabled={loading} variant="primary" icon={editingId ? Save : Plus} size="sm">
              {loading ? 'PROCESSING...' : editingId ? 'SIMPAN' : 'TAMBAH'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="max-w-md">
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-tech">HAPUS CERTIFICATE</h3>
          <div className="flex items-center justify-center gap-3">
            <Button variant="danger" size="sm" onClick={() => setDeleteId(null)}>BATAL</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} icon={Trash2}>HAPUS</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
