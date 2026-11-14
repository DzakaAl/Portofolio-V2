import type { NextConfig } from 'next';
import { fileURLToPath } from 'url';

const nextConfig: NextConfig = {
  // Full Next.js app (Node server) — serves its own API routes under /app/api.
  // (Previously `output: 'export'` for static shared hosting; removed so the
  // backend and image uploads can run in-process.)
  images: {
    // Images come from mixed external origins + local /storage; skip the
    // optimizer to avoid per-origin remotePatterns config.
    unoptimized: true,
  },
  turbopack: {
    // Monorepo: frontend/ is its own root (separate lockfile from the old backend).
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
};

export default nextConfig;
