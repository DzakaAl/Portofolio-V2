'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Save, Download, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getCv, saveCv, getCertificates, getTechStacks } from '@/lib/api';
import { DEFAULT_CV, normalizeCv, renderCvHtml, type CvData } from '@/lib/cv';

interface CvAdminProps {
  onShowMessage: (type: 'success' | 'error', text: string) => void;
}

const input =
  'w-full bg-black/80 border border-white/15 focus:border-white text-white px-3 py-2.5 rounded-xl outline-none text-sm';
const labelCls = 'block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5';

function Field({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: number }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {area ? (
        <textarea rows={area} value={value} onChange={(e) => onChange(e.target.value)} className={input} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={input} />
      )}
    </label>
  );
}

/** Generic list editor: add / remove / reorder items, each rendered by `render`. */
function ListEditor<T>({
  title, items, onChange, blank, render,
}: { title: string; items: T[]; onChange: (items: T[]) => void; blank: T; render: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode }) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <details open className="glass-card rounded-2xl p-4 sm:p-5 group">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
        {title} <span className="font-mono text-[10px] text-slate-500">{items.length}</span>
      </summary>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-end gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer" aria-label="Naik"><ChevronUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(i, 1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer" aria-label="Turun"><ChevronDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer" aria-label="Hapus"><Trash2 className="h-4 w-4" /></button>
            </div>
            {render(item, (patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it))))}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, structuredClone(blank)])}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-sky-400 hover:text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>
    </details>
  );
}

const lines = (s: string) => s.split('\n');

