import { connectMongo } from '../mongodb/connect';
import client from '../redis/connect';

export const initializeDatabases = async () => {
  await client.connect();
  console.log('Connected to Redis successfully.');
  await connectMongo();
};
