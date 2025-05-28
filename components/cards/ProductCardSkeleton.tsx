// components/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border rounded-xl shadow overflow-hidden animate-pulse">
      <div className="w-full h-60 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-300 rounded w-1/2 mt-2" />
        <div className="flex gap-2 mt-4">
          <div className="h-9 bg-gray-300 rounded-lg w-1/2" />
          <div className="h-9 bg-gray-300 rounded-lg w-1/2" />
        </div>
      </div>
    </div>
  );
}
