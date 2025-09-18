import { logger } from './utils';

export interface BundleUpConfig {
  apiKey?: string;
  debug?: boolean;
}

export interface BundleUpResponse {
  token: string;
  expires_in: number;
  externalId: string;
}

export interface ConnectionOptions {
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export class BundleUp {
  private config: BundleUpConfig;

  constructor(config: BundleUpConfig = {}) {
    if (!config.apiKey) {
      throw new Error('API key is required for authentication');
    }

    this.config = {
      apiKey: config.apiKey,
      debug: config.debug ?? false,
    };
  }

  private log(message: string, ...args: any[]): void {
    return logger(!!this.config.debug)(message, ...args);
  }

  public async createConnection(
    integrationId: string,
    options: ConnectionOptions,
  ) {
    this.log(`Creating connection for integration: ${integrationId}`);

    if (!integrationId) {
      this.log('Integration ID is missing');
      throw new Error('Integration ID is required to create a connection');
    }

    try {
      const response = await fetch('https://auth.bundleup.io/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          integrationId,
          externalId: options.externalId || undefined,
          metadata: options.metadata || {},
        }),
      });

      if (!response.ok) {
        this.log(
          `Authentication request failed: ${response.status} ${response.statusText}`,
        );
        throw new Error(
          `Authentication request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data: BundleUpResponse = await response.json();

      if (!data.token) {
        this.log('Invalid response: could not create token', data);
        throw new Error('Invalid response: could not create token');
      }

      this.log('Authentication token received successfully');
      return data;
    } catch (error) {
      this.log('Error creating connection', error);
      throw error;
    }
  }
}
