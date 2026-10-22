export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-200" />
      </div>
      <div className="h-64 rounded-xl bg-gray-200" />
    </div>
  );
}
