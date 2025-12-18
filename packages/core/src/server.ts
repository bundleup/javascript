import { logger } from "./utils";
import { BundleUp as BundleUpSDK } from "@bundleup/sdk";

export interface BundleUpConfig {
  apiKey?: string;
  debug?: boolean;
}

export interface BundleUpResponse {
  token: string;
  expiresIn: number;
  externalId: string;
}

export interface ConnectionOptions {
  externalId?: string;
  redirectUri?: string;
  metadata?: Record<string, unknown>;
}

export class BundleUp {
  private client: BundleUpSDK;
  private debug: boolean;

  constructor(config: BundleUpConfig = {}) {
    if (!config.apiKey) {
      throw new Error("API key is required for authentication");
    }
    this.debug = config.debug ?? false;
    this.client = new BundleUpSDK(config.apiKey);
  }

  private log(message: string, ...args: any[]): void {
    return logger(!!this.debug)(message, ...args);
  }

  public async createConnection(
    integrationId: string,
    options: ConnectionOptions
  ) {
    this.log(`Creating connection for integration: ${integrationId}`);

    if (!integrationId) {
      this.log("Integration ID is missing");
      throw new Error("Integration ID is required to create a connection");
    }

    try {
      const data = await this.client.sessions.create({
        integrationId,
        redirectUri: options.redirectUri,
        externalId: options.externalId,
        metadata: options.metadata,
      });

      if (!data.token) {
        this.log("Invalid response: could not create token", data);
        throw new Error("Invalid response: could not create token");
      }

      this.log("Authentication token received successfully");
      return {
        token: data.token,
        url: data.auth_url,
        expiresIn: data.expires_in,
        externalId: data.external_id,
      };
    } catch (error) {
      this.log("Error creating connection", error);
      throw error;
    }
  }
}
