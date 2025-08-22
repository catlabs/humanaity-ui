import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';

export function createApollo() {
  return {
    provide: APOLLO_OPTIONS,
    useFactory: () => {
      return new ApolloClient({
        uri: 'http://localhost:8080/graphql',
        cache: new InMemoryCache(),
      });
    },
  };
}
