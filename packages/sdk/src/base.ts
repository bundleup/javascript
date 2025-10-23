import { isObject } from "./utils";

export abstract class Base<T> {
  protected abstract path: string;
  private baseUrl = "https://api.bundleup.io";
  private version = "v1";

  constructor(private apiKey: string) {}

  protected get apiUrl(): string {
    return `${this.baseUrl}/${this.version}`;
  }

  protected get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * List resources with optional query parameters.
   * @param params - Query parameters for filtering the list.
   * @returns A promise that resolves to an array of resources.
   * @throws If params is not an object or if the fetch request fails.
   */
  public async list<K extends Record<string, any>>(
    params: K = {} as K
  ): Promise<T[]> {
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

  /**
   * Create a new resource.
   * @param body - The request body containing resource details.
   * @returns A promise that resolves to the created resource.
   * @throws If body is not an object or if the fetch request fails.
   */
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

  /**
   * Retrieve a specific resource by ID.
   * @param id - The ID of the resource to retrieve.
   * @returns A promise that resolves to the retrieved resource.
   * @throws If id is not provided or if the fetch request fails.
   */
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

  /**
   * Update a specific resource by ID.
   * @param id - The ID of the resource to update.
   * @param body - The request body containing updated resource details.
   * @returns A promise that resolves to the updated resource.
   * @throws If id is not provided, if body is not an object, or if the fetch request fails.
   */
  public async update<K extends Record<string, any>>(
    id: string,
    body: K
  ): Promise<T> {
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

  /**
   * Delete a specific resource by ID.
   * @param id - The ID of the resource to delete.
   * @returns A promise that resolves when the resource is deleted.
   * @throws If id is not provided or if the fetch request fails.
   */
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
