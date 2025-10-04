import { Request } from "../request";

export type ChatMessageRequest = {
  channelId: string;
  content: string;
};

export class Chat extends Request {
  message({ channelId, content }: ChatMessageRequest) {
    if (!channelId) {
      throw new Error("Channel ID is required to send a chat message.");
    }

    if (!content) {
      throw new Error("Content is required to send a chat message.");
    }

    return this.post(
      "/",
      { channelId, content },
      { "BU-Method": "chat.message" }
    );
  }
}
