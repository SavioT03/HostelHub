export default function Footer() {
  return (
    <footer className="footer-bar">
      <div className="container d-flex justify-content-between align-items-center">
        <small className="text-muted mb-0">
          © 2026 HostelHub. All rights reserved.
        </small>

        <div className="d-flex gap-4">
          <small className="footer-link">Support</small>
          <small className="footer-link">Docs</small>
        </div>
      </div>
    </footer>
  );
}