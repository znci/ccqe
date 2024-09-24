import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import app from './app.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageDisabled()],
});

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(4000, () => {
    logger.success('Server is running on http://localhost:4000');
  });
});
