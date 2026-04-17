export const metadata = {
  title: "Test - Laboratory of Plant Systematic",
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-green-700 mb-8">Test Page</h1>
        
        <div className="bg-white rounded-lg border border-green-200 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">App Status</h2>
          <p className="text-gray-600">
            ✅ App is loading and rendering pages correctly!
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded p-4 space-y-2">
            <h3 className="font-semibold text-green-700">Next Steps:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Dependencies are being installed automatically</li>
              <li>The app UI is fully styled and ready</li>
              <li>Go to <a href="/" className="text-green-600 hover:underline">home page</a> to see the landing page</li>
              <li>Go to <a href="/about" className="text-green-600 hover:underline">about page</a></li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-700 mb-2">Development Note:</h3>
            <p className="text-sm text-blue-600">
              Auth and database are currently stubbed. Once dependencies install, 
              uncomment the real auth code in <code>lib/auth.ts</code> and configure 
              your database connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
