import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-hero px-6 text-primary-foreground">
      <div className="max-w-md text-center">
        <p className="text-[7rem] font-black leading-none tracking-tighter text-gradient-gold">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 leading-relaxed text-primary-foreground/65">
          That link doesn&apos;t point anywhere. It may have moved, or never existed.
        </p>
        <Link href="/" className={buttonClass("primary", "md", "mt-8")}>
          <ArrowLeft size={16} aria-hidden />
          Back home
        </Link>
      </div>
    </main>
  );
}
