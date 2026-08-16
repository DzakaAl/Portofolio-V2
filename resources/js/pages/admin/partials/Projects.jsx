import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, ExternalLink, AlertTriangle, GripVertical, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { getProjects, createProject, updateProject, deleteProject, reorderProjects } from '../../../api';

export default function Projects({ onShowMessage, onProjectsCountChange }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Modals visibility state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Edit target state
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tags: '',
    image: '',
    link: '',
    featured: true,
  });

  // Uploaded image file state & preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
    if (onProjectsCountChange) onProjectsCountChange(data.length);
  };

  // Drag & Drop Reorder Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newProjects = [...projects];
    const draggedItem = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setProjects(newProjects);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const orders = projects.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    try {
      await reorderProjects(orders);
      onShowMessage('success', 'Urutan project berhasil diperbarui!');
    } catch (err) {
      onShowMessage('error', 'Gagal memperbarui urutan project');
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
    setProjectForm({
      title: '',
      description: '',
      tags: '',
      image: '',
      link: '',
      featured: true,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingId(proj.id);
    setImageFile(null);
    setImagePreview(proj.image || '');
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || ''),
      image: proj.image || '',
      link: proj.link || '',
      featured: proj.featured ?? true,
    });
    setIsFormModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('tags', projectForm.tags);
    formData.append('link', projectForm.link || '');
    formData.append('featured', projectForm.featured ? '1' : '0');

    if (imageFile) {
      formData.append('image_file', imageFile);
    } else if (projectForm.image) {
      formData.append('image', projectForm.image);
    }

    try {
      if (editingId) {
        await updateProject(editingId, formData);
        onShowMessage('success', 'Project berhasil diperbarui!');
      } else {
        await createProject(formData);
        onShowMessage('success', 'Project baru berhasil ditambahkan!');
      }

      setIsFormModalOpen(false);
      fetchProjects();
    } catch (err) {
      onShowMessage('error', err.message || 'Gagal menyimpan project');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteProject(deleteConfirmId);
      onShowMessage('success', 'Project berhasil dihapus');
      setDeleteConfirmId(null);
      fetchProjects();
    } catch (err) {
      onShowMessage('error', 'Gagal menghapus project.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar with Add Project Modal Trigger */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-tech text-white uppercase tracking-tight">
            Projects
          </h2>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary" icon={Plus} size="sm">
          TAMBAH
        </Button>
      </div>

      {/* Projects Grid List with Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`glass-card overflow-hidden flex flex-col justify-between group rounded-2xl transition-all cursor-grab active:cursor-grabbing border ${
              draggedIndex === index ? 'opacity-40 border-sky-400 scale-[0.98]' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
              
              {/* Drag Handle & Featured Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white p-1.5 rounded-lg border border-white/15">
                <GripVertical className="w-4 h-4 text-white/80" />
              </div>

              {proj.featured && (
                <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg">
                  Featured
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{proj.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(Array.isArray(proj.tags) ? proj.tags : []).map((t, idx) => (
                    <span key={idx} className="bg-white/10 text-slate-200 text-[10px] px-2 py-0.5 rounded-md font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                {proj.link ? (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Visit Link
                  </a>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-500/20 transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> EDIT
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl border border-red-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> DELETE
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: ADD / EDIT PROJECT FORM (SUPPORTS FILE UPLOAD & URL) */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} maxWidth="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-tech text-white uppercase tracking-tight">
              {editingId ? 'EDIT PROJECT' : 'TAMBAH PROJECT BARU'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Unggah file gambar atau masukkan URL gambar banner project Anda.
            </p>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Project Title
              </label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                placeholder="CYBER ARCADE 2099"
              />
            </div>

            {/* Image File Upload Only */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Project Banner Image
              </label>
              
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-sky-400/80 rounded-2xl bg-black/50 hover:bg-white/[0.02] cursor-pointer transition-all text-center group">
                <Upload className="w-8 h-8 text-sky-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-sm font-bold text-white">Klik untuk Pilih & Upload Gambar</span>
                <span className="text-xs text-slate-400 mt-1">Format: JPG, PNG, WEBP, SVG (Maksimum 5MB)</span>
                <input
                  type="file"
                  required={!editingId && !imagePreview}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Preview Thumbnail */}
              {imagePreview && (
                <div className="mt-4 relative aspect-video w-full rounded-2xl overflow-hidden border border-white/20">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/20">
                    Preview Gambar
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                placeholder="Deskripsi mengenai fitur dan teknologi..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                  placeholder="REACT, THREE.JS, TAILWIND"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Live Demo URL (Optional)
                </label>
                <input
                  type="text"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 accent-white"
                />
                <span>Featured on Homepage Showcase</span>
              </label>

              <div className="flex items-center gap-2">
                <Button type="button" variant="danger" onClick={() => setIsFormModalOpen(false)} size="sm">
                  BATAL
                </Button>
                <Button type="submit" disabled={loading} variant="primary" icon={editingId ? Save : Plus} size="sm">
                  {loading ? 'PROCESSING...' : editingId ? 'SIMPAN PERUBAHAN' : 'TAMBAH PROJECT'}
                </Button>
              </div>
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
            <h3 className="text-lg font-bold text-white uppercase font-tech">KONFIRMASI HAPUS PROJECT</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus project ini? Tindakan ini tidak dapat dibatalkan.
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
