// components/Footer.jsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          
          <Link href="/about">About</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/features">Features</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <span className="footer-copy">
          © {new Date().getFullYear()} ChatViper • Anonymous Random Text Chat
        </span>
      </div>
    </footer>
  );
}