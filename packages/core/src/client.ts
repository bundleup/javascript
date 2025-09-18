import { isClient, logger } from './utils';

export interface AuthenticateWithPopupOptions {
  width?: number;
  height?: number;
  debug?: boolean;
}

export function authenticateWithPopup(
  token: string,
  options: AuthenticateWithPopupOptions = {},
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('Token is required'));
    }

    const width = options?.width ?? 500;
    const height = options?.height ?? 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const debug = options?.debug ?? false;

    const client = isClient();
    const log = logger(debug);

    if (!client) {
      log('Authentication failed: not in client environment');

      return reject(
        new Error(
          'authenticateWithPopup can only be used in a client environment',
        ),
      );
    }

    log('Starting authentication with popup');

    // Open the popup window
    const popup = window.open(
      `https://auth.bundleup.io/${token}`,
      'bundleup-auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    );

    if (!popup) {
      log('Failed to open popup window. Please check popup blocker settings.');

      return reject(
        new Error(
          'Failed to open popup window. Please check popup blocker settings.',
        ),
      );
    }

    // Handle messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://auth.bundleup.io') {
        return;
      }

      if (!event.data?.type) {
        return;
      }

      cleanup();
      popup.close();

      if (event.data.type === 'bundleup:success') {
        log('Authentication successful');
        return resolve(event.data.data);
      }

      if (event.data.type === 'bundleup:error') {
        log('Authentication failed', event.data.message);
        return reject(new Error(event.data.message || 'Authentication failed'));
      }
    };

    // Check if the popup is closed by the user
    const checkClosed = setInterval(() => {
      if (!popup.closed) {
        return;
      }

      cleanup();
      log('Authentication popup closed by user');
      reject(new Error('Authentication popup was closed by user'));
    }, 1000);

    // Cleanup function to remove event listeners and intervals
    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkClosed);
    };

    // Listen for messages from the popup
    window.addEventListener('message', handleMessage);

    // Handle popup blocked or closed immediately
    setTimeout(() => {
      if (!popup.closed) {
        return;
      }

      cleanup();
      log('Authentication popup was blocked or closed immediately');
      reject(new Error('Popup was blocked or closed immediately'));
    }, 100);
  });
}
