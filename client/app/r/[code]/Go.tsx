"use client";

import { useEffect } from "react";
import { api, referral, visitorId } from "@/lib/api";

export default function Go({ code }: { code: string }) {
  useEffect(() => {
    const c = String(code ?? "").toLowerCase();
    if (/^[a-z0-9]{4,20}$/.test(c)) {
      referral.set(c);
      api("/api/referrals/click", { method: "POST", body: { code: c, visitorId: visitorId() } }).catch(() => {});
    }
    window.location.replace("/");
  }, [code]);
  return <main style={{ minHeight: "100dvh", background: "#0b0a08" }} />;
}
