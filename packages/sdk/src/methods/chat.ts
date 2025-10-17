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

  /**
   * Send a chat message to a specific channel.
   * @param params - The parameters for sending a chat message.
   * @param params.channelId - The ID of the channel to send the message to.
   * @param params.content - The content of the chat message.
   * @returns The response from the API.
   * @throws If channelId or content is missing.
   */
  public message({ channelId, content }: ChatMessageRequest) {
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
