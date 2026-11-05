import type { Metadata } from "next";
import BookApp from "@/components/book/BookApp";

export const metadata: Metadata = { title: "The Laws of Ruin" };

// Where the home-screen icon opens: the book itself.
export default function AppHome() {
  return <BookApp />;
}
