import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, AlertTriangle, GripVertical } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { getTechStacks, createTechStack, updateTechStack, deleteTechStack, reorderTechStacks } from '../../../api';

export default function TechStack({ onShowMessage, onTechStacksCountChange }) {
  const [techStacks, setTechStacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Modals visibility state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Edit target state
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [stackForm, setStackForm] = useState({
    title: '',
    alt: '',
    src: '',
    order: 0,
  });

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    const data = await getTechStacks();
    setTechStacks(data);
    if (onTechStacksCountChange) onTechStacksCountChange(data.length);
  };

  // Drag & Drop Reorder Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newStacks = [...techStacks];
    const draggedItem = newStacks[draggedIndex];
    newStacks.splice(draggedIndex, 1);
    newStacks.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setTechStacks(newStacks);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    // Save new order to backend API
    const orders = techStacks.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    try {
      await reorderTechStacks(orders);
      onShowMessage('success', 'Urutan logo tech stack berhasil diperbarui!');
    } catch (err) {
      onShowMessage('error', 'Gagal memperbarui urutan tech stack');
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setStackForm({ title: '', alt: '', src: '', order: 0 });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (stack) => {
    setEditingId(stack.id);
    setStackForm({
      title: stack.title || '',
      alt: stack.alt || stack.title || '',
      src: stack.src || '',
      order: stack.order || 0,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...stackForm,
      alt: stackForm.alt || stackForm.title,
    };

    try {
      if (editingId) {
        await updateTechStack(editingId, payload);
        onShowMessage('success', 'Tech stack logo berhasil diperbarui!');
      } else {
        await createTechStack(payload);
        onShowMessage('success', 'Tech stack logo berhasil ditambahkan!');
      }

      setIsFormModalOpen(false);
      fetchTechStacks();
    } catch (err) {
      onShowMessage('error', err.message || 'Gagal menyimpan tech stack');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteTechStack(deleteConfirmId);
      onShowMessage('success', 'Tech stack berhasil dihapus');
      setDeleteConfirmId(null);
      fetchTechStacks();
    } catch (err) {
      onShowMessage('error', 'Gagal menghapus item.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar with Add Tech Stack Modal Trigger */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-tech text-white uppercase tracking-tight">
            Tech Stacks
          </h2>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary" icon={Plus} size="sm">
          TAMBAH
        </Button>
      </div>

      {/* Tech Stacks Grid List with Drag & Drop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {techStacks.map((stack, index) => (
          <div
            key={stack.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`glass-card p-5 rounded-2xl flex flex-col items-center justify-between text-center group transition-all cursor-grab active:cursor-grabbing border ${
              draggedIndex === index ? 'opacity-40 border-sky-400 scale-95' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="w-full flex justify-between items-center mb-1 text-white/40">
              <GripVertical className="w-4 h-4 cursor-grab" />
              <span className="text-[10px] font-mono">#{index + 1}</span>
            </div>

            <div className="w-12 h-12 flex items-center justify-center my-2">
              <img src={stack.src} alt={stack.alt} className="max-w-full max-h-full object-contain filter drop-shadow pointer-events-none" />
            </div>
            <span className="text-xs font-bold text-slate-200 mt-2 truncate w-full">{stack.title}</span>

            <div className="mt-4 flex items-center gap-1.5 w-full">
              <button
                onClick={() => handleOpenEditModal(stack)}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 py-1.5 rounded-xl border border-sky-500/20 transition-all cursor-pointer"
              >
                <Edit className="w-3 h-3" /> EDIT
              </button>

              <button
                onClick={() => setDeleteConfirmId(stack.id)}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 py-1.5 rounded-xl border border-red-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: ADD / EDIT TECH STACK FORM */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} maxWidth="max-w-lg">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-tech text-white uppercase tracking-tight">
              {editingId ? 'EDIT TECH STACK LOGO' : 'TAMBAH LOGO TECH STACK'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Masukkan nama teknologi dan URL gambar SVG ikonnya.
            </p>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Tech Name
              </label>
              <input
                type="text"
                required
                value={stackForm.title}
                onChange={(e) => setStackForm({ ...stackForm, title: e.target.value, alt: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                placeholder="Vue.js"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                SVG Icon URL (src)
              </label>
              <input
                type="text"
                required
                value={stackForm.src}
                onChange={(e) => setStackForm({ ...stackForm, src: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                placeholder="https://cdn.jsdelivr.net/.../vuejs-original.svg"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
              <Button type="button" variant="danger" onClick={() => setIsFormModalOpen(false)} size="sm">
                BATAL
              </Button>
              <Button type="submit" disabled={loading} variant="primary" icon={editingId ? Save : Plus} size="sm">
                {loading ? 'PROCESSING...' : editingId ? 'SIMPAN PERUBAHAN' : 'TAMBAH LOGO'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* MODAL 2: CONFIRMATION DELETE */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} maxWidth="max-w-md">
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white uppercase font-tech">KONFIRMASI HAPUS LOGO</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus logo ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(null)}>
              BATAL
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete} icon={Trash2}>
              HAPUS PERMANEN
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
