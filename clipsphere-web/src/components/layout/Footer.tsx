export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border-subtle mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} ClipSphere. All rights reserved.
      </div>
    </footer>
  );
}
