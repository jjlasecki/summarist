
export default function SelectedBookSkeleton() {
  return (
    <div
      className="flex max-w-[680px] items-center rounded bg-[#fdf1d7] p-6 animate-pulse"
      aria-hidden="true"
    >
      {/* Subtitle */}
      <div className="w-2/5 self-stretch border-r border-gray-300 pr-6">
        <div className="mb-3 h-4 w-full rounded bg-gray-200" />
        <div className="mb-3 h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>

      {/* Book cover */}
      <div className="flex w-1/4 justify-center px-5">
        <div className="h-40 w-28 rounded bg-gray-200" />
      </div>

      {/* Book details */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="mt-2 h-10 w-10 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
