import { isClient, logger } from "./utils";

export interface AuthenticateWithPopupOptions {
  width?: number;
  height?: number;
  debug?: boolean;
}

export function authenticateWithPopup(
  token: string,
  options: AuthenticateWithPopupOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("Token is required"));
    }

    const width = options?.width ?? 500;
    const height = options?.height ?? 600;
    const debug = options?.debug ?? false;

    const client = isClient();
    const log = logger(debug);

    if (!client) {
      log("Authentication failed: not in client environment");

      return reject(
        new Error(
          "authenticateWithPopup can only be used in a client environment"
        )
      );
    }

    log("Starting authentication with popup");

    const popup = window.open(
      `https://auth.bundleup.io/${token}`,
      "bundleup-auth",
      `width=${width},height=${height},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      log("Failed to open popup window. Please check popup blocker settings.");

      return reject(
        new Error(
          "Failed to open popup window. Please check popup blocker settings."
        )
      );
    }

    // Handle messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://auth.bundleup.io") {
        return;
      }

      if (!event.data?.type) {
        return;
      }

      log("Received authentication message", event.data);

      cleanup();
      popup.close();

      if (event.data.type === "bundleup-auth-success") {
        log("Authentication successful");
        return resolve();
      }

      if (event.data.type === "bundleup-auth-error") {
        log("Authentication failed", event.data.error);
        return reject(new Error(event.data.error || "Authentication failed"));
      }
    };

    // Check if the popup is closed by the user
    const checkClosed = setInterval(() => {
      if (!popup.closed) {
        return;
      }

      cleanup();
      log("Authentication popup closed by user");
      reject(new Error("Authentication popup was closed by user"));
    }, 1000);

    // Cleanup function to remove event listeners and intervals
    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(checkClosed);
    };

    // Listen for messages from the popup
    window.addEventListener("message", handleMessage);

    // Handle popup blocked or closed immediately
    setTimeout(() => {
      if (!popup.closed) {
        return;
      }

      cleanup();
      log("Authentication popup was blocked or closed immediately");
      reject(new Error("Popup was blocked or closed immediately"));
    }, 100);
  });
}
