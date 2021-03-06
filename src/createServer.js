const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutations');
const Query = require('./resolvers/Queries');
const db = require('./db');

// Create the GraphQL Yoga Server

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => {
      const user = req.request.user;

      return { user, db };
    },
  });
}

module.exports = { createServer, db };
