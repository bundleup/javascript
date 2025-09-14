import { useEffect, useRef } from 'react';
import { BundleUpCore, type BundleUpConfig, type PluginOptions } from '@bundleup/common';

export interface ReactBundleUpOptions extends PluginOptions {
  enableHooks?: boolean;
  trackRendering?: boolean;
}

export class ReactBundleUpPlugin extends BundleUpCore {
  constructor(options: ReactBundleUpOptions = {}) {
    super(options.bundleUpConfig);
  }

  // React Hook for tracking component lifecycle
  createTrackingHook() {
    return function useBundleUpTracking(componentName: string) {
      const renderCount = useRef(0);
      
      useEffect(() => {
        renderCount.current += 1;
        console.log(`[BundleUp React] ${componentName} rendered ${renderCount.current} times`);
      });

      return {
        renderCount: renderCount.current,
      };
    };
  }
}

export function createReactBundleUpPlugin(options: ReactBundleUpOptions = {}) {
  return new ReactBundleUpPlugin(options);
}

// React Hook for BundleUp integration
export function useBundleUp(config?: BundleUpConfig) {
  const bundleUp = useRef<BundleUpCore>();
  
  if (!bundleUp.current) {
    bundleUp.current = new BundleUpCore(config);
  }

  return bundleUp.current;
}

export * from '@bundleup/common';