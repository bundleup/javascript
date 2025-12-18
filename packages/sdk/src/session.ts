interface SessionCreateRequest {
  integrationId: string;
  externalId?: string;
  metadata?: Record<string, any>;
  redirectUri?: string;
}

interface SessionCreateResponse {
  url: string;
  token: string;
  expires_in: number;
  external_id?: string;
}

export class Sessions {
  constructor(private apiKey: string) {}

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Create a new session.
   * @param params - The session creation parameters.
   * @returns A promise that resolves to the created session details.
   * @throws If the fetch request fails.
   */
  public async create(
    params: SessionCreateRequest
  ): Promise<SessionCreateResponse> {
    const response = await fetch("https://api.bundleup.io/v1/sessions", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to create session");
    }

    const data = await response.json();
    return data as SessionCreateResponse;
  }
}
