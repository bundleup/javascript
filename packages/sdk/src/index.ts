import { Connections } from './connection';
import { Integrations } from './integration';
import { Webhooks } from './webhooks';
import { Request } from './request';

export class BundleUp {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connections() {
    return new Connections(this.apiKey);
  }
  
  integrations() {
    return new Integrations(this.apiKey);
  }

  webhooks() {
    return new Webhooks(this.apiKey);
  }

  request(connectionId: string) {
    if (!connectionId) {
      throw new Error('Connection ID is required to create a Fetch instance.');
    }

    return new Request(this.apiKey, connectionId);
  }
}