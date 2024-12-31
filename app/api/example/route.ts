import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("NotifierMongo");

    // Test the connection explicitly
    await db.command({ ping: 1 });
    
    // Fetch all collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);

    return NextResponse.json({ 
      status: 'success',
      environment: process.env.NODE_ENV,
      collections: collectionNames
    });
  } catch (e) {
    const error = e as Error;
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      environment: process.env.NODE_ENV
    }, { 
      status: 500 
    });
  }
}  