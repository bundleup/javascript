import { isObject } from "./utils";

export class Proxy {
  private baseUrl = "https://proxy.bundleup.io";

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "BU-Connection-Id": this.connectionId,
    };
  }

  constructor(
    private apiKey: string,
    private connectionId: string,
  ) {}

  private buildUrl(
    path: string,
    searchParams?: Record<string, string>,
  ): URL {
    if (!path) {
      throw new Error("Path is required to build URL.");
    }

    if (searchParams !== undefined && !isObject(searchParams)) {
      throw new Error("URL search params must be an object.");
    }

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    const url = new URL(path, this.baseUrl);
    // Only override search params if explicitly provided
    if (searchParams !== undefined) {
      url.search = new URLSearchParams(searchParams).toString();
    }

    return url;
  }

  public get(
    path: string,
    headers: Record<string, string> = {},
  ) {
    if (!path) {
      throw new Error("Path is required for GET request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      method: "GET",
      headers: { ...this.headers, ...headers },
    });
  }

  public post(
    path: string,
    body: BodyInit,
    headers: Record<string, string> = {},
  ) {
    if (!path) {
      throw new Error("Path is required for POST request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      body,
      method: "POST",
      headers: { ...this.headers, ...headers },
    });
  }

  public put(
    path: string,
    body: BodyInit,
    headers: Record<string, string> = {},
  ) {
    if (!path) {
      throw new Error("Path is required for PUT request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      body,
      method: "PUT",
      headers: { ...this.headers, ...headers },
    });
  }

  public patch(
    path: string,
    body: BodyInit,
    headers: Record<string, string> = {},
  ) {
    if (!path) {
      throw new Error("Path is required for PATCH request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      body,
      method: "PATCH",
      headers: { ...this.headers, ...headers },
    });
  }

  public delete(path: string, headers: Record<string, string> = {}) {
    if (!path) {
      throw new Error("Path is required for DELETE request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      method: "DELETE",
      headers: { ...this.headers, ...headers },
    });
  }
}
