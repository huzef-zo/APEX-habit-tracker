import { getAllCollections } from '@/lib/collections';
import { collectionsData } from '@/lib/collections.generated';
import Link from 'next/link';

export default function DebugCollectionsPage() {
  const collections = getAllCollections();

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="mb-6 flex justify-between items-center border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Collections Debug Page</h1>
          <p className="text-sm text-gray-400 mt-1">
            Generated at: {collectionsData.generatedAt}
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-blue-400 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">Total Collections</div>
          <div className="text-3xl font-bold text-white mt-1">
            {collectionsData.totalCollections}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">Total Subcollections</div>
          <div className="text-3xl font-bold text-white mt-1">
            {collectionsData.totalSubcollections}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">Total Images</div>
          <div className="text-3xl font-bold text-white mt-1">
            {collectionsData.totalImages}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {collections.map(collection => (
          <div
            key={collection.slug}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6"
          >
            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
              <div>
                <span className="text-xs font-semibold bg-blue-900 text-blue-300 px-2 py-0.5 rounded mr-2">
                  PREFIX: {collection.prefix}
                </span>
                <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">
                  ORDER: {collection.order}
                </span>
                <h2 className="text-2xl font-bold text-white inline-block mt-1">
                  {collection.name} ({collection.slug})
                </h2>
                {collection.description && (
                  <p className="text-gray-400 text-sm mt-1">{collection.description}</p>
                )}
              </div>
              {collection.coverImage && (
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Cover Image</span>
                  <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">
                    {collection.coverImage}
                  </code>
                </div>
              )}
            </div>

            {/* Collection level images */}
            {collection.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-300 mb-2">
                  Collection Main Images ({collection.images.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {collection.images.map(img => (
                    <div
                      key={img.id}
                      className="bg-gray-900 p-3 rounded border border-gray-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-green-400">{img.id}</span>
                          <span className="text-xs text-gray-500"># {img.order}</span>
                        </div>
                        <div className="text-xs text-gray-400 truncate">{img.fileName}</div>
                      </div>
                      <div className="mt-2 text-xs text-blue-400 font-mono break-all">{img.src}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subcollections */}
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Subcollections ({collection.subcollections.length})
              </h3>
              {collection.subcollections.length === 0 ? (
                <div className="text-sm text-gray-500 italic">No subcollections found.</div>
              ) : (
                <div className="space-y-4">
                  {collection.subcollections.map(sub => (
                    <div
                      key={sub.slug}
                      className="bg-gray-900 rounded p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-2">
                        <div>
                          <span className="text-xs font-semibold bg-purple-900 text-purple-300 px-2 py-0.5 rounded mr-2">
                            PREFIX: {sub.prefix}
                          </span>
                          <span className="text-xs font-semibold bg-gray-800 text-gray-300 px-2 py-0.5 rounded mr-2">
                            ORDER: {sub.order}
                          </span>
                          <h4 className="text-lg font-bold text-white inline-block">
                            {sub.name} ({sub.slug})
                          </h4>
                          {sub.description && (
                            <p className="text-gray-400 text-xs mt-1">{sub.description}</p>
                          )}
                        </div>
                        {sub.coverImage && (
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">Cover</span>
                            <code className="text-xs bg-gray-800 text-green-400 px-2 py-1 rounded">
                              {sub.coverImage}
                            </code>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        {sub.images.map(img => (
                          <div
                            key={img.id}
                            className="bg-gray-800 p-3 rounded border border-gray-700 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-green-400">{img.id}</span>
                                <span className="text-xs text-gray-500"># {img.order}</span>
                              </div>
                              <div className="text-xs text-gray-400 truncate">{img.fileName}</div>
                            </div>
                            <div className="mt-2 text-xs text-blue-400 font-mono break-all">
                              {img.src}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
