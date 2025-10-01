export class Request {
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

  get(path: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${path}?${queryString}` : path;

    return fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: this.headers,
    });
  }

  post(path: string, body: Record<string, any> = {}) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
  }

  put(path: string, body: Record<string, any> = {}) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    });
  }

  patch(path: string, body: Record<string, any> = {}) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body),
    });
  }

  delete(path: string) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    });
  }
}