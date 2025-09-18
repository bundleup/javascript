import { useCallback } from "react";
import {
  type AuthenticateWithPopupOptions,
  authenticateWithPopup,
} from "@bundleup/core/client";

import { logger } from "@bundleup/core/utils";

export function useBundleup(options: AuthenticateWithPopupOptions = {}) {
  const log = useCallback(
    (msg: string, ...args: any[]) => logger(!!options.debug)(msg, ...args),
    [options.debug],
  );

  const connect = useCallback(
    async (token: string) => {
      if (!token) {
        log('No token provided, skipping BundleUp authentication.');
        return;
      }

      try {
        log('Starting BundleUp authentication with token:', token);

        const result = await authenticateWithPopup(token, options);

        log('BundleUp authentication successful:', result);

        return { success: true, data: result };
      } catch (error) {
        log('Error occurred while starting authentication:', error);

        return { success: false, error: error as Error };
      }
    },
    [options, log],
  );

  return { connect };
}
