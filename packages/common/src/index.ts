/**
 * Common utilities and types for BundleUp framework plugins
 */

export interface BundleUpConfig {
  apiKey?: string;
  endpoint?: string;
  enabled?: boolean;
  debug?: boolean;
}

export interface PluginOptions {
  bundleUpConfig?: BundleUpConfig;
  [key: string]: any;
}

export class BundleUpCore {
  private config: BundleUpConfig;

  constructor(config: BundleUpConfig = {}) {
    this.config = {
      enabled: true,
      debug: false,
      ...config,
    };
  }

  isEnabled(): boolean {
    return this.config.enabled ?? true;
  }

  log(message: string, ...args: any[]): void {
    if (this.config.debug) {
      console.log(`[BundleUp] ${message}`, ...args);
    }
  }

  getConfig(): BundleUpConfig {
    return { ...this.config };
  }

  /**
   * Backend method to request an authentication token
   * @param integrationId - The integration ID provided by user
   * @param externalId - The external ID provided by user
   * @returns Promise<string> - The authentication token
   */
  async requestAuthToken(integrationId: string, externalId: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for authentication');
    }

    this.log('Requesting authentication token', { integrationId, externalId });

    try {
      const response = await fetch('https://auth.bundleup.io/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          integrationId,
          externalId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication request failed: ${response.status} ${response.statusText}`);
      }

      const data: any = await response.json();
      
      if (!data.token) {
        throw new Error('Invalid response: token not found');
      }

      this.log('Authentication token received successfully');
      return data.token;
    } catch (error) {
      this.log('Authentication token request failed', error);
      throw error;
    }
  }
}

export function createBundleUpPlugin(options: PluginOptions = {}) {
  return new BundleUpCore(options.bundleUpConfig);
}

export * from './types';
export * from './utils';