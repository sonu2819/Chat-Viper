"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-content">
       <Link href="/" className="app-logo" onClick={closeMenu}>
  <Image
    src="/logo.png"
    alt="ChatViper Logo"
    width={40}
    height={40}
    priority
  />

  <span>ChatViper</span>
</Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="menu-dropdown">
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/chat" onClick={closeMenu}>Chat</Link>
           <Link href="/video" onClick={closeMenu}>Video</Link>
          <Link href="/about" onClick={closeMenu}>About</Link>
          <Link href="/features" onClick={closeMenu}>Features</Link>
          <Link href="/privacy-policy" onClick={closeMenu}>Privacy</Link>
          <Link href="/contact" onClick={closeMenu}>contact</Link>
        </nav>
      )}
    </header>
  );
}