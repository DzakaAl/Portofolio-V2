import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getAbout, updateAbout } from '../../../api';

export default function About({ onShowMessage }) {
  const [loading, setLoading] = useState(false);
  const [aboutForm, setAboutForm] = useState({
    title: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const data = await getAbout();
    if (data) {
      setAboutForm({
        title: data.title || 'ABOUT ME',
        description: data.description || '',
        image_url: data.image_url || '',
      });
    }
  };

  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateAbout(aboutForm);
      onShowMessage('success', 'Data About Me berhasil diperbarui!');
    } catch (err) {
      onShowMessage('error', err.message || 'Gagal memperbarui data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 lg:p-10 rounded-2xl space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold font-tech text-white tracking-tight uppercase">
          EDIT ABOUT ME CONTENT
        </h2>
      </div>

      <form onSubmit={handleUpdateAbout} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Judul Section (Default: ABOUT ME)
          </label>
          <input
            type="text"
            value={aboutForm.title}
            onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
            className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-5 py-3.5 rounded-xl outline-none text-sm font-tech transition-all"
            placeholder="ABOUT ME"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Deskripsi Lengkap / Bio
          </label>
          <textarea
            rows={8}
            value={aboutForm.description}
            onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
            className="w-full bg-black/80 border border-white/15 focus:border-white text-white px-5 py-4 rounded-xl outline-none text-sm leading-relaxed font-tech transition-all"
            placeholder="Tuliskan bio profesional Anda..."
          />
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button type="submit" disabled={loading} variant="primary" icon={Save}>
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </div>
      </form>
    </div>
  );
}
