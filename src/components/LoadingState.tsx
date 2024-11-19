// src/components/LoadingState.tsx
export function LoadingState() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="w-24 h-24 bg-gray-200 mx-auto rounded-lg"/>
          <div className="h-4 bg-gray-200 mt-2 rounded w-20 mx-auto"/>
        </div>
      ))}
    </div>
  );
}

