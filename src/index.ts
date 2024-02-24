import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import resolvers from './graphql/resolvers';
import { initializeDatabases } from './config/databases';
import { typeDefs } from './graphql/typeDef';





const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

const startServer = async () => {
  try {
    await initializeDatabases();

    const server = createApolloServer();

    const {url} = await startStandaloneServer(server, { listen: { port: 4000 },})

   
    console.log(`🚀 Server ready at ${url}`);
    
  } catch (error) {
    console.error('Failed to connect', error);
  }
};

startServer();
