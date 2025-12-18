"use client";

import { useBundleup } from "@bundleup/nextjs/react";
import { createConnectionSession } from "./actions";

export default function ConnectButton() {
  const { connect } = useBundleup({ debug: true });

  return (
    <button
      onClick={async () => {
        const token = await createConnectionSession();
        const { success, data, error } = await connect(token);

        if (success) {
          console.log("Connection successful:", data?.connectionId);
        } else {
          console.error("Connection failed:", error);
        }
      }}
      className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
    >
      Connect Slack
    </button>
  );
}
