export default function BookDetailsSkeleton() {
  return (
    <main
      className="mx-auto max-w-5xl animate-pulse px-8 py-10 text-[#032b41]"
      aria-label="Loading book details"
    >
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Left: Book information */}
        <div className="flex-1">
          {/* Title and author */}
          <div className="mb-4 h-9 w-3/4 rounded bg-gray-200" />
          <div className="mb-3 h-5 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />

          {/* Book statistics */}
          <div className="my-6 grid grid-cols-2 gap-4 border-y py-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 w-3/4 rounded bg-gray-200" />
            ))}
          </div>

          {/* Read and Listen buttons */}
          <div className="flex gap-3">
            <div className="h-12 w-28 rounded bg-gray-200" />
            <div className="h-12 w-28 rounded bg-gray-200" />
          </div>

          {/* My Library */}
          <div className="mt-5 h-4 w-44 rounded bg-gray-200" />

          {/* Book description */}
          <div className="mt-8">
            <div className="mb-4 h-5 w-40 rounded bg-gray-200" />

            <div className="mb-5 flex gap-2">
              <div className="h-8 w-20 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded bg-gray-200" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-4/5 rounded bg-gray-200" />
            </div>
          </div>

          {/* Author description */}
          <div className="mt-8">
            <div className="mb-4 h-5 w-36 rounded bg-gray-200" />

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Right: Book cover */}
        <div className="flex w-full justify-center md:w-72">
          <div className="h-80 w-56 rounded bg-gray-200" />
        </div>
      </div>
    </main>
  );
}
