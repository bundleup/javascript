export abstract class Base<T> {
  protected abstract path: string;
  protected apiKey: string;
  protected baseUrl = 'https://api.bundleup.io';
  protected version = 'v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  protected get apiUrl(): string {
    return `${this.baseUrl}/${this.version}`;
  }

  protected get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async list<K extends Record<string, any>>(params: K = {} as K): Promise<T[]> {
    const response = await fetch(`${this.apiUrl}${this.path}`, {
      method: 'GET',
      headers: this.headers,
      body: JSON.stringify({
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${this.path}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T[];
  }

  async create<K extends Record<string, any>>(body: K): Promise<T> {
    const response = await fetch(`${this.apiUrl}${this.path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${this.path}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  async retrieve(id: string): Promise<T> {
    const response = await fetch(`${this.apiUrl}${this.path}/${id}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve ${this.path}/${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  async update<K extends Record<string, any>>(id: string, body: K): Promise<T> {
    const response = await fetch(`${this.apiUrl}${this.path}/${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${this.path}/${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  async del(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}${this.path}/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${this.path}/${id}: ${response.statusText}`);
    }
  }
}