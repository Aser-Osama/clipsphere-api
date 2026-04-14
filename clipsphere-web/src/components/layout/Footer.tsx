export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ClipSphere. All rights reserved.
      </div>
    </footer>
  );
}
