/**
 * CV generator: data shape, default content (from the original PDF CV) and
 * an HTML renderer that reproduces the PDF's ATS-friendly layout. The admin
 * previews the HTML in an iframe and prints it to PDF from there.
 */

export type CvLink = { label: string; url: string };
export type CvEducation = { school: string; place: string; degree: string; period: string };
export type CvExperience = { org: string; place: string; role: string; period: string; bullets: string[] };
export type CvProject = { title: string; period: string; type: string; bullets: string[]; linkLabel: string; linkUrl: string };
export type CvExtra = { label: string; text: string };

export type CvData = {
  name: string;
  contacts: CvLink[];
  location: string;
  summary: string;
  headings: { education: string; experience: string; projects: string; extra: string };
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
  extra: CvExtra[];
};

export const DEFAULT_CV: CvData = {
  name: 'M. DZAKA AL FIKRI',
  contacts: [
    { label: '+6285385137095', url: '' },
    { label: 'dzakaal10@gmail.com', url: 'mailto:dzakaal10@gmail.com' },
    { label: 'linkedin.com/in/dzakaal10', url: 'https://linkedin.com/in/dzakaal10' },
    { label: 'dzakaal.id', url: 'https://dzakaal.id' },
  ],
  location: 'Batang, Jawa Tengah, Indonesia',
  summary:
    'Fresh Graduate Informatika dengan pengalaman mengembangkan beberapa WebApp melalui magang, proyek klien, dan proyek pribadi menggunakan Laravel, React.js, Vue.js, Node.js, dan MySQL. Berpengalaman membangun RESTful API, merancang database relasional, serta mengembangkan antarmuka pengguna yang responsif. Memiliki pengalaman berkolaborasi dengan stakeholder dalam menerjemahkan kebutuhan bisnis menjadi solusi teknis yang dapat diimplementasikan.',
  headings: { education: 'PENDIDIKAN', experience: 'PENGALAMAN', projects: 'PROYEK', extra: 'INFORMASI TAMBAHAN' },
  education: [
    { school: 'Universitas Ahmad Dahlan', place: 'Yogyakarta', degree: 'S1, Informatika | IPK : 3.77/4.00', period: 'September 2022 - Maret 2026' },
    { school: 'MAN 1 Kota Pekalongan', place: 'Pekalongan', degree: 'SMA, MIPA', period: 'Juli 2019 - Juni 2022' },
  ],
  experience: [
    {
      org: 'PT. Kereta Api Indonesia (Persero) Daerah Operasi 6',
      place: 'Yogyakarta',
      role: 'Web Developer, Magang',
      period: 'Desember 2025 - Februari 2026',
      bullets: [
        'Melakukan kolaborasi dengan staf operasional untuk menganalisis kebutuhan bisnis dan merancang solusi sistem yang sesuai.',
        'Mengembangkan serta memelihara aplikasi web internal menggunakan Laravel, React.js, dan MySQL.',
        'Mengelola struktur database, melakukan validasi data, debugging, serta pengujian aplikasi sebelum implementasi.',
        'Berpartisipasi dalam pengembangan fitur baru dan peningkatan sistem untuk mendukung efisiensi operasional.',
        'Melakukan kunjungan ke berbagai stasiun di wilayah Daop 6 untuk membantu troubleshooting perangkat komputer dan jaringan serta memastikan kesesuaian data perangkat dengan kondisi di lapangan.',
      ],
    },
    {
      org: 'Bangkit Academy led By Google, GoTo, Tokopedia, Traveloka',
      place: 'Yogyakarta',
      role: 'Machine Learning, Studi Independen',
      period: 'September 2024 - Januari 2025',
      bullets: [
        'Menyelesaikan seluruh learning path Machine Learning, mulai dari Python Programming, Data Analysis, Machine Learning, TensorFlow, hingga Deep Learning.',
        'Mengimplementasikan machine learning menggunakan Python, TensorFlow, NumPy, Pandas, Scikit-learn, dan Google Cloud.',
        'Memimpin tim Capstone yang terdiri dari 7 anggota (3 Machine Learning, 2 Cloud Computing, dan 2 Mobile Development) menggunakan metode Agile.',
        'Mengoordinasikan pembagian tugas, komunikasi lintas divisi, serta memastikan penyelesaian proyek sesuai target.',
        'Melakukan kolaborasi dalam pengembangan solusi AI end-to-end mulai dari pengolahan data, pelatihan model, hingga integrasi ke aplikasi.',
      ],
    },
  ],
  projects: [
    {
      title: 'Sistem Reservasi Lapangan Badminton | SMASHLY',
      period: 'Mei 2026 - Juli 2026',
      type: 'Proyek Pribadi',
      bullets: [
        'Mengembangkan aplikasi web reservasi lapangan badminton dengan pengecekan jadwal real-time dan reservasi instan.',
        'Menerapkan integrasi sistem pembayaran yang aman guna memastikan kelancaran alur transaksi pengguna.',
        'Membangun fitur ulasan pengguna untuk memberikan transparansi informasi dan meningkatkan kualitas layanan.',
        'Merancang antarmuka administratif untuk mempermudah pengelola dalam memantau status pemesanan secara efisien.',
        'Menyusun arsitektur basis data relasional guna mengelola data jadwal, reservasi, dan transaksi secara terstruktur.',
      ],
      linkLabel: 'Sistem Reservasi Lapangan badminton',
      linkUrl: '',
    },
    {
      title: 'Sistem Manajemen Aset TI',
      period: 'Desember 2025 - Februari 2026',
      type: 'Proyek Magang',
      bullets: [
        'Mengembangkan aplikasi web untuk mengelola perangkat TI di 55 stasiun wilayah Daop 6 Yogyakarta.',
        'Membangun dashboard monitoring dengan peta interaktif yang menampilkan lokasi, jumlah, jenis, spesifikasi, alamat IP, dan status perangkat secara real-time.',
        'Mengembangkan fitur impor dan ekspor Excel untuk mempermudah pengelolaan data perangkat dalam jumlah besar.',
        'Merancang RESTful API dan database MySQL guna mendukung pengelolaan data yang terpusat.',
        'Membantu menggantikan proses pendataan manual sehingga meningkatkan efisiensi pemeliharaan, pelaporan, dan pengambilan keputusan.',
      ],
      linkLabel: 'Sistem Manajemen Aset TI',
      linkUrl: '',
    },
    {
      title: 'Sistem Manajemen Keperawatan',
      period: 'Desember 2025 - Januari 2026',
      type: 'Proyek Klien',
      bullets: [
        'Mengembangkan sistem manajemen keperawatan berbasis web untuk mendigitalkan pendaftaran profesional dan administrasi kredensial.',
        'Menerapkan otentikasi berbasis peran dan alur kerja persetujuan bertahap untuk verifikasi dokumen dan validasi kredensial.',
        'Membuat fitur pengiriman dokumen, pelacakan status, dan pemberitahuan untuk meningkatkan efisiensi administratif.',
        'Merancang API RESTful dan mengoptimalkan struktur basis data relasional untuk catatan kredensial dan riwayat dokumen.',
        'Bekerja sama secara langsung dengan klien untuk mengumpulkan persyaratan dan menerapkan peningkatan sistem yang diminta.',
      ],
      linkLabel: 'Sistem Manajemen Keperawatan',
      linkUrl: '',
    },
    {
      title: 'Web Profile Padukuhan',
      period: 'Agustus 2025',
      type: 'Proyek Pribadi',
      bullets: [
        'Mengembangkan situs web profil desa resmi untuk menyediakan informasi publik dan sumber daya layanan masyarakat.',
        'Membuat komponen Vue.js yang dapat digunakan kembali untuk menciptakan antarmuka yang responsif dan ramah pengguna.',
        'Mengatur manajemen konten untuk meningkatkan aksesibilitas dan penyampaian informasi.',
        'Mengoptimalkan responsivitas situs web untuk berbagai ukuran layar dan peramban.',
      ],
      linkLabel: 'Web Profile Padukuhan',
      linkUrl: '',
    },
  ],
  extra: [
    { label: 'SoftSkill', text: 'Analytical Thinking, Problem Solving, Kerja Sama Tim, Komunikasi, Manajemen Waktu, Kemampuan Beradaptasi, Attention to Detail.' },
    { label: 'HardSkill', text: 'JavaScript, TypeScript, PHP, Laravel, React, MySQL, Tailwind CSS, REST API, Git & GitHub, Canva, Google Workspace(Docs, Slides, Sheet), Microsoft Office(Word, Excel, PowerPoint).' },
    { label: 'Certifications', text: 'Machine Learning Specialization - Coursera (2024), DeepLearning.AI TensorFlow Developer Specialization - Coursera (2024), Generative AI for Everyone – Coursera (2024), Belajar Analisis Data dengan Python – Dicoding (2024).' },
  ],
};

