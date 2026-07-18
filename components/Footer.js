// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} ChatViper – Anonymous Random Chat</span>
      </div>
    </footer>
  );
}