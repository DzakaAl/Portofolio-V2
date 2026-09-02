/** Maximum words allowed for project descriptions (input & backend validation). */
export const PROJECT_DESC_MAX_WORDS = 70;

/** Count words in a text. */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Enforce a maximum number of words on user input (admin form).
 * Extra words beyond the cap are dropped — no ellipsis is added,
 * the input simply stops accepting words past the limit.
 */
export function clampWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ');
}
