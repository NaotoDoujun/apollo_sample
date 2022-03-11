import express from "express";
import { createLogger, transports, format } from "winston";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { loadFiles } from "graphql-import-files";
import resolvers from "./resolvers/ResolverMaster.js";

(async () => {
  const PORT = 4000;
  const app = express();
  const httpServer = createServer(app);
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: './logs/app.log', level: 'info' }),
      new transports.File({ filename: './logs/error.log', level: 'error' })
    ]
  });

  const typeDefs = loadFiles("./schema/**/*.{graphql,gql}");
  const schema = makeExecutableSchema({ typeDefs, resolvers });


  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const loggingPlugin = {
    async requestDidStart(requestContext) {
      logger.info(`Request started. query:${requestContext.request.query}`);
      return {
        async didResolveOperation(requestContext) {
          logger.debug(`Resolve operation Done. query:${requestContext.request.query}`);
        },
        async didEncounterErrors(requestContext) {
          logger.error(`${requestContext.errors}`);
        }
      }
    },
  };

  const server = new ApolloServer({
    schema,
    plugins: [
      loggingPlugin,
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen(PORT, resolve));
  console.log(
    `Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
  );

})();
