/* Ask the book. */
import { api } from "@/lib/api";
import type { Lang } from "@/lib/i18n";

export type AskTurn = { role: "user" | "assistant"; text: string };
export type AskBody = { question: string; lang: Lang; history: AskTurn[]; section?: string; law?: number };

export function askBook(body: AskBody) {
  return api<{ answer: string; mode: "owner" | "member"; left: number }>("/api/ask", { method: "POST", body });
}
