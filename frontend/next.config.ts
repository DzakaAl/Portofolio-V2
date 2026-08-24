import type { NextConfig } from 'next';
import { fileURLToPath } from 'url';

const nextConfig: NextConfig = {
  // Static export untuk shared hosting: hasil build berupa folder out/ berisi HTML/JS/CSS murni
  output: 'export',
  // /admin -> /admin/index.html agar Apache shared hosting me-resolve dengan benar
  trailingSlash: true,
  images: {
    // Image optimization Next.js butuh server — matikan untuk static export
    unoptimized: true,
  },
  turbopack: {
    // Monorepo: frontend/ adalah root tersendiri (package-lock terpisah dari Laravel)
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
};

export default nextConfig;
