import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import Resolvers from './graphql/resolvers.js';
import { initializeDatabases } from './config/databases.js';
import { typeDefs } from './graphql/typeDef.js';
import client from './redis/connect.js';
const createApolloServer = () => {
    return new ApolloServer({
        typeDefs,
        Resolvers,
        context: async ({ req, res }) => ({
            redisClient: client,
        }),
    });
};
const startServer = async () => {
    try {
        await initializeDatabases();
        const server = createApolloServer();
        const { url } = await startStandaloneServer(server, { listen: { port: 4000 }, });
        console.log(`🚀 Server ready at ${url}`);
    }
    catch (error) {
        console.error('Failed to connect', error);
    }
};
startServer();
