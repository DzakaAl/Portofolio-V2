'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, AlertTriangle, GripVertical, Upload, FileArchive, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '@/lib/api';
import { PROJECT_DESC_MAX_WORDS, clampWords, countWords } from '@/lib/text';
import type { Project } from '@/lib/types';

interface AdminProjectsProps {
  onShowMessage: (type: 'success' | 'error', text: string) => void;
  onProjectsCountChange?: (count: number) => void;
}

interface ProjectFormState {
  title: string;
  description: string;
  tags: string;
  image: string;
  link: string;
  featured: boolean;
  show_preview: boolean;
}

const EMPTY_FORM: ProjectFormState = {
  title: '',
  description: '',
  tags: '',
  image: '',
  link: '',
  featured: true,
  show_preview: true,
};

export default function Projects({ onShowMessage, onProjectsCountChange }: AdminProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Modals visibility state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Edit target state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [projectForm, setProjectForm] = useState<ProjectFormState>(EMPTY_FORM);

  // Uploaded image file state & preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [buildFile, setBuildFile] = useState<File | null>(null);
  const [buildFolder, setBuildFolder] = useState<File[] | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
    if (onProjectsCountChange) onProjectsCountChange(data.length);
  };

  // Drag & Drop Reorder Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
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
    setBuildFile(null);
    setBuildFolder(null);
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
      show_preview: true,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setBuildFile(null);
    setBuildFolder(null);
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
      show_preview: proj.show_preview ?? true,
    });
    setIsFormModalOpen(true);
  };

  const isHostedBuild = projectForm.link.startsWith('/storage/builds/');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('tags', projectForm.tags);
    formData.append('link', projectForm.link || '');
    formData.append('featured', projectForm.featured ? '1' : '0');
    formData.append('show_preview', projectForm.show_preview ? '1' : '0');

    if (buildFolder) {
      for (const f of buildFolder) {
        formData.append('build_files', f, f.name);
        formData.append('build_paths', f.webkitRelativePath || f.name);
      }
    } else if (buildFile) formData.append('build_file', buildFile);

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
      onShowMessage('error', (err as Error).message || 'Gagal menyimpan project');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteProject(deleteConfirmId);
      onShowMessage('success', 'Project berhasil dihapus!');
      setDeleteConfirmId(null);
      fetchProjects();
    } catch (err) {
      onShowMessage('error', 'Gagal menghapus project');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Button Tambah */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-tech text-white uppercase tracking-tight">
            PROJECTS
          </h2>
        </div>
      
        <Button onClick={handleOpenAddModal} variant="primary" icon={Plus} size="sm">
          TAMBAH
        </Button>
      </div>

      {/* Drag & Drop Projects List */}
      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 ${
              draggedIndex === idx
                ? 'opacity-40 border-sky-400 bg-sky-500/10'
                : 'bg-black/60 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-white p-1">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-tech font-bold text-white text-sm tracking-tight">{proj.title}</h4>
                  {proj.featured && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 uppercase font-semibold">
                      Featured
                    </span>
                  )}
                  {proj.show_preview === false && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase font-semibold">
                      No Preview
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 max-w-md">{proj.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="glass"
                size="sm"
                icon={Edit}
                onClick={() => handleOpenEditModal(proj)}
              >
                EDIT
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setDeleteConfirmId(proj.id)}
              >
                HAPUS
              </Button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs font-mono">
            Belum ada project. Klik "TAMBAH" untuk membuat project baru.
          </div>
        )}
      </div>

      {/* MODAL 1: ADD & EDIT PROJECT FORM */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold font-tech text-white uppercase tracking-tight">
              {editingId ? 'EDIT PROJECT' : 'TAMBAH PROJECT BARU'}
            </h3>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Judul Project
              </label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                placeholder="Contoh: Ecommerce 3D Showcase"
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
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span>Description</span>
                <span
                  className={`text-[10px] font-mono tracking-wider normal-case ${
                    countWords(projectForm.description) >= PROJECT_DESC_MAX_WORDS
                      ? 'text-amber-300'
                      : 'text-slate-500'
                  }`}
                >
                  {countWords(projectForm.description)}/{PROJECT_DESC_MAX_WORDS} kata
                </span>
              </label>
              <textarea
                rows={5}
                required
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: clampWords(e.target.value, PROJECT_DESC_MAX_WORDS),
                  })
                }
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm"
                placeholder={`Deskripsi mengenai fitur dan teknologi (maksimal ${PROJECT_DESC_MAX_WORDS} kata)...`}
              />
            </div>

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

            {/* Preview source: live URL or uploaded build */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Preview Source (Optional)
              </label>
              <input
                type="text"
                value={buildFile || buildFolder ? '' : projectForm.link}
                disabled={!!(buildFile || buildFolder)}
                onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-sm disabled:opacity-40"
                placeholder={buildFile || buildFolder ? 'Akan memakai build yang di-upload' : 'https://example.com'}
              />
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                <span className="h-px flex-1 bg-white/10" /> atau upload hasil build <span className="h-px flex-1 bg-white/10" />
              </div>
              <label className="flex items-center gap-4 p-4 border-2 border-dashed border-white/20 hover:border-sky-400/80 rounded-2xl bg-black/50 cursor-pointer transition-all group">
                <FileArchive className="w-7 h-7 shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">
                    {buildFolder ? `${buildFolder[0]?.webkitRelativePath.split('/')[0] || 'Folder'} (${buildFolder.length} file)` : buildFile ? buildFile.name : isHostedBuild ? 'Build ter-upload — klik untuk ganti' : 'Pilih file .zip hasil build'}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    Zip isi folder dist/ / build/ / out/ atau pilih folder-nya (harus ada index.html, maks 100MB)
                  </span>
                </span>
                {(buildFile || buildFolder) && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setBuildFile(null); setBuildFolder(null); }}
                    className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
                    aria-label="Batalkan file build"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={(e) => { setBuildFolder(null); setBuildFile(e.target.files?.[0] ?? null); }}
                  className="hidden"
                />
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/15 hover:border-sky-400/80 rounded-xl bg-black/50 cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all">
                <FileArchive className="w-4 h-4 text-sky-400" />
                Atau upload folder (dist/ / build/ — beserta gambar &amp; aset)
                <input
                  type="file"
                  // @ts-expect-error non-standard folder picker attribute
                  webkitdirectory=""
                  multiple
                  onChange={(e) => {
                    const list = Array.from(e.target.files ?? []);
                    setBuildFile(null);
                    setBuildFolder(list.length ? list : null);
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Tip: build dengan base path relatif agar aset terbaca — Vite: <code className="text-slate-300">base: &apos;./&apos;</code>, CRA: <code className="text-slate-300">&quot;homepage&quot;: &quot;.&quot;</code>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 accent-white"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.show_preview}
                    onChange={(e) => setProjectForm({ ...projectForm, show_preview: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 accent-white"
                  />
                  <span>Tampilkan Tombol Preview</span>
                </label>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
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
