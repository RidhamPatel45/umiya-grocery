import mongoose from 'mongoose';
import logger from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');
  const conn = await mongoose.connect(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 });
  logger.info("✅ MongoDB connected: " + conn.connection.host);
};
