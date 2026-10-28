import fs from "node:fs";
import path from "node:path";
import Hero from "@/components/hero/Hero";

/* Looks in client/public/figures for the photos that exist, so the page never asks for a
   photo you have not added yet. A cover without a photo stays one plain colour.
   Accepts .jpg, .jpeg, .png and .webp, and any capital letters in the file name.
   In development, a new photo shows on the next reload. In production, it shows after the next build. */
function photosOnDisk(): Record<string, string> {
  try {
    const dir = path.join(process.cwd(), "public", "figures");
    const found: Record<string, string> = {};
    for (const file of fs.readdirSync(dir)) {
      const m = /^(.+)\.(jpe?g|png|webp)$/i.exec(file);
      if (m) found[m[1].toLowerCase()] = file;     // slug -> the real file name
    }
    return found;
  } catch {
    return {};
  }
}

// lawofruin.io: one cinematic screen. The installed app opens at /app instead.
export default function Home() {
  return <Hero photos={photosOnDisk()} />;
}
