'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, AlertTriangle, GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} from '@/lib/api';
import type { Experience } from '@/lib/types';

interface Props {
  onShowMessage: (type: 'success' | 'error', text: string) => void;
  onCountChange?: (count: number) => void;
}

interface FormState {
  period: string;
  role: string;
  org: string;
  description: string;
}

const EMPTY: FormState = { period: '', role: '', org: '', description: '' };

export default function ExperienceAdmin({ onShowMessage, onCountChange }: Props) {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getExperiences();
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
      await reorderExperiences(items.map((it, idx) => ({ id: it.id, order: idx + 1 })));
      onShowMessage('success', 'Urutan experience diperbarui!');
    } catch {
      onShowMessage('error', 'Gagal memperbarui urutan');
    }
  };

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setIsFormOpen(true); };
  const openEdit = (it: Experience) => {
    setEditingId(it.id);
    setForm({ period: it.period, role: it.role, org: it.org, description: it.description });
    setIsFormOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateExperience(editingId, form);
        onShowMessage('success', 'Experience diperbarui!');
      } else {
        await createExperience({ ...form, order: items.length + 1 });
        onShowMessage('success', 'Experience ditambahkan!');
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
      await deleteExperience(deleteId);
      onShowMessage('success', 'Experience dihapus');
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
          Experience
        </h2>
        <Button onClick={openAdd} variant="primary" icon={Plus} size="sm">TAMBAH</Button>
      </div>

      <div className="space-y-3">
        {items.map((it, index) => (
          <div
            key={it.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`glass-card p-4 rounded-2xl flex items-center gap-4 border transition-all cursor-grab active:cursor-grabbing ${
              draggedIndex === index ? 'opacity-40 border-sky-400' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <GripVertical className="w-4 h-4 text-white/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono text-sky-400">{it.period}</div>
              <div className="font-bold text-slate-100 truncate">{it.role}</div>
              <div className="text-xs text-slate-400 truncate">{it.org}</div>
            </div>
            <button onClick={() => openEdit(it)} className="text-sky-400 hover:text-sky-300 p-2"><Edit className="w-4 h-4" /></button>
            <button onClick={() => setDeleteId(it.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-500 text-sm">Belum ada experience.</p>}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-2xl font-bold font-tech text-white uppercase tracking-tight">
            {editingId ? 'EDIT EXPERIENCE' : 'TAMBAH EXPERIENCE'}
          </h2>
          {([
            ['period', 'Period (mis. 2024 — PRESENT)'],
            ['role', 'Role / Posisi'],
            ['org', 'Organisasi / Tempat'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">{label}</label>
              <input
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Deskripsi</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm resize-y"
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
          <h3 className="text-lg font-bold text-white uppercase font-tech">HAPUS EXPERIENCE</h3>
          <div className="flex items-center justify-center gap-3">
            <Button variant="danger" size="sm" onClick={() => setDeleteId(null)}>BATAL</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} icon={Trash2}>HAPUS</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
