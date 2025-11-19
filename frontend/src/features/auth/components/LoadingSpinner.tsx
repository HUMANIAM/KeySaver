/**
 * Loading spinner component
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
