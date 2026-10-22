export default function BookCardSkeleton() {
  return (
    <div className="w-40 flex-shrink-0 animate-pulse" aria-hidden="true">
      <div className="mb-3 h-56 w-full rounded bg-gray-200" />

      <div className="mb-2 h-4 w-11/12 rounded bg-gray-200" />

      <div className="mb-2 h-3 w-3/4 rounded bg-gray-200" />

      <div className="h-3 w-1/2 rounded bg-gray-200" />
    </div>
  );
}
