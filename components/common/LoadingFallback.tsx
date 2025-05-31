export const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        {/* Rounded magnifier animation */}
        <div className="w-16 h-16 rounded-full border-4 border-primary border-dashed flex items-center justify-center animate-spin">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
        <p className="text-lg text-gray-500 font-medium">Searching...</p>
      </div>
    </div>
  );
};
