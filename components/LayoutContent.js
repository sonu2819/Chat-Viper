"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutContent({ children }) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/chat" ||
    pathname === "/video";

  return (
    <>
      {!hideLayout && <Header />}

      <main className="app-main">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}