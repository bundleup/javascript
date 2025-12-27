import { Connections } from "./connection";
import { Integrations } from "./integration";
import { Webhooks } from "./webhooks";
import { Proxy } from "./proxy";
import { Sessions } from "./session";

// Unify imports
import { Chat } from "./unify/chat";
import { Git } from "./unify/git";

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
   * Access the Sessions resource.
   */
  get sessions() {
    return new Sessions(this.apiKey);
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
    };
  }
}
