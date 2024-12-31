"use client"; // Mark this component as a client component to use React hooks

import { useState, useEffect } from 'react'; // Import useState and useEffect hooks
import clientPromise from '@/utils/mongodb'; // Import MongoDB client promise for database connection

export default function Home() {
  // Initialize status object to track connection steps, errors, and collections
  const status = {
    steps: [] as string[], // Array to hold connection steps
    error: null as string | null, // Variable to hold any error messages
    collections: [] as string[] // Array to hold collection names
  };

  // State variables for managing input and fetched content log
  const [contentId, setContentId] = useState(''); // State for the Content_Log ID input
  const [contentLog, setContentLog] = useState(null); // State for storing fetched content log
  const [error, setError] = useState(''); // State for storing error messages

  // Function to fetch content log based on the provided ID
  const handleFetchContent = async () => {
    try {
      const response = await fetch(`/api/content-log/${contentId}`); // Call the API route
      if (!response.ok) {
        throw new Error('Content not found'); // Throw an error if the response is not OK
      }
      const data = await response.json(); // Parse the response data as JSON
      setContentLog(data); // Update the contentLog state with the fetched data
      setError(''); // Clear any previous error messages
    } catch (err: unknown) {
      const error = err as Error; // Type assertion for error handling
      setError(error.message); // Set the error message in state
      setContentLog(null); // Clear the content log state
    }
  };

  // Use useEffect to handle MongoDB connection and collection fetching
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        status.steps.push("1. Attempting to connect to MongoDB...");
        const client = await clientPromise; // Await the MongoDB client promise
        status.steps.push("✅ MongoDB client initialized successfully");

        // Get database reference
        const dbName = process.env.MONGODB_DB || "defaultDatabaseName"; // Fallback to a default if not set
        const db = client.db(dbName); // Get the database reference
        status.steps.push(`✅ Database reference obtained for ${dbName}`);

        // Fetch the list of collections
        const collections = await db.listCollections().toArray(); // Fetch the list of collections from the database
        status.collections = collections.map(col => col.name); // Extract collection names
        status.steps.push(`✅ Found ${status.collections.length} collections`); // Log the number of collections
      } catch (e) {
        const error = e as Error; // Type assertion for error handling
        console.error('MongoDB connection error:', error); // Log the connection error
        status.error = error.message; // Set the error message in status
        status.steps.push(`❌ Error: ${error.message}`); // Log the error step
      }
    };

    fetchCollections(); // Call the function to fetch collections
  }, []); // Empty dependency array means this effect runs once on mount

  // Render the component UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Navigation Links */}
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <a href="/search-results" className="text-blue-600 hover:underline">Search Results</a>
          </li>
          <li>
            <a href="/source-content" className="text-blue-600 hover:underline">Source Content</a>
          </li>
        </ul>
      </nav>

      <div className="max-w-2xl w-full space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          MongoDB Connection Status
        </h1>
        <div className="space-y-2">
          {status.steps.map((step, index) => (
            <div key={index} className="font-mono text-sm">
              {step} {/* Display each connection step */}
            </div>
          ))}
        </div>

        {status.collections.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Collections:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {status.collections.map((collection, index) => (
                <li key={index} className="font-mono text-sm">
                  {collection} {/* Display each collection name */}
                </li>
              ))}
            </ul>

            {/* Input for Content_Log ID */}
            <div className="flex items-center mt-4">
              <label htmlFor="contentId" className="mr-2">Content_Log ID:</label>
              <input
                id="contentId"
                type="text"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)} // Update contentId state on input change
                className="border rounded p-2 mr-2"
                placeholder="Enter Content Log ID"
              />
              <button
                onClick={handleFetchContent} // Call the fetch function on button click
                className="bg-blue-600 text-white rounded p-2"
              >
                Go
              </button>
            </div>

            {error && <div className="text-red-500">{error}</div>} {/* Display error message if any */}

            {contentLog && (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                <h2 className="text-xl font-semibold">Content Log:</h2>
                <pre>{JSON.stringify(contentLog, null, 2)}</pre> {/* Display fetched content log */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
