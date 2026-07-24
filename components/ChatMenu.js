"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChatMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-menu">
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {open && (
        <nav className="menu-dropdown">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/chat" onClick={() => setOpen(false)}>Text Chat</Link>
          <Link href="/video" onClick={() => setOpen(false)}>Video Chat</Link>
          <Link href="/features" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/privacy-policy" onClick={() => setOpen(false)}>Privacy</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      )}
    </div>
  );
}