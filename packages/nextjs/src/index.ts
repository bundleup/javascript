import { BundleUpCore, type PluginOptions } from '@bundleup/common';

export interface NextJsBundleUpOptions extends PluginOptions {
  enableWebpack?: boolean;
  trackPageViews?: boolean;
  optimizeImages?: boolean;
}

export class NextJsBundleUpPlugin extends BundleUpCore {
  private enableWebpack: boolean;

  constructor(options: NextJsBundleUpOptions = {}) {
    super(options.bundleUpConfig);
    this.enableWebpack = options.enableWebpack ?? true;
  }

  // Next.js specific webpack configuration
  extendWebpackConfig(config: any, { isServer }: { isServer: boolean }) {
    if (!this.enableWebpack || !this.isEnabled()) {
      return config;
    }

    this.log('Extending webpack config', { isServer });

    // Add BundleUp specific optimizations
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@bundleup/runtime': '@bundleup/common',
    };

    return config;
  }

  // Next.js plugin function
  createNextJsConfig(nextConfig: any = {}) {
    const bundleUp = this;

    return {
      ...nextConfig,
      webpack(config: any, options: any) {
        config = bundleUp.extendWebpackConfig(config, options);
        
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        
        return config;
      },
      async headers() {
        const headers = await (nextConfig.headers?.() || []);
        
        if (bundleUp.isEnabled()) {
          headers.push({
            source: '/(.*)',
            headers: [
              {
                key: 'X-BundleUp-Version',
                value: '1.0.0',
              },
            ],
          });
        }
        
        return headers;
      },
    };
  }
}

export function createNextJsBundleUpPlugin(options: NextJsBundleUpOptions = {}) {
  return new NextJsBundleUpPlugin(options);
}

export function withBundleUp(nextConfig: any = {}, options: NextJsBundleUpOptions = {}) {
  const plugin = new NextJsBundleUpPlugin(options);
  return plugin.createNextJsConfig(nextConfig);
}

export * from '@bundleup/common';