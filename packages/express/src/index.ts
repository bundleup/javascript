import type { Request, Response, NextFunction, Application } from 'express';
import { BundleUpCore, type PluginOptions } from '@bundleup/common';

export interface ExpressBundleUpOptions extends PluginOptions {
  trackRequests?: boolean;
  trackErrors?: boolean;
  enableMetrics?: boolean;
  excludePaths?: string[];
}

export class ExpressBundleUpPlugin extends BundleUpCore {
  private trackRequests: boolean;
  private trackErrors: boolean;
  private enableMetrics: boolean;
  private excludePaths: string[];

  constructor(options: ExpressBundleUpOptions = {}) {
    super(options.bundleUpConfig);
    this.trackRequests = options.trackRequests ?? true;
    this.trackErrors = options.trackErrors ?? true;
    this.enableMetrics = options.enableMetrics ?? true;
    this.excludePaths = options.excludePaths ?? ['/health', '/metrics'];
  }

  // Main middleware for Express
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.isEnabled() || this.shouldExclude(req.path)) {
        return next();
      }

      const startTime = Date.now();
      
      if (this.trackRequests) {
        this.log(`Request ${req.method} ${req.path} started`);
      }

      // Track response
      const plugin = this;
      const originalSend = res.send;
      res.send = function(body: any) {
        const duration = Date.now() - startTime;
        
        if (plugin.trackRequests) {
          plugin.log(`Request ${req.method} ${req.path} completed in ${duration}ms with status ${res.statusCode}`);
        }
        
        return originalSend.call(this, body);
      };

      next();
    };
  }

  // Error handling middleware
  errorMiddleware() {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      if (this.trackErrors && this.isEnabled()) {
        this.log(`Error in ${req.method} ${req.path}:`, err.message);
      }
      
      // Add BundleUp error tracking headers
      if (this.isEnabled()) {
        res.setHeader('X-BundleUp-Error', 'true');
        res.setHeader('X-BundleUp-Error-Time', new Date().toISOString());
      }
      
      next(err);
    };
  }

  // Install plugin on Express app
  install(app: Application) {
    if (!this.isEnabled()) {
      return;
    }

    this.log('Installing BundleUp Express plugin');

    // Add request tracking middleware
    app.use(this.middleware());

    // Add metrics endpoint
    if (this.enableMetrics) {
      app.get('/bundleup/metrics', (_req: Request, res: Response) => {
        res.json({
          bundleup: {
            version: '1.0.0',
            enabled: this.isEnabled(),
            config: this.getConfig(),
            timestamp: new Date().toISOString(),
          },
        });
      });
    }

    // Add error handling middleware (should be last)
    app.use(this.errorMiddleware());
  }

  private shouldExclude(path: string): boolean {
    return this.excludePaths.some(excludePath => path.startsWith(excludePath));
  }
}

export function createExpressBundleUpPlugin(options: ExpressBundleUpOptions = {}) {
  return new ExpressBundleUpPlugin(options);
}

// Helper function to quickly set up BundleUp with Express
export function setupBundleUp(app: Application, options: ExpressBundleUpOptions = {}) {
  const plugin = new ExpressBundleUpPlugin(options);
  plugin.install(app);
  return plugin;
}

export * from '@bundleup/common';