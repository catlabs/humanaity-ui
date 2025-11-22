import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './auth/auth.interceptor';
import {provideApollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache, split} from '@apollo/client/core';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {Kind, OperationTypeNode} from 'graphql/language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(withFetch(), withInterceptors([authInterceptor])), provideApollo(() => {
      const httpLink = inject(HttpLink);
      // Create an http link:
      const http = httpLink.create({
        uri: 'http://localhost:8080/graphql',
      });

      // Create a WebSocket link:
      const ws = new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:8080/graphql',
        }),
      );

      // Using the ability to split links, you can send data to each link
      // depending on what kind of operation is being sent
      const link = split(
        // Split based on operation type
        ({query}) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === Kind.OPERATION_DEFINITION &&
            definition.operation === OperationTypeNode.SUBSCRIPTION
          );
        },
        ws,
        http,
      );
      return {
        link,
        cache: new InMemoryCache(),
        // other options...
      };
    })
  ]
};
