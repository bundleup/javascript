import { inject, type App, type InjectionKey } from 'vue';
import { BundleUpCore, type PluginOptions } from '@bundleup/common';

export interface VueBundleUpOptions extends PluginOptions {
  enableVueDevtools?: boolean;
  trackComponents?: boolean;
}

export class VueBundleUpPlugin extends BundleUpCore {
  private trackComponents: boolean;

  constructor(options: VueBundleUpOptions = {}) {
    super(options.bundleUpConfig);
    this.trackComponents = options.trackComponents ?? false;
  }

  // Vue plugin installation
  install(app: App) {
    if (!this.isEnabled()) {
      return;
    }

    this.log('Installing BundleUp Vue plugin');

    // Provide BundleUp instance globally
    app.provide(BundleUpKey, this);

    // Add global properties
    app.config.globalProperties.$bundleUp = this;

    // Track component registrations if enabled
    if (this.trackComponents) {
      const originalComponent = app.component;
      app.component = function(name: string, component?: any) {
        if (component) {
          console.log(`[BundleUp Vue] Registering component: ${name}`);
        }
        return originalComponent.call(this, name, component);
      };
    }
  }
}

// Injection key for Vue's provide/inject
export const BundleUpKey: InjectionKey<VueBundleUpPlugin> = Symbol('BundleUp');

export function createVueBundleUpPlugin(options: VueBundleUpOptions = {}) {
  return new VueBundleUpPlugin(options);
}

// Vue composition API composable
export function useBundleUp() {
  const bundleUp = inject(BundleUpKey);
  
  if (!bundleUp) {
    throw new Error('BundleUp plugin not installed. Please install the plugin in your Vue app.');
  }

  return {
    bundleUp,
    isEnabled: bundleUp.isEnabled(),
    config: bundleUp.getConfig(),
    log: bundleUp.log.bind(bundleUp),
  };
}

// Vue plugin factory
export default function(options: VueBundleUpOptions = {}) {
  return createVueBundleUpPlugin(options);
}

export * from '@bundleup/common';