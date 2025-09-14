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
}

export function createBundleUpPlugin(options: PluginOptions = {}) {
  return new BundleUpCore(options.bundleUpConfig);
}

export * from './types';
export * from './utils';