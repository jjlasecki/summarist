
export default function SettingsSkeleton() {
  return (
    <main
      className="mx-auto max-w-5xl px-8 py-10"
      aria-label="Loading settings"
    >
      <div className="animate-pulse">
        {/* Settings heading */}
        <div className="border-b border-gray-200 pb-4">
          <div className="h-8 w-32 rounded bg-gray-200" />
        </div>

        <div className="mt-8">
          {/* Subscription section */}
          <div className="mb-3 h-6 w-52 rounded bg-gray-200" />
          <div className="mb-3 h-5 w-24 rounded bg-gray-200" />
          <div className="h-9 w-44 rounded bg-gray-200" />

          {/* Email section */}
          <div className="mb-3 mt-8 h-6 w-20 rounded bg-gray-200" />
          <div className="h-5 w-64 max-w-full rounded bg-gray-200" />
        </div>
      </div>
    </main>
  );
}
