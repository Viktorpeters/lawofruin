"use client";

import { useEffect } from "react";
import { referral } from "@/lib/api";
import { countClick } from "@/lib/services/referrals.service";

export default function Go({ code }: { code: string }) {
  useEffect(() => {
    const c = String(code ?? "").toLowerCase();
    if (/^[a-z0-9]{4,20}$/.test(c)) {
      referral.set(c);
      countClick(c).catch(() => {});
    }
    window.location.replace("/");
  }, [code]);
  return <main style={{ minHeight: "100dvh", background: "#0b0a08" }} />;
}
