import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { split, ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { HttpLink } from 'apollo-angular/http';
import { WebSocketLink } from "@apollo/client/link/ws";

const uri = 'http://graphqlcore.localhost/graphql'; // <-- add the URL of the GraphQL server here
const wsuri = 'ws://graphqlcore.localhost/graphql';
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const http = httpLink.create({ uri });
  const ws = new WebSocketLink({
    uri: wsuri,
    options: {
      reconnect: true,
    },
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      );
    },
    ws,
    http,
  );

  return {
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { errorPolicy: 'all' },
      watchQuery: { errorPolicy: 'all' },
      mutate: { errorPolicy: 'all' },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
