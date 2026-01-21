import { Connections } from "./connection";
import { Integrations } from "./integration";
import { Webhooks } from "./webhooks";
import { Proxy } from "./proxy";

// Unify API
import { Chat } from "./unify/chat";
import { Git } from "./unify/git";
import { PM } from "./unify/pm";

export class BundleUp {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required to initialize BundleUp SDK.");
    }

    this.apiKey = apiKey;
  }

  /**
   * Access the Connections resource.
   */
  get connections() {
    return new Connections(this.apiKey);
  }

  /**
   * Access the Integrations resource.
   */
  get integrations() {
    return new Integrations(this.apiKey);
  }

  /**
   * Access the Webhooks resource.
   */
  get webhooks() {
    return new Webhooks(this.apiKey);
  }

  /**
   * Create a Proxy instance for a specific connection.
   * @param connectionId - The ID of the connection.
   * @returns A Proxy instance.
   */
  proxy(connectionId: string) {
    if (!connectionId) {
      throw new Error("Connection ID is required to create a Proxy instance.");
    }

    return new Proxy(this.apiKey, connectionId);
  }

  /**
   * Access Unify API for a specific connection.
   * @param connectionId - The ID of the connection.
   * @returns An object containing Unify methods.
   */
  unify(connectionId: string) {
    if (!connectionId) {
      throw new Error("Connection ID is required to create a Unify instance.");
    }

    return {
      chat: new Chat(this.apiKey, connectionId),
      git: new Git(this.apiKey, connectionId),
      pm: new PM(this.apiKey, connectionId),
    };
  }
}
