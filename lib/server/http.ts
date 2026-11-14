import { NextResponse } from 'next/server';

/** Success envelope matching the original Laravel API: { status, message?, data } */
export function ok<T>(data: T, message?: string, init?: ResponseInit) {
  return NextResponse.json(
    message === undefined
      ? { status: 'success', data }
      : { status: 'success', message, data },
    init,
  );
}

/** Error envelope. `message` is what the frontend surfaces (lib/api.ts throws it). */
export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ status: 'error', message, ...extra }, { status });
}

/** 422 validation error, Laravel-style ({ message, errors }). */
export function validationError(errors: Record<string, string[]>) {
  const first = Object.values(errors)[0]?.[0] ?? 'The given data was invalid.';
  return NextResponse.json({ status: 'error', message: first, errors }, { status: 422 });
}

/** Count whitespace-separated words (matches old ProjectController::countWords). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/u).length;
}

/** Parse a possibly-stringified JSON array or comma list into string[]. */
export function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map((t) => String(t));
  if (typeof tags === 'string') {
    const s = tags.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((t) => String(t));
    } catch {
      /* fall through to comma split */
    }
    return s.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

/** Interpret Laravel-style truthy values from JSON or form fields. */
export function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value == null) return false;
  const s = String(value).toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'on' || s === 'yes';
}
