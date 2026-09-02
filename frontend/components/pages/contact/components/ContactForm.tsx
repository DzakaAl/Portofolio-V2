'use client';
import React from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionHeading from './SectionHeading';
import { useLanguage } from '@/lib/i18n';

const WHATSAPP_NUMBER = '6285181681725';

// ── WhatsApp inquiry categories: label rendered via i18n, intro line per type ──
const INQUIRY_CATEGORIES = [
  { value: 'project', labelKey: 'letsTalk.cat.project' },
  { value: 'job', labelKey: 'letsTalk.cat.job' },
  { value: 'collaboration', labelKey: 'letsTalk.cat.collaboration' },
  { value: 'other', labelKey: 'letsTalk.cat.other' },
] as const;

type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number]['value'];

export default function ContactForm() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col min-w-0 h-full">
      {/* Section Heading */}
      <SectionHeading title={t('nav.contact')} />

      {/* Direct WhatsApp Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const categoryVal = e.target.category.value as InquiryCategory;
          const nameVal = e.target.senderName.value.trim();
          const subjectVal = e.target.subject.value.trim();
          const messageVal = e.target.message.value.trim();

          // Buka WhatsApp chat dengan template pesan profesional (mengikuti bahasa aktif)
          const categoryMeta = INQUIRY_CATEGORIES.find((c) => c.value === categoryVal)!;
          const waMessage = [
            t('wa.greeting'),
            '',
            t(`wa.intro.${categoryVal}`),
            '',
            '────────────────────',
            `📌 *${t('wa.subject')}:* ${subjectVal}`,
            `👤 *${t('wa.from')}:* ${nameVal}`,
            `🏷️ *${t('wa.type')}:* ${t(categoryMeta.labelKey)}`,
            '────────────────────',
            '',
            messageVal,
            '',
            `✉️ _${t('wa.footer')}_`,
          ].join('\n');
          const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
          window.open(waUrl, '_blank');
        }}
        className="space-y-3 flex-1 flex flex-col"
      >
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5">
            {t('letsTalk.yourName')}
          </label>
          <input
            type="text"
            name="senderName"
            required
            placeholder={t('letsTalk.namePlaceholder')}
            className="w-full bg-white/[0.03] border border-white/10 focus:border-white/60 focus:bg-white/[0.06] text-white px-4 py-3 rounded-xl text-xs outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5">
            {t('letsTalk.inquiryType')}
          </label>
          <select
            name="category"
            required
            defaultValue="project"
            className="w-full bg-white/[0.03] border border-white/10 focus:border-white/60 focus:bg-white/[0.06] text-white px-4 py-3 rounded-xl text-xs outline-none transition-all cursor-pointer appearance-none [&>option]:bg-zinc-900"
          >
            {INQUIRY_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {t(cat.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5">
            {t('letsTalk.subject')}
          </label>
          <input
            type="text"
            name="subject"
            required
            placeholder={t('letsTalk.subjectPlaceholder')}
            className="w-full bg-white/[0.03] border border-white/10 focus:border-white/60 focus:bg-white/[0.06] text-white px-4 py-3 rounded-xl text-xs outline-none transition-all"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5">
            {t('letsTalk.message')}
          </label>
          <textarea
            name="message"
            rows={4}
            required
            placeholder={t('letsTalk.messagePlaceholder')}
            className="w-full h-36 bg-white/[0.03] border border-white/10 focus:border-white/60 focus:bg-white/[0.06] text-white px-4 py-3 rounded-xl text-xs outline-none transition-all resize-none"
          />
        </div>

        <div className="pt-1 mt-auto">
          <Button type="submit" variant="primary" size="sm" icon={Send} className="w-full justify-center">
            {t('letsTalk.send')}
          </Button>
        </div>
      </form>
    </section>
  );
}
