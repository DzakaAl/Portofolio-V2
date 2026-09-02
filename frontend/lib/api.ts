/**
 * Central API Client Service for Portfolio V2 (Next.js frontend)
 *
 * All requests target the Laravel backend (api.dzakaal.id).
 * The base URL is baked at build time from NEXT_PUBLIC_API_URL.
 */

import type {
  AboutData,
  AdminUser,
  ApiResponse,
  ChatMessage,
  Project,
  TechStack,
  Translation,
} from './types';

const API_BASE: string =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Resolve a backend-relative path (/storage/...) into an absolute URL
 * based on the API origin, so images work cross-origin.
 */
export function toAbsoluteUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  try {
    const origin = new URL(API_BASE).origin;
    return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
  } catch {
    return url;
  }
}

// Dedupe in-flight GETs so parallel callers (preloader + sections) share one request
const inflight = new Map<string, Promise<unknown>>();

function dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}

// Helper for HTTP requests
async function fetchJson<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('admin_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error((json as { message?: string }).message || 'API request failed');
  }
  return json as T;
}

// ----------------- ABOUT API -----------------
export async function getAbout(): Promise<AboutData | null> {
  return dedupe('about', async () => {
    try {
      const json = await fetchJson<ApiResponse<AboutData>>('/about');
      const data = json.data;
      if (data && data.image_url) {
        data.image_url = toAbsoluteUrl(data.image_url) ?? data.image_url;
      }
      return data;
    } catch (err) {
      console.warn('Failed to fetch About from API:', err);
      return null;
    }
  });
}

export async function updateAbout(data: Partial<AboutData>): Promise<ApiResponse<AboutData>> {
  return fetchJson('/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ----------------- TECH STACKS API -----------------
export async function getTechStacks(): Promise<TechStack[]> {
  return dedupe('tech-stacks', async () => {
    try {
      const json = await fetchJson<ApiResponse<TechStack[]>>('/tech-stacks');
      return (json.data || []).map((stack) => ({
        ...stack,
        src: toAbsoluteUrl(stack.src) ?? stack.src,
      }));
    } catch (err) {
      console.warn('Failed to fetch TechStacks from API:', err);
      return [];
    }
  });
}

export async function createTechStack(
  data: Omit<TechStack, 'id'>
): Promise<ApiResponse<TechStack>> {
  return fetchJson('/tech-stacks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTechStack(
  id: number,
  data: Partial<Omit<TechStack, 'id'>>
): Promise<ApiResponse<TechStack>> {
  return fetchJson(`/tech-stacks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function reorderTechStacks(
  orders: Array<{ id: number; order: number }>
): Promise<ApiResponse<null>> {
  return fetchJson('/tech-stacks/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  });
}

export async function deleteTechStack(id: number): Promise<ApiResponse<null>> {
  return fetchJson(`/tech-stacks/${id}`, {
    method: 'DELETE',
  });
}

// ----------------- PROJECTS API -----------------
function normalizeProject(project: Project): Project {
  return { ...project, image: toAbsoluteUrl(project.image) ?? project.image };
}

export async function getProjects(): Promise<Project[]> {
  return dedupe('projects', async () => {
    try {
      const json = await fetchJson<ApiResponse<Project[]>>('/projects');
      return (json.data || []).map(normalizeProject);
    } catch (err) {
      console.warn('Failed to fetch Projects from API:', err);
      return [];
    }
  });
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return dedupe('projects-featured', async () => {
    try {
      const json = await fetchJson<ApiResponse<Project[]>>('/projects?featured=true');
      return (json.data || []).map(normalizeProject);
    } catch (err) {
      console.warn('Failed to fetch Featured Projects from API:', err);
      return [];
    }
  });
}

export async function createProject(
  data: FormData | Partial<Project>
): Promise<ApiResponse<Project>> {
  const isFormData = data instanceof FormData;
  return fetchJson('/projects', {
    method: 'POST',
    body: isFormData ? (data as FormData) : JSON.stringify(data),
  });
}

export async function updateProject(
  id: number,
  data: FormData | Partial<Project>
): Promise<ApiResponse<Project>> {
  if (data instanceof FormData) {
    // PHP cannot parse multipart bodies on PUT — use Laravel method spoofing
    data.append('_method', 'PUT');
    return fetchJson(`/projects/${id}`, {
      method: 'POST',
      body: data,
    });
  }
  return fetchJson(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function reorderProjects(
  orders: Array<{ id: number; order: number }>
): Promise<ApiResponse<null>> {
  return fetchJson('/projects/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  });
}

export async function deleteProject(id: number): Promise<ApiResponse<null>> {
  return fetchJson(`/projects/${id}`, {
    method: 'DELETE',
  });
}

// ----------------- MESSAGES API (LIVE CHAT) -----------------
export async function getMessages(): Promise<ChatMessage[]> {
  return dedupe('messages', async () => {
    try {
      const json = await fetchJson<ApiResponse<ChatMessage[]>>('/messages');
      return (json.data || []).map((msg) => ({
        ...msg,
        avatar: toAbsoluteUrl(msg.avatar) ?? msg.avatar,
      }));
    } catch (err) {
      console.warn('Failed to fetch messages from API:', err);
      return [];
    }
  });
}

export async function sendMessage(
  data: Omit<ChatMessage, 'id'>
): Promise<ApiResponse<ChatMessage>> {
  return fetchJson('/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ----------------- AUTH API -----------------
interface LoginResponse {
  status: string;
  token: string;
  user: AdminUser;
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  return fetchJson('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin(): Promise<ApiResponse<null>> {
  return fetchJson('/logout', {
    method: 'POST',
  });
}

/**
 * Verify the stored admin token against the API (/user).
 * Returns the authenticated user, or null when the token is
 * missing/invalid/expired — used to protect the /admin page.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    // AuthController@user responds with { status, user: {...} }
    const json = await fetchJson<ApiResponse<AdminUser> & { user?: AdminUser }>('/user');
    return json.user ?? json.data ?? null;
  } catch {
    return null;
  }
}

// ----------------- TRANSLATIONS API (DB dictionary EN -> ID) -----------------

/** Public dictionary map: { "English source": "Indonesian translation" } */
export async function getTranslations(): Promise<Record<string, string>> {
  return dedupe('translations', async () => {
    try {
      const json = await fetchJson<ApiResponse<Record<string, string>>>('/translations');
      return json.data || {};
    } catch (err) {
      console.warn('Failed to fetch translations from API:', err);
      return {};
    }
  });
}

/** Admin: collect every content text (Abouts & Projects) into the translations table. */
export async function syncTranslationSources(): Promise<ApiResponse<Translation[]>> {
  return fetchJson('/translations/sources');
}

export async function createTranslation(data: {
  source_text: string;
  translated_text: string | null;
}): Promise<ApiResponse<Translation>> {
  return fetchJson('/translations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTranslation(
  id: number,
  translated_text: string | null
): Promise<ApiResponse<Translation>> {
  return fetchJson(`/translations/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ translated_text }),
  });
}

export async function deleteTranslation(id: number): Promise<ApiResponse<null>> {
  return fetchJson(`/translations/${id}`, {
    method: 'DELETE',
  });
}
