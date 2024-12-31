import clientPromise from '@/utils/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise; // Connect to MongoDB
      const db = client.db(process.env.MONGODB_DB || "defaultDatabaseName"); // Get the database
      const collections = await db.listCollections().toArray(); // Fetch collections
      const collectionNames = collections.map(col => col.name); // Extract collection names
      res.status(200).json(collectionNames); // Return collection names as JSON
    } catch (error) {
      console.error('Error fetching collections:', error); // Log the error
      res.status(500).json({ message: 'Failed to fetch collections', error: error.message }); // Return error response
    }
  } else {
    res.setHeader('Allow', ['GET']); // Allow only GET requests
    res.status(405).end(`Method ${req.method} Not Allowed`); // Handle unsupported methods
  }
} 