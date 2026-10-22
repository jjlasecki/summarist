export default function PlayerSkeleton() {
  return (
    <main
      className="mx-auto max-w-5xl animate-pulse px-8 py-10"
      aria-label="Loading audio player"
    >
      <div className="mx-auto max-w-2xl">
        {/* Book title */}
        <div className="mb-6 h-8 w-3/4 rounded bg-gray-200" />

        {/* Book content */}
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>

      {/* Audio player controls */}
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-center gap-4 bg-[#032b41] p-4 md:left-60 md:w-[calc(100%-15rem)]">
        <div className="h-10 w-10 rounded-full bg-gray-500" />
        <div className="h-3 w-40 rounded bg-gray-500" />
        <div className="h-4 w-12 rounded bg-gray-500" />
      </div>
    </main>
  );
}
