/* A reader's referral link: lawofruin.app/r/<code>. Remembers who sent this visitor (for 30 days),
   counts the click once, and goes on to the home page. */
import { Suspense } from "react";
import Go from "./Go";

const blank = <main style={{ minHeight: "100dvh", background: "#0b0a08" }} />;

async function Read({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <Go code={code} />;
}

export default function ReferralLink({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={blank}>
      <Read params={params} />
    </Suspense>
  );
}
