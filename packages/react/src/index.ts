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

  /**
   * Frontend method to open popup window for authentication
   * @param token - Authentication token obtained from backend
   * @returns Promise<void> - Resolves when authentication is complete
   */
  async authenticateWithPopup(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('Token is required for authentication'));
        return;
      }

      this.log('Opening authentication popup with token');

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        reject(new Error('Authentication popup is only available in browser environment'));
        return;
      }

      // Open popup window
      const popup = window.open(
        `https://auth.bundleup.io/${token}`,
        'bundleup-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('Failed to open popup window. Please check popup blocker settings.'));
        return;
      }

      // Listen for messages from popup
      const handleMessage = (event: MessageEvent) => {
        // Security check: verify origin
        if (event.origin !== 'https://auth.bundleup.io') {
          return;
        }

        this.log('Received message from authentication popup', event.data);

        if (event.data && event.data.type === 'bundleup-auth-success') {
          // Authentication successful
          cleanup();
          popup.close();
          this.log('Authentication completed successfully');
          resolve();
        } else if (event.data && event.data.type === 'bundleup-auth-error') {
          // Authentication failed
          cleanup();
          popup.close();
          this.log('Authentication failed', event.data.error);
          reject(new Error(event.data.error || 'Authentication failed'));
        }
      };

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error('Authentication popup was closed by user'));
        }
      }, 1000);

      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
      };

      // Add message listener
      window.addEventListener('message', handleMessage);

      // Handle popup blocked or closed immediately
      setTimeout(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error('Popup was blocked or closed immediately'));
        }
      }, 100);
    });
  }

  /**
   * Complete authentication flow: request token and open popup
   * @param integrationId - The integration ID
   * @param externalId - The external ID
   * @returns Promise<void> - Resolves when authentication is complete
   */
  async authenticate(integrationId: string, externalId: string): Promise<void> {
    try {
      this.log('Starting complete authentication flow');
      
      // Step 1: Request token from backend
      const token = await this.requestAuthToken(integrationId, externalId);
      
      // Step 2: Open popup with token
      await this.authenticateWithPopup(token);
      
      this.log('Authentication flow completed successfully');
    } catch (error) {
      this.log('Authentication flow failed', error);
      throw error;
    }
  }
}

export function createReactBundleUpPlugin(options: ReactBundleUpOptions = {}) {
  return new ReactBundleUpPlugin(options);
}

// React Hook for BundleUp integration
export function useBundleUp(config?: BundleUpConfig) {
  const bundleUp = useRef<ReactBundleUpPlugin>();
  
  if (!bundleUp.current) {
    bundleUp.current = new ReactBundleUpPlugin({ bundleUpConfig: config });
  }

  return bundleUp.current;
}

// React Hook for authentication
export function useBundleUpAuth(config?: BundleUpConfig) {
  const bundleUp = useBundleUp(config);

  const authenticate = async (integrationId: string, externalId: string): Promise<void> => {
    return bundleUp.authenticate(integrationId, externalId);
  };

  const authenticateWithToken = async (token: string): Promise<void> => {
    return bundleUp.authenticateWithPopup(token);
  };

  const requestToken = async (integrationId: string, externalId: string): Promise<string> => {
    return bundleUp.requestAuthToken(integrationId, externalId);
  };

  return {
    authenticate,
    authenticateWithToken,
    requestToken,
  };
}

export * from '@bundleup/common';