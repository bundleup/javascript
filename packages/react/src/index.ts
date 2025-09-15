import { useCallback, useEffect, useState } from "react";
import {
  type AuthenticateWithPopupOptions,
  authenticateWithPopup,
} from "@bundleup/core/client";

import { logger } from "@bundleup/core/utils";

type CallbackResponse = { success: true } | { success: false; error: Error };
type CallbackFn = (response: CallbackResponse) => void;

export function useBundleup(
  callback: CallbackFn,
  opts: AuthenticateWithPopupOptions = {}
) {
  const [options, setOptions] = useState(opts);

  useEffect(() => {
    setOptions(opts);
  }, [opts]);

  const log = useCallback(
    (msg: string, ...args: any[]) => logger(!!options.debug)(msg, ...args),
    [options.debug]
  );

  const start = useCallback(
    (token: string) => {
      if (!token) {
        log("No token provided, skipping BundleUp authentication.");
        return;
      }

      authenticateWithPopup(token, options)
        .then(() => {
          log("BundleUp authentication successful.");
          callback({ success: true });
        })
        .catch((error) => {
          log("BundleUp authentication failed:", error?.message || error);
          callback({ success: false, error });
        });
    },
    [options, callback]
  );

  return { start };
}
