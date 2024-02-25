import { connectMongo } from '../mongodb/connect.js';
import client from '../redis/connect.js';
export const initializeDatabases = async () => {
    await client.connect();
    console.log('Connected to Redis successfully.');
    await connectMongo();
};
