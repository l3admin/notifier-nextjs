import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("your_database_name");

    // Test the connection explicitly
    await db.command({ ping: 1 });
    
    // Example: Fetch all items from a collection
    const items = await db.collection("your_collection_name")
      .find({})
      .limit(10)
      .toArray();

    return NextResponse.json({ 
      status: 'success',
      environment: process.env.NODE_ENV,
      items 
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