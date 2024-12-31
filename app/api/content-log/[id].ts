import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id: queryId },
    method,
  } = req;

  if (method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "defaultDatabaseName");

      let id = queryId;

      if (Array.isArray(id)) {
        id = id[0];
      }

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const contentLog = await db.collection('Content_Log').findOne({ _id: new ObjectId(id) });

      if (!contentLog) {
        return res.status(404).json({ message: 'Content not found' });
      }

      res.status(200).json(contentLog);
    } catch (error) {
      console.error('Error fetching content log:', error);
      const errorMessage = (error as Error).message;
      res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
} 