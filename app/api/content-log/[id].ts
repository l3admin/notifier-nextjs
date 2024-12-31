import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "defaultDatabaseName");

      const objectId = Array.isArray(id) ? id[0] : id; // Handle case where id is an array
      const contentLog = await db.collection('your_collection_name').findOne({ _id: new ObjectId(objectId) });

      if (!contentLog) {
        return res.status(404).json({ message: 'Content not found' });
      }
      res.status(200).json(contentLog);
    } catch (error) {
      const typedError = error as Error; // Assert the type of error
      res.status(500).json({ message: 'Internal Server Error', error: typedError.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
} 