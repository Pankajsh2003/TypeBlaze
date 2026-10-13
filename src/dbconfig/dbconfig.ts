import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Reuse one connection/promise between invocations in the same Node.js instance.
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  globalThis.mongooseCache ??
  (globalThis.mongooseCache = { conn: null, promise: null });

export async function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URL;

  if (!uri) {
    throw new Error(
      "MONGODB_URL is missing. Add it to the Vercel project's Environment Variables."
    );
  }

  // If this serverless instance already has an active connection, reuse it.
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  // Share an in-progress connection attempt so parallel requests do not create
  // multiple simultaneous connections.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .catch((error: unknown) => {
        // Let the API route receive the real connection error instead of
        // continuing to run queries against a disconnected database.
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
