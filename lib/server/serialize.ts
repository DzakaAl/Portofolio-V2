// Shape Prisma records (camelCase) into the snake_case JSON the frontend
// (lib/api.ts + lib/types.ts) expects, matching the original Laravel API.
import type {
  About,
  Certificate,
  Experience,
  Message,
  Project,
  TechStack,
  Translation,
} from '@prisma/client';

export function serializeProject(p: Project) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: Array.isArray(p.tags) ? p.tags : [],
    image: p.image,
    link: p.link,
    featured: p.featured,
    show_preview: p.showPreview,
    order: p.order,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export function serializeTechStack(t: TechStack) {
  return {
    id: t.id,
    title: t.title,
    alt: t.alt,
    src: t.src,
    order: t.order,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  };
}

export function serializeAbout(a: About | null) {
  if (!a) return null;
  return {
    id: a.id,
    description: a.description,
    image_url: a.imageUrl,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

export function serializeMessage(m: Message) {
  return {
    id: m.id,
    user: m.user,
    email: m.email,
    avatar: m.avatar,
    text: m.text,
    time: m.time,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
  };
}

export function serializeTranslation(t: Translation) {
  return {
    id: t.id,
    source_text: t.sourceText,
    source_hash: t.sourceHash,
    translated_text: t.translatedText,
    locale: t.locale,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  };
}

export function serializeExperience(e: Experience) {
  return {
    id: e.id,
    period: e.period,
    role: e.role,
    org: e.org,
    description: e.description,
    order: e.order,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  };
}

export function serializeCertificate(c: Certificate) {
  return {
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    year: c.year,
    image: c.image,
    link: c.link,
    order: c.order,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}
