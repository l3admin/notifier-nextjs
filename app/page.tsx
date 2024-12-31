import clientPromise from '@/utils/mongodb';

export default async function Home() {
  const status = {
    steps: [] as string[],
    error: null as string | null,
    collections: [] as string[]
  };

  try {
    // Step 1: Initial connection attempt
    status.steps.push("1. Attempting to connect to MongoDB...");
    console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);
    const client = await clientPromise;
    status.steps.push("✅ MongoDB client initialized successfully");

    // Step 2: Get database reference
    status.steps.push("2. Getting database reference...");
    const dbName = process.env.MONGODB_DB || "defaultDatabaseName"; // Fallback to a default if not set
    const db = client.db(dbName);
    status.steps.push(`✅ Database reference obtained for ${dbName}`);

    // Step 3: Test connection with ping
    status.steps.push("3. Testing connection with ping command...");
    const pingResult = await db.command({ ping: 1 });
    status.steps.push(`✅ Ping successful: ${JSON.stringify(pingResult)}`);

    // Step 4: Environment info
    status.steps.push(`4. Environment: ${process.env.NODE_ENV}`);
    
    // Step 5: Connection string check (safely)
    const maskedUri = process.env.MONGODB_URI 
      ? process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
      : "Not found";
    status.steps.push(`5. Connection string: ${maskedUri}`);

    console.log(`Using MongoDB URI: ${maskedUri}`);

    // Step 6: List collections
    status.steps.push("6. Fetching list of collections...");
    const collections = await db.listCollections().toArray();
    status.collections = collections.map(col => col.name);
    status.steps.push(`✅ Found ${status.collections.length} collections`);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            MongoDB Connection Status
          </h1>
          <div className="space-y-2">
            {status.steps.map((step, index) => (
              <div key={index} className="font-mono text-sm">
                {step}
              </div>
            ))}
          </div>

          {status.collections.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Collections:</h2>
              <ul className="list-disc pl-5 space-y-1">
                {status.collections.map((collection, index) => (
                  <li key={index} className="font-mono text-sm">
                    {collection}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );

  } catch (e) {
    const error = e as Error;
    console.error('MongoDB connection error:', error);
    status.error = error.message;
    status.steps.push(`❌ Error: ${error.message}`);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            MongoDB Connection Failed
          </h1>
          <div className="space-y-2">
            {status.steps.map((step, index) => (
              <div key={index} className="font-mono text-sm">
                {step}
              </div>
            ))}
            {status.error && (
              <div className="text-red-500 font-mono text-sm mt-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {status.error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
