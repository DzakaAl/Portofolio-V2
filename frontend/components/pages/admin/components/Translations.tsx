'use client';
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { syncTranslationSources, updateTranslation, deleteTranslation } from '@/lib/api';
import type { Translation } from '@/lib/types';

interface AdminTranslationsProps {
  onShowMessage: (type: 'success' | 'error', text: string) => void;
  onPendingCountChange?: (count: number) => void;
}

export default function Translations({ onShowMessage, onPendingCountChange }: AdminTranslationsProps) {
  const [items, setItems] = useState<Translation[]>([]);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [syncing, setSyncing] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const pending = items.filter((item) => !item.translated_text?.trim());
  const translated = items.filter((item) => item.translated_text?.trim());

  useEffect(() => {
    let active = true;
    const load = async () => {
      setSyncing(true);
      try {
        const res = await syncTranslationSources();
        if (active && res.data) setItems(res.data);
      } catch (err) {
        if (active) onShowMessage('error', (err as Error).message || 'Gagal memuat data terjemahan');
      } finally {
        if (active) setSyncing(false);
      }
    };
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onPendingCountChange?.(pending.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncTranslationSources();
      setItems(res.data || []);
      onShowMessage('success', 'Konten berhasil disinkronkan!');
    } catch (err) {
      onShowMessage('error', (err as Error).message || 'Gagal sinkronisasi konten');
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (item: Translation) => {
    const value = (edits[item.id] ?? item.translated_text ?? '').trim();
    setSavingId(item.id);
    try {
      await updateTranslation(item.id, value === '' ? null : value);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, translated_text: value === '' ? null : value } : i))
      );
      setEdits((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      onShowMessage('success', 'Terjemahan berhasil disimpan!');
    } catch (err) {
      onShowMessage('error', (err as Error).message || 'Gagal menyimpan terjemahan');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (item: Translation) => {
    setDeletingId(item.id);
    try {
      await deleteTranslation(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      onShowMessage('success', 'Terjemahan dihapus.');
    } catch (err) {
      onShowMessage('error', (err as Error).message || 'Gagal menghapus terjemahan');
    } finally {
      setDeletingId(null);
    }
  };

  const renderRow = (item: Translation, isPending: boolean) => (
    <div
      key={item.id}
      className={`rounded-xl border p-4 sm:p-5 space-y-3 ${
        isPending ? 'border-white/10 bg-black/60' : 'border-white/5 bg-black/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line flex-1">
          {item.source_text}
        </p>
        {isPending ? (
          <span className="shrink-0 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Belum
          </span>
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={edits[item.id] ?? item.translated_text ?? ''}
          onChange={(e) => setEdits({ ...edits, [item.id]: e.target.value })}
          placeholder="Terjemahan Indonesia..."
          className="flex-1 bg-black/80 border border-white/15 focus:border-white text-white px-4 py-3 rounded-xl outline-none text-xs sm:text-sm font-tech transition-all"
        />
        <div className="flex gap-2 shrink-0">
          <Button
            onClick={() => handleSave(item)}
            disabled={savingId === item.id}
            variant="primary"
            size="sm"
            icon={Save}
            iconPosition="left"
          >
            {savingId === item.id ? 'SAVING...' : 'SIMPAN'}
          </Button>
          <Button
            onClick={() => handleDelete(item)}
            disabled={deletingId === item.id}
            variant="danger"
            size="sm"
            icon={Trash2}
            iconPosition="left"
            title="Hapus dari daftar terjemahan"
          >
            HAPUS
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-4 sm:p-6 lg:p-10 rounded-2xl space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-tech text-white uppercase tracking-tight">
            Translations
          </h2>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          iconPosition="left"
        >
          {syncing ? 'SYNCING...' : 'SINKRONKAN KONTEN'}
        </Button>
      </div>

      {/* Pending translations */}
      <div className="space-y-4">
        <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
          Belum Diterjemahkan ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="text-xs text-slate-500 font-tech">
            Semua konten sudah diterjemahkan. Gunakan &quot;Sinkronkan Konten&quot; setelah menambah/mengubah
            data About atau Projects.
          </p>
        ) : (
          pending.map((item) => renderRow(item, true))
        )}
      </div>

      {/* Translated entries */}
      {translated.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
            Sudah Diterjemahkan ({translated.length})
          </h3>
          {translated.map((item) => renderRow(item, false))}
        </div>
      )}
    </div>
  );
}
