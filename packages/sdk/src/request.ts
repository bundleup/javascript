export class BURequest {
  constructor(private apiKey: string, private connectionId: string) {}

  protected get baseUrl(): string {
    return 'https://req.bundleup.io';
  }

  protected get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'BU-Connection-Id': this.connectionId,
    };
  }

  async get(path: string, params: Record<string, any> = {}): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${path}?${queryString}` : path;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  async post(path: string, body: Record<string, any> = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to post to ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  async put(path: string, body: Record<string, any> = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to put to ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  async patch(path: string, body: Record<string, any> = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to patch ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(path: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${path}: ${response.statusText}`);
    }

    return response.json();
  }
}