/** Fill missing keys (older saved CVs / partial data) from the defaults. */
export function normalizeCv(data: Partial<CvData> | null | undefined): CvData {
  if (!data) return structuredClone(DEFAULT_CV);
  return {
    ...structuredClone(DEFAULT_CV),
    ...data,
    headings: { ...DEFAULT_CV.headings, ...(data.headings || {}) },
  };
}

const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const link = (label: string, url: string) =>
  url ? `<a href="${esc(url)}">${esc(label)}</a>` : esc(label);

const bullets = (items: string[]) => {
  const list = items.map((b) => b.trim()).filter(Boolean);
  return list.length ? `<ul>${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '';
};

/** Full standalone HTML document (A4) for preview + print-to-PDF. */
export function renderCvHtml(cv: CvData): string {
  const contacts = cv.contacts.filter((c) => c.label.trim()).map((c) => link(c.label, c.url)).join(' | ');

  const section = (title: string, body: string) =>
    body ? `<section><h2>${esc(title)}</h2>${body}</section>` : '';

  const education = cv.education
    .map(
      (e) => `<div class="item">
        <div class="row"><strong>${esc(e.school)}</strong><strong>${esc(e.place)}</strong></div>
        <div class="row sub"><em>${esc(e.degree)}</em><em>${esc(e.period)}</em></div>
      </div>`
    )
    .join('');

  const experience = cv.experience
    .map(
      (e) => `<div class="item">
        <div class="row"><strong>${esc(e.org)}</strong><strong>${esc(e.place)}</strong></div>
        <div class="row sub"><em>${esc(e.role)}</em><em>${esc(e.period)}</em></div>
        ${bullets(e.bullets)}
      </div>`
    )
    .join('');

  const projects = cv.projects
    .map(
      (p) => `<div class="item">
        <div class="row"><strong>${esc(p.title)}</strong><em>${esc(p.period)}</em></div>
        ${p.type ? `<div class="sub"><em>${esc(p.type)}</em></div>` : ''}
        ${bullets(p.bullets)}
        ${p.linkLabel || p.linkUrl ? `<div class="plink"><strong>Link Project:</strong> ${link(p.linkLabel || p.linkUrl, p.linkUrl)}</div>` : ''}
      </div>`
    )
    .join('');

  const extra = cv.extra.filter((x) => x.text.trim()).length
    ? `<ul>${cv.extra
        .filter((x) => x.text.trim())
        .map((x) => `<li>${x.label ? `<strong>${esc(x.label)}:</strong> ` : ''}${esc(x.text)}</li>`)
        .join('')}</ul>`
    : '';

  return `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><title>CV ${esc(cv.name)}</title>
<style>
  @page { size: A4; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  html { background: #e5e7eb; }
  body { margin: 0; font-family: Calibri, Carlito, 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; line-height: 1.38; color: #111; }
  .page { background: #fff; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm 15mm; }
  h1 { margin: 0; text-align: center; font-size: 24pt; font-weight: 700; letter-spacing: .5px; }
  .contact, .loc { text-align: center; font-size: 10pt; margin-top: 4px; }
  .loc { margin-top: 2px; }
  a { color: #0b57d0; }
  .summary { text-align: justify; margin: 10px 0 4px; }
  section { margin-top: 10px; }
  h2 { font-size: 11.5pt; font-weight: 700; margin: 0 0 6px; padding: 0 0 2px 2px; border-bottom: 1.2px solid #111; }
  .item { margin-bottom: 7px; break-inside: avoid-page; }
  .row { display: flex; justify-content: space-between; gap: 16px; }
  .row > :last-child { text-align: right; white-space: nowrap; }
  .sub { font-size: 10pt; }
  ul { margin: 3px 0 0; padding-left: 26px; }
  li { text-align: justify; margin: 1px 0; }
  .plink { font-size: 8pt; margin-top: 1px; }
  @media print {
    html { background: #fff; }
    .page { width: auto; min-height: 0; margin: 0; padding: 0; }
  }
</style></head>
<body><div class="page">
  <h1>${esc(cv.name)}</h1>
  ${contacts ? `<div class="contact">${contacts}</div>` : ''}
  ${cv.location ? `<div class="loc">${esc(cv.location)}</div>` : ''}
  ${cv.summary ? `<p class="summary">${esc(cv.summary)}</p>` : ''}
  ${section(cv.headings.education, education)}
  ${section(cv.headings.experience, experience)}
  ${section(cv.headings.projects, projects)}
  ${section(cv.headings.extra, extra)}
</div></body></html>`;
}
