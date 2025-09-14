import { BundleUpCore, type PluginOptions } from '@bundleup/common';

export interface RemixBundleUpOptions extends PluginOptions {
  trackLoaders?: boolean;
  trackActions?: boolean;
  enableServerMetrics?: boolean;
}

export class RemixBundleUpPlugin extends BundleUpCore {
  private trackLoaders: boolean;
  private trackActions: boolean;

  constructor(options: RemixBundleUpOptions = {}) {
    super(options.bundleUpConfig);
    this.trackLoaders = options.trackLoaders ?? true;
    this.trackActions = options.trackActions ?? true;
  }

  // Middleware for tracking Remix requests
  createRequestMiddleware() {
    return (request: Request, response: any, next: () => void) => {
      if (!this.isEnabled()) {
        return next();
      }

      const startTime = Date.now();
      const originalEnd = (response as any).end;

      (response as any).end = function(...args: any[]) {
        const duration = Date.now() - startTime;
        console.log(`[BundleUp Remix] Request ${request.method} ${request.url} completed in ${duration}ms`);
        return originalEnd.apply(this, args);
      };

      next();
    };
  }

  // Wrapper for Remix loaders
  wrapLoader<T>(loader: (args: any) => Promise<T> | T, name?: string) {
    if (!this.trackLoaders || !this.isEnabled()) {
      return loader;
    }

    return async (args: any) => {
      const startTime = Date.now();
      this.log(`Loader ${name || 'unknown'} started`);
      
      try {
        const result = await loader(args);
        const duration = Date.now() - startTime;
        this.log(`Loader ${name || 'unknown'} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.log(`Loader ${name || 'unknown'} failed in ${duration}ms`, error);
        throw error;
      }
    };
  }

  // Wrapper for Remix actions
  wrapAction<T>(action: (args: any) => Promise<T> | T, name?: string) {
    if (!this.trackActions || !this.isEnabled()) {
      return action;
    }

    return async (args: any) => {
      const startTime = Date.now();
      this.log(`Action ${name || 'unknown'} started`);
      
      try {
        const result = await action(args);
        const duration = Date.now() - startTime;
        this.log(`Action ${name || 'unknown'} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.log(`Action ${name || 'unknown'} failed in ${duration}ms`, error);
        throw error;
      }
    };
  }
}

export function createRemixBundleUpPlugin(options: RemixBundleUpOptions = {}) {
  return new RemixBundleUpPlugin(options);
}

// Helper functions for Remix integration
export function withBundleUpLoader<T>(
  loader: (args: any) => Promise<T> | T,
  options: RemixBundleUpOptions = {},
  name?: string
) {
  const plugin = new RemixBundleUpPlugin(options);
  return plugin.wrapLoader(loader, name);
}

export function withBundleUpAction<T>(
  action: (args: any) => Promise<T> | T,
  options: RemixBundleUpOptions = {},
  name?: string
) {
  const plugin = new RemixBundleUpPlugin(options);
  return plugin.wrapAction(action, name);
}

export * from '@bundleup/common';