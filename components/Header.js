"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <Link href="/" className="app-logo" onClick={closeMenu}>
          ChatViper
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
        </nav>
      )}
    </header>
  );
}