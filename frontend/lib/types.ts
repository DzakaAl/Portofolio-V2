export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string | null;
  featured: boolean;
  show_preview?: boolean;
  order?: number;
}

export interface TechStack {
  id: number;
  title: string;
  alt: string;
  src: string;
  order?: number;
}

export interface ChatMessage {
  id: number;
  user: string;
  email: string;
  avatar?: string | null;
  text: string;
  time: string;
}

export interface AboutData {
  title?: string;
  description: string;
  image_url?: string | null;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T> {
  status: ApiStatus;
  message?: string;
  data: T;
}
