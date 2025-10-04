import { Connections } from "./connection";
import { Integrations } from "./integration";
import { Webhooks } from "./webhooks";
import { Request } from "./request";
import { Chat } from "./methods/chat";

export class BundleUp {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required to initialize BundleUp SDK.");
    }

    this.apiKey = apiKey;
  }

  get connections() {
    return new Connections(this.apiKey);
  }

  get integrations() {
    return new Integrations(this.apiKey);
  }

  get webhooks() {
    return new Webhooks(this.apiKey);
  }

  connect(connectionId: string) {
    if (!connectionId) {
      throw new Error("Connection ID is required to create a Fetch instance.");
    }

    return {
      req: new Request(this.apiKey, connectionId),
      chat: new Chat(this.apiKey, connectionId),
    };
  }
}
