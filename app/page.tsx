import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Nilex Fashion House</h1>
      <p className="mb-6 text-gray-300">
        Folder-based collection system refactor (Step 1).
      </p>
      <Link
        href="/debug/collections"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
      >
        View Collections Debug Page &rarr;
      </Link>
    </div>
  );
}