export default function CvAdmin({ onShowMessage }: CvAdminProps) {
  const [cv, setCv] = useState<CvData>(DEFAULT_CV);
  const [saving, setSaving] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    getCv()
      .then((data) => setCv(normalizeCv(data)))
      .catch(() => onShowMessage('error', 'Gagal memuat CV — tabel cvs mungkin belum dibuat (jalankan prisma db push).'));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, []);

  const html = useMemo(() => renderCvHtml(cv), [cv]);
  const set = (patch: Partial<CvData>) => setCv((c) => ({ ...c, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCv(cv);
      onShowMessage('success', 'CV berhasil disimpan!');
    } catch (e) {
      onShowMessage('error', (e as Error).message || 'Gagal menyimpan CV');
    } finally {
      setSaving(false);
    }
  };

  // Print the isolated iframe document → browser "Save as PDF"
  const handleDownload = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };

  // Pull certificates + tech stacks from the portfolio data into "Informasi Tambahan"
  const handleSync = async () => {
    const [certs, stacks] = await Promise.all([getCertificates(), getTechStacks()]);
    const extra = [...cv.extra];
    const upsert = (label: string, text: string) => {
      if (!text) return;
      const i = extra.findIndex((x) => x.label.toLowerCase() === label.toLowerCase());
      if (i >= 0) extra[i] = { label, text };
      else extra.push({ label, text });
    };
    upsert('Certifications', certs.map((c) => `${c.title} - ${c.issuer}${c.year ? ` (${c.year})` : ''}`).join(', ') + (certs.length ? '.' : ''));
    upsert('HardSkill', stacks.map((s) => s.title).join(', ') + (stacks.length ? '.' : ''));
    set({ extra });
    onShowMessage('success', `Disinkronkan: ${certs.length} sertifikat, ${stacks.length} tech stack.`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">CV Generator</h2>
          <p className="text-xs text-slate-400 mt-1">Edit isi CV, lihat preview A4, lalu unduh sebagai PDF.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSync} variant="glass" icon={RefreshCw} size="sm">Sinkron Portfolio</Button>
          <Button onClick={() => setCv(structuredClone(DEFAULT_CV))} variant="glass" icon={RotateCcw} size="sm">Reset</Button>
          <Button onClick={handleSave} variant="glass" icon={Save} size="sm" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
          <Button onClick={handleDownload} variant="primary" icon={Download} size="sm">Download PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ── Editor ── */}
        <div className="space-y-4 xl:max-h-[calc(100vh-14rem)] xl:overflow-y-auto xl:pr-2">
          <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
            <Field label="Nama" value={cv.name} onChange={(name) => set({ name })} />
            <Field label="Lokasi" value={cv.location} onChange={(location) => set({ location })} />
            <Field label="Ringkasan" value={cv.summary} onChange={(summary) => set({ summary })} area={5} />
          </div>

          <ListEditor
            title="Kontak"
            items={cv.contacts}
            onChange={(contacts) => set({ contacts })}
            blank={{ label: '', url: '' }}
            render={(c, s) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Teks" value={c.label} onChange={(label) => s({ label })} />
                <Field label="URL (opsional)" value={c.url} onChange={(url) => s({ url })} />
              </div>
            )}
          />

          <ListEditor
            title={cv.headings.education}
            items={cv.education}
            onChange={(education) => set({ education })}
            blank={{ school: '', place: '', degree: '', period: '' }}
            render={(e, s) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Institusi" value={e.school} onChange={(school) => s({ school })} />
                <Field label="Kota" value={e.place} onChange={(place) => s({ place })} />
                <Field label="Jenjang / Jurusan" value={e.degree} onChange={(degree) => s({ degree })} />
                <Field label="Periode" value={e.period} onChange={(period) => s({ period })} />
              </div>
            )}
          />

          <ListEditor
            title={cv.headings.experience}
            items={cv.experience}
            onChange={(experience) => set({ experience })}
            blank={{ org: '', place: '', role: '', period: '', bullets: [] }}
            render={(e, s) => (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Organisasi" value={e.org} onChange={(org) => s({ org })} />
                  <Field label="Kota" value={e.place} onChange={(place) => s({ place })} />
                  <Field label="Posisi" value={e.role} onChange={(role) => s({ role })} />
                  <Field label="Periode" value={e.period} onChange={(period) => s({ period })} />
                </div>
                <Field label="Poin (satu per baris)" value={e.bullets.join('\n')} onChange={(v) => s({ bullets: lines(v) })} area={5} />
              </>
            )}
          />

          <ListEditor
            title={cv.headings.projects}
            items={cv.projects}
            onChange={(projects) => set({ projects })}
            blank={{ title: '', period: '', type: '', bullets: [], linkLabel: '', linkUrl: '' }}
            render={(p, s) => (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Judul" value={p.title} onChange={(title) => s({ title })} />
                  <Field label="Periode" value={p.period} onChange={(period) => s({ period })} />
                  <Field label="Jenis (Pribadi / Klien / Magang)" value={p.type} onChange={(type) => s({ type })} />
                  <Field label="Teks Link" value={p.linkLabel} onChange={(linkLabel) => s({ linkLabel })} />
                </div>
                <Field label="URL Link" value={p.linkUrl} onChange={(linkUrl) => s({ linkUrl })} />
                <Field label="Poin (satu per baris)" value={p.bullets.join('\n')} onChange={(v) => s({ bullets: lines(v) })} area={5} />
              </>
            )}
          />

          <ListEditor
            title={cv.headings.extra}
            items={cv.extra}
            onChange={(extra) => set({ extra })}
            blank={{ label: '', text: '' }}
            render={(x, s) => (
              <>
                <Field label="Label" value={x.label} onChange={(label) => s({ label })} />
                <Field label="Isi" value={x.text} onChange={(text) => s({ text })} area={3} />
              </>
            )}
          />

          <details className="glass-card rounded-2xl p-4 sm:p-5">
            <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-wider text-white">Judul Bagian</summary>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.keys(cv.headings) as Array<keyof CvData['headings']>).map((k) => (
                <Field key={k} label={k} value={cv.headings[k]} onChange={(v) => set({ headings: { ...cv.headings, [k]: v } })} />
              ))}
            </div>
          </details>
        </div>

        {/* ── Live A4 preview ── */}
        <div className="glass-panel rounded-2xl p-2 sm:p-3">
          <iframe
            ref={frameRef}
            title="Preview CV"
            srcDoc={html}
            className="h-[70vh] w-full rounded-xl bg-[#e5e7eb] xl:h-[calc(100vh-15rem)]"
          />
        </div>
      </div>
    </div>
  );
}
