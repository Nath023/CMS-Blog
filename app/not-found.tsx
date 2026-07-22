export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-bold mb-4">Not Found</h2>
      <p className="text-gray-500 mb-8">Could not find requested resource</p>
      <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Return Home
      </a>
    </div>
  );
}
