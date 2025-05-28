// components/cards/CartCardSkeleton.tsx
export default function CartCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center justify-between border-b pb-6 animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full sm:w-1/2 flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      {/* Quantity + Total Placeholder */}
      <div className="hidden sm:block w-1/4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
      </div>

      {/* Remove Button Placeholder */}
      <div className="h-6 w-6 bg-gray-200 rounded-full" />
    </div>
  );
}
