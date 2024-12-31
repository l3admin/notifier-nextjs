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

      const contentLog = await db.collection('Content_Log').findOne({ _id: new ObjectId(id) });

      if (!contentLog) {
        return res.status(404).json({ message: 'Content not found' });
      }
      res.status(200).json(contentLog);
    } catch (error: unknown) {
      console.error('Error fetching content log:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
} 