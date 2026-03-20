export default function ProductSkeleton({ count=8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
      {Array.from({ length: count }).map((_,i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-[3/4] skeleton" />
          <div className="space-y-2">
            <div className="h-2 w-16 skeleton" />
            <div className="h-3 w-full skeleton" />
            <div className="h-3 w-20 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}
