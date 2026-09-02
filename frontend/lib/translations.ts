// ── Flat translation dictionary: EN (source of truth) & ID ──

export type Lang = 'en' | 'id';

const en: Record<string, string> = {
  // Navbar
  'nav.about': 'ABOUT ME',
  'nav.work': 'FEATURED WORK',
  'nav.process': 'HOW I WORK',
  'nav.contact': 'CONTACT',

  // Hero
  'hero.line1': 'TURNING IDEAS',
  'hero.line2': 'INTO CODE',
  'hero.sendEmail': 'Send Email',
  'hero.downloadCV': 'Download CV',

  // About
  'about.title': 'ABOUT ME',

  // Featured
  'featured.title': 'FEATURED WORK',
  'featured.preview': 'Preview Project',
  'featured.more': 'More Projects',

  // How I Work
  'work.title': 'HOW I WORK',
  'work.phase': 'PHASE',
  'work.p1.title': 'DISCOVER & STRATEGY',
  'work.p1.subtitle': 'Requirement Mapping',
  'work.p1.desc':
    'Defining scope, goals, and constraints upfront so the project starts with a clear direction and measurable outcomes.',
  'work.p2.title': 'DESIGN & PROTOTYPE',
  'work.p2.subtitle': 'UI/UX & Interactive Mockups',
  'work.p2.desc':
    'Translating requirements into wireframes, a cohesive design system, and a clickable prototype before writing code.',
  'work.p3.title': 'BUILD & INTEGRATE',
  'work.p3.subtitle': 'Engineering & Integration',
  'work.p3.desc':
    'Shipping in iterative sprints with code reviews, API integrations, and custom features refined at every step.',
  'work.p4.title': 'LAUNCH & GROW',
  'work.p4.subtitle': 'Deployment & Support',
  'work.p4.desc':
    'Final QA, performance tuning, and a smooth handoff — then monitoring and iterating after launch.',

  // Let's Talk modal
  'letsTalk.liveChat': 'LIVE CHAT',
  'letsTalk.connect': "LET'S CONNECT",
  'letsTalk.yourName': 'Your Name',
  'letsTalk.namePlaceholder': 'Your name...',
  'letsTalk.inquiryType': 'Inquiry Type',
  'letsTalk.subject': 'Subject',
  'letsTalk.subjectPlaceholder': 'Project Discussion / Collaboration Offer...',
  'letsTalk.message': 'Message',
  'letsTalk.messagePlaceholder': 'Write your message or project details here...',
  'letsTalk.send': 'SEND VIA WHATSAPP',
  'letsTalk.cat.project': '💼 Project / Freelance',
  'letsTalk.cat.job': '🧑‍💼 Job Opportunity',
  'letsTalk.cat.collaboration': '🤝 Collaboration',
  'letsTalk.cat.other': '💬 General / Other',

  // WhatsApp template
  'wa.greeting': 'Hi Dzaka! 👋',
  'wa.intro.project':
    'I have a project in mind and would love to discuss how we can work together.',
  'wa.intro.job':
    "I'm reaching out regarding a job opportunity that could be a great fit for both of us.",
  'wa.intro.collaboration': "I'd love to explore a potential collaboration with you.",
  'wa.intro.other': "I'd like to get in touch and connect with you.",
  'wa.subject': 'Subject',
  'wa.from': 'From',
  'wa.type': 'Type',
  'wa.footer': "Sent via the \"Let's Connect\" form on your portfolio website",

  // Project (The Lab)
  'project.labLabel': 'Project · The Lab',
  'project.preview': 'Preview',

  // Footer
  'footer.ideaTitle': 'HAVE AN IDEA IN MIND?',
  'footer.ideaSubtitle':
    'Available for freelance projects, full-time contracts, and innovative technical collaborations.',
  'footer.getInTouch': 'GET IN TOUCH',
  'footer.contact': 'CONTACT',
  'footer.backToTop': 'BACK TO TOP',
  'footer.copyright': '© 2026 DZAKAAL STUDIO. ALL RIGHTS RESERVED.',

  // Preloader
  'preloader.init': 'INITIALIZING ASSETS...',
  'preloader.connecting': 'CONNECTING TO SERVER & API...',
  'preloader.images': 'LOADING UI IMAGES & GRAPHICS...',
  'preloader.audio': 'LOADING AUDIO & SPIDERMAN MEDIA...',
  'preloader.syncing': 'SYNCHRONIZING INTERFACE & FONTS...',
  'preloader.pressEnter': 'PRESS ENTER OR CLICK TO CONTINUE',
  'preloader.clickAnywhere': 'CLICK ANYWHERE OR PRESS ENTER',
  'preloader.loadingAssets': 'LOADING PAGE ASSETS',

  // Live Chat (Contact page)
  'liveChat.placeholder': 'Type a public message...',
  'liveChat.signInPrompt': 'Sign in with your Google account to start sending public messages.',
  'liveChat.signInButton': 'SIGN IN WITH GOOGLE',
  'liveChat.logout': 'Logout',
};

