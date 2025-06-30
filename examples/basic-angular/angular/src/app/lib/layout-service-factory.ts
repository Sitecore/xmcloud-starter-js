import {
  LayoutService,
  GraphQLLayoutService,
  } from '@sitecore-jss/sitecore-jss-angular';
import { environment } from '../../environments/environment';
import clientFactory from './graphql-client-factory';

export class LayoutServiceFactory {
  create(): LayoutService {
    const service =
            new GraphQLLayoutService({
            clientFactory,
            siteName: environment.sitecoreSiteName,
          });

    return service;
  }
}

export const layoutServiceFactory = new LayoutServiceFactory();
