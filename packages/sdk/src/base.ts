import { isObject } from "./utils";

export abstract class Base<T> {
  protected abstract path: string;
  private baseUrl = "https://api.bundleup.io";
  private version = "v1";

  constructor(private apiKey: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/${this.version}`;
  }

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  public async list<K extends Record<string, any>>(params: K = {} as K): Promise<T[]> {
    if (!isObject(params)) {
      throw new Error("List parameters must be an object.");
    }

    const response = await fetch(`${this.apiUrl}${this.path}`, {
      method: "GET",
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

  public async create<K extends Record<string, any>>(body: K): Promise<T> {
    if (!isObject(body)) {
      throw new Error("Request body must be an object.");
    }

    const response = await fetch(`${this.apiUrl}${this.path}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${this.path}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  public async retrieve(id: string): Promise<T> {
    if (!id) {
      throw new Error("ID is required to retrieve a resource.");
    }

    const response = await fetch(`${this.apiUrl}${this.path}/${id}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve ${this.path}/${id}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  }

  public async update<K extends Record<string, any>>(id: string, body: K): Promise<T> {
    if (!id) {
      throw new Error("ID is required to update a resource.");
    }
    
    if (!isObject(body)) {
      throw new Error("Request body must be an object.");
    }

    const response = await fetch(`${this.apiUrl}${this.path}/${id}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update ${this.path}/${id}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  }

  public async del(id: string): Promise<void> {
    if (!id) {
      throw new Error("ID is required to delete a resource.");
    }

    const response = await fetch(`${this.apiUrl}${this.path}/${id}`, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete ${this.path}/${id}: ${response.statusText}`
      );
    }
  }
}
