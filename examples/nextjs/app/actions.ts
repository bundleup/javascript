"use server";

import { createConnection } from "@bundleup/nextjs";

export async function createConnectionSession() {
  const connection = await createConnection({
    integrationId: "slack",
    apiKey: process.env.BUNDLEUP_API_KEY!,
  });

  return connection.token;
}
