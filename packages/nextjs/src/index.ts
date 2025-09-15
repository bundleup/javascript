"use server";

import { BundleUp } from "@bundleup/common/server";
import { isTrue } from "@bundleup/common/utils";

export interface CreateConnectionParams {
  apiKey?: string;
  debug?: boolean;
  integrationId: string;
  externalId: string;
  metadata?: Record<string, unknown>;
}

export function createConnection(options: CreateConnectionParams) {
  const bundleup = new BundleUp({
    apiKey: options.apiKey ?? process.env.BUNDLEUP_API_KEY,
    debug: options.debug ?? isTrue(process.env.BUNDLEUP_DEBUG),
  });

  return bundleup.createConnection(options.integrationId, {
    externalId: options.externalId,
    metadata: options.metadata,
  });
}
