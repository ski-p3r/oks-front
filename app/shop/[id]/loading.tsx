export default function Loading() {
  return (
    <div className="container py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading product details...</p>
      </div>
    </div>
  );
}