const id: Record<string, string> = {
  // Navbar
  'nav.about': 'TENTANG SAYA',
  'nav.work': 'PROYEK UNGGULAN',
  'nav.process': 'CARA KERJA',
  'nav.contact': 'KONTAK',

  // Hero
  'hero.line1': 'MENGUBAH IDE',
  'hero.line2': 'MENJADI KODE',
  'hero.sendEmail': 'Kirim Email',
  'hero.downloadCV': 'Unduh CV',

  // About
  'about.title': 'TENTANG SAYA',

  // Featured
  'featured.title': 'PROYEK UNGGULAN',
  'featured.preview': 'Pratinjau Proyek',
  'featured.more': 'Proyek Lainnya',

  // How I Work
  'work.title': 'CARA KERJA SAYA',
  'work.phase': 'FASE',
  'work.p1.title': 'EKSPLORASI & STRATEGI',
  'work.p1.subtitle': 'Pemetaan Kebutuhan',
  'work.p1.desc':
    'Menentukan ruang lingkup, tujuan, dan batasan sejak awal agar proyek berjalan dengan arah yang jelas dan hasil yang terukur.',
  'work.p2.title': 'PERANCANGAN & PROTOTIPE',
  'work.p2.subtitle': 'UI/UX & Mockup Interaktif',
  'work.p2.desc':
    'Menerjemahkan kebutuhan menjadi wireframe, sistem desain yang konsisten, dan prototipe interaktif sebelum menulis kode.',
  'work.p3.title': 'PENGEMBANGAN & INTEGRASI',
  'work.p3.subtitle': 'Rekayasa & Integrasi',
  'work.p3.desc':
    'Pengembangan bertahap dalam sprint iteratif dengan peninjauan kode, integrasi API, dan fitur khusus yang disempurnakan di setiap langkah.',
  'work.p4.title': 'PELUNCURAN & PERTUMBUHAN',
  'work.p4.subtitle': 'Deployment & Dukungan',
  'work.p4.desc':
    'QA akhir, optimalisasi performa, dan serah terima yang mulus — lalu pemantauan serta iterasi setelah peluncuran.',

  // Let's Talk modal
  'letsTalk.liveChat': 'CHAT LANGSUNG',
  'letsTalk.connect': 'MARI TERHUBUNG',
  'letsTalk.yourName': 'Nama Anda',
  'letsTalk.namePlaceholder': 'Nama Anda...',
  'letsTalk.inquiryType': 'Jenis Permintaan',
  'letsTalk.subject': 'Subjek',
  'letsTalk.subjectPlaceholder': 'Diskusi Proyek / Tawaran Kolaborasi...',
  'letsTalk.message': 'Pesan',
  'letsTalk.messagePlaceholder': 'Tuliskan pesan atau detail proyek Anda di sini...',
  'letsTalk.send': 'KIRIM MELALUI WHATSAPP',
  'letsTalk.cat.project': '💼 Proyek / Freelance',
  'letsTalk.cat.job': '🧑‍💼 Peluang Karier',
  'letsTalk.cat.collaboration': '🤝 Kolaborasi',
  'letsTalk.cat.other': '💬 Umum / Lainnya',

  // WhatsApp template
  'wa.greeting': 'Halo, Dzaka! 👋',
  'wa.intro.project':
    'Saya memiliki sebuah proyek dan ingin mendiskusikan bagaimana kita dapat bekerja sama.',
  'wa.intro.job':
    'Saya menghubungi Anda terkait peluang karier yang kiranya cocok untuk kita berdua.',
  'wa.intro.collaboration': 'Saya ingin menjajaki peluang kolaborasi dengan Anda.',
  'wa.intro.other': 'Saya ingin terhubung dan berkenalan dengan Anda.',
  'wa.subject': 'Subjek',
  'wa.from': 'Dari',
  'wa.type': 'Jenis',
  'wa.footer': 'Dikirim melalui formulir "Let\'s Connect" di situs portofolio Anda',

  // Project (The Lab)
  'project.labLabel': 'Proyek · The Lab',
  'project.preview': 'Pratinjau',

  // Footer
  'footer.ideaTitle': 'GAGASAN DALAM PIKIRAN?',
  'footer.ideaSubtitle':
    'Terbuka untuk proyek lepas, kontrak penuh waktu, dan kolaborasi teknis yang inovatif.',
  'footer.getInTouch': 'MARI TERHUBUNG',
  'footer.contact': 'KONTAK',
  'footer.backToTop': 'KEMBALI KE ATAS',
  'footer.copyright': '© 2026 DZAKAAL STUDIO. HAK CIPTA DILINDUNGI.',

  // Preloader
  'preloader.init': 'MENYIAPKAN ASET...',
  'preloader.connecting': 'MENGHUBUNGKAN SERVER & API...',
  'preloader.images': 'MEMUAT GAMBAR & GRAFIS UI...',
  'preloader.audio': 'MEMUAT AUDIO & MEDIA SPIDERMAN...',
  'preloader.syncing': 'MENYINKRONKAN ANTARMUKA & FONT...',
  'preloader.pressEnter': 'TEKAN ENTER ATAU KLIK UNTUK LANJUT',
  'preloader.clickAnywhere': 'KLIK DI MANA SAJA ATAU TEKAN ENTER',
  'preloader.loadingAssets': 'MEMUAT ASET HALAMAN',

  // Live Chat (Halaman Kontak)
  'liveChat.placeholder': 'Tulis pesan publik...',
  'liveChat.signInPrompt': 'Masuk dengan akun Google Anda untuk mulai mengirim pesan publik.',
  'liveChat.signInButton': 'MASUK DENGAN GOOGLE',
  'liveChat.logout': 'Keluar',
};

export const translations: Record<Lang, Record<string, string>> = { en, id };

/**
 * Client-side overrides for API/database content (render-time only).
 *
 * Currently empty — translations are managed by the admin via the
 * `translations` database table (see /admin → Translations) and served
 * through GET /api/translations.
 *
 * Use this map only for curated manual overrides, e.g.:
 *   'SOME DB TEXT': { en: 'Some DB text', id: 'Teks basis data' },
 */
export const apiTranslations: Record<string, { en: string; id: string }> = {};

