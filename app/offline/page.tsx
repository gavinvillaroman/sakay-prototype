export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
      <div className="max-w-sm text-center space-y-3">
        <div className="text-5xl">📡</div>
        <h1 className="text-2xl font-bold tracking-tight">You're offline</h1>
        <p className="text-gray-600 text-[15px] leading-relaxed">
          Sakay needs an internet connection to load fresh listings. Your last viewed pages
          may still work — try going back, or reconnect and refresh.
        </p>
      </div>
    </div>
  );
}
