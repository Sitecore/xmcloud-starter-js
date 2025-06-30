import { debug, GraphQLClient } from '@sitecore-content-sdk/core';
import { GraphQLServiceConfig } from '@sitecore-content-sdk/core/types/sitecore-service-base';

export default class ContentServiceClient {
  public graphQLClient: GraphQLClient;

  constructor(public serviceConfig: GraphQLServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  protected getGraphQLClient(): GraphQLClient {
    if (!this.serviceConfig.clientFactory) {
      throw new Error('GraphQLClientFactory is not defined');
    }

    return this.serviceConfig.clientFactory({
      debugger: this.serviceConfig.debugger ?? debug.http,
      retries: this.serviceConfig.retries?.count,
      retryStrategy: this.serviceConfig.retries?.retryStrategy,
    });
  }
}
