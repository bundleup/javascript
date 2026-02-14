import { isObject } from './utils';

export abstract class Base<T> {
  protected abstract namespace: string;
  private baseUrl = 'https://api.bundleup.io';
  private version = 'v1';

  constructor(private apiKey: string) {}

  protected buildUrl(path?: string | null, searchParams: Record<string, string> = {}): URL {
    if (!isObject(searchParams)) {
      throw new Error('URL search params must be an object.');
    }

    const parts = [this.version, this.namespace, path].filter(Boolean).join('/');

    searchParams = Object.entries(searchParams).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const url = new URL(parts, this.baseUrl);
    url.search = new URLSearchParams(searchParams).toString();

    return url;
  }

  protected get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * List resources with optional query parameters.
   * @param searchParams - Query parameters for filtering the list.
   * @returns A promise that resolves to an array of resources.
   * @throws If params is not an object or if the fetch request fails.
   */
  public async list<K extends Record<string, string>>(searchParams: K = {} as K): Promise<T[]> {
    if (!isObject(searchParams)) {
      throw new Error('List parameters must be an object.');
    }

    const url = this.buildUrl(null, searchParams);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url.toString()}: ${response.statusText}`);
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
  public async create<K extends Record<string, unknown>>(body: K): Promise<T> {
    if (!isObject(body)) {
      throw new Error('Request body must be an object.');
    }

    const url = this.buildUrl(null);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${url.toString()}: ${response.statusText}`);
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
      throw new Error('ID is required to retrieve a resource.');
    }

    const url = this.buildUrl(id);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve ${url.toString()}: ${response.statusText}`);
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
  public async update<K extends Record<string, unknown>>(id: string, body: K): Promise<T> {
    if (!id) {
      throw new Error('ID is required to update a resource.');
    }

    if (!isObject(body)) {
      throw new Error('Request body must be an object.');
    }

    const url = this.buildUrl(id);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${url.toString()}: ${response.statusText}`);
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
      throw new Error('ID is required to delete a resource.');
    }

    const url = this.buildUrl(id);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${url.toString()}: ${response.statusText}`);
    }
  }
}
