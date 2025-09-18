"use server";

import { BundleUp } from "@bundleup/core/server";
import { isTrue } from "@bundleup/core/utils";

export interface CreateConnectionParams {
  integrationId: string;
  apiKey?: string;
  debug?: boolean;
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export async function createConnection(options: CreateConnectionParams) {
  const bundleup = new BundleUp({
    apiKey: options.apiKey ?? process.env.BUNDLEUP_API_KEY,
    debug: options.debug ?? isTrue(process.env.BUNDLEUP_DEBUG),
  });

  return bundleup.createConnection(options.integrationId, {
    externalId: options.externalId,
    metadata: options.metadata,
  });
}
