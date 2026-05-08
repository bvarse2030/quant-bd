/*
|-----------------------------------------
| setting up Mongoose for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose from 'mongoose';

const MONGODB_URI = process.env.mongooseURI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, { bufferCommands: false }).then(mongoose => {
      cached.conn = mongoose.connection;
      return cached.conn;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
