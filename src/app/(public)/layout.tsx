"use client";

import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components/Layout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className={`grow pb-20 ${isHome ? "pt-0" : "pt-28"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
