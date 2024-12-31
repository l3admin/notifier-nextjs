"use client"; // Mark this component as a client component to use React hooks

import { useState, useEffect } from 'react'; // Import useState and useEffect hooks for managing state and side effects

export default function Home() {
  // Initialize state to track connection steps, errors, and collections
  const [status, setStatus] = useState({
    steps: [] as string[], // Array to hold connection steps for logging
    error: null as string | null, // Variable to hold any error messages
    collections: [] as string[] // Array to hold names of collections fetched from the database
  });

  // State variables for managing user input and fetched content log
  const [contentId, setContentId] = useState(''); // State for the Content_Log ID input from the user
  const [contentLog, setContentLog] = useState(null); // State for storing the fetched content log data
  const [error, setError] = useState(''); // State for storing error messages related to fetching content

  // Function to fetch content log based on the provided Content_Log ID
  const handleFetchContent = async () => {
    try {
      // Make a GET request to the API route to fetch content log by ID
      const response = await fetch(`/api/content-log/${contentId}`); // Call the API route with the user-provided ID
      if (!response.ok) {
        throw new Error('Content not found'); // Throw an error if the response is not OK (e.g., 404)
      }
      const data = await response.json(); // Parse the response data as JSON
      setContentLog(data); // Update the contentLog state with the fetched data
      setError(''); // Clear any previous error messages
    } catch (err: unknown) {
      const error = err as Error; // Type assertion for error handling
      setError(error.message); // Set the error message in state to display to the user
      setContentLog(null); // Clear the content log state in case of an error
    }
  };

  // Use useEffect to handle fetching collections from the database when the component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Make a GET request to the API route to fetch the list of collections
        const response = await fetch('/api/example'); // Update the API endpoint to /api/example
        if (!response.ok) {
          throw new Error('Failed to fetch collections'); // Throw an error if the response is not OK
        }
        const data = await response.json(); // Parse the response data as JSON
        // Update the status state with the fetched collection names and log the successful fetch
        setStatus((prevStatus) => ({
          ...prevStatus,
          collections: data, // Store the fetched collection names
          steps: [...prevStatus.steps, `✅ Found ${data.length} collections`] // Log the success message
        }));
      } catch (e) {
        const error = e as Error; // Type assertion for error handling
        console.error('Error fetching collections:', error); // Log the connection error for debugging
        // Update the status state with the error message and log the failure
        setStatus((prevStatus) => ({
          ...prevStatus,
          error: error.message, // Store the error message
          steps: [...prevStatus.steps, `❌ Error: ${error.message}`] // Log the error message
        }));
      }
    };

    fetchCollections(); // Call the function to fetch collections when the component mounts
  }, []); // Empty dependency array means this effect runs only once on mount

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
          {/* Display each connection step logged in the status */}
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
              {/* Display each collection name fetched from the database */}
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
                value={contentId} // Bind the input value to the contentId state
                onChange={(e) => setContentId(e.target.value)} // Update contentId state on input change
                className="border rounded p-2 mr-2"
                placeholder="Enter Content Log ID" // Placeholder text for the input
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
                <pre>{JSON.stringify(contentLog, null, 2)}</pre> {/* Display fetched content log in a formatted way */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
