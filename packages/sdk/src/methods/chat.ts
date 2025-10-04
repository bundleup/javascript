import { Request } from "../request";

export type ChatMessageRequest = {
  channelId: string;
  content: string;
};

export class Chat {
  private req: Request;

  constructor(apiKey: string, connectionId: string) {
    this.req = new Request(apiKey, connectionId);
  }

  message({ channelId, content }: ChatMessageRequest) {
    if (!channelId) {
      throw new Error("Channel ID is required to send a chat message.");
    }

    if (!content) {
      throw new Error("Content is required to send a chat message.");
    }

    return this.req.post(
      "/",
      { channel_id: channelId, content },
      { "BU-Method": "chat.message" }
    );
  }
}
