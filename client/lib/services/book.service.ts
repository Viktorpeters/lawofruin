/* The book this reader may read, in their language. */
import { api } from "@/lib/api";
import type { BookPayload } from "@/lib/book/content";
import type { Lang } from "@/lib/i18n";

export function getBook(lang: Lang) {
  return api<BookPayload>(`/api/book?lang=${lang}`);
}
