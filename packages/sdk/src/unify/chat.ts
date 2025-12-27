import { Base, type Params, type Response } from "./base";

export class Chat extends Base {
  protected namespace = "chat";

  /**
   * Fetch chat channels with optional query parameters.
   * @param limit - Maximum number of channels to retrieve.
   * @param after - Cursor for pagination.
   * @param includeRaw - Whether to include raw response data.
   * @returns A promise that resolves to the fetch response.
   */
  async channels({ limit = 100, after, includeRaw }: Params = {}) {
    const url = this.buildUrl("channels", { limit, after });

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "BU-Include-Raw": includeRaw ? "true" : "false",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url.toString()}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Response<
      Array<{
        id: string;
        name: string;
      }>
    >;
  }
}
