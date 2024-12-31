import { useState } from 'react';

export default function SourceContent() {
  const [contentId, setContentId] = useState('');
  const [contentLog, setContentLog] = useState(null);
  const [error, setError] = useState('');

  const handleFetchContent = async () => {
    try {
      const response = await fetch(`/api/content-log/${contentId}`); // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Content not found');
      }
      const data = await response.json();
      setContentLog(data);
      setError('');
    } catch (err: unknown) {
      const error = err as Error; // Type assertion
      setError(error.message);
      setContentLog(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Source Content</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="contentId" className="mr-2">Source Data:</label>
        <input
          id="contentId"
          type="text"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          className="border rounded p-2 mr-2"
          placeholder="Enter Content Log ID"
        />
        <button
          onClick={handleFetchContent}
          className="bg-blue-600 text-white rounded p-2"
        >
          Go
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {contentLog && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold">Content Log:</h2>
          <pre>{JSON.stringify(contentLog, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 