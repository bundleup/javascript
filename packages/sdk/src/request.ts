import { isObject } from "./utils";

export class Request {
  private baseUrl = "https://api.bundleup.com/v1";

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "BU-Connection-Id": this.connectionId,
    };
  }

  constructor(private apiKey: string, private connectionId: string) {}

  private buildUrl(path: string, searchParams: Record<string, any> = {}): URL {
    if (!path) {
      throw new Error("Path is required to build URL.");
    }

    if (!isObject(searchParams)) {
      throw new Error("URL search params must be an object.");
    }

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    const url = new URL(path, this.baseUrl);
    url.search = new URLSearchParams(searchParams).toString();

    return url;
  }

  public get(
    path: string,
    searchParams: Record<string, any> = {},
    headers: Record<string, string> = {}
  ) {
    if (!path) {
      throw new Error("Path is required for GET request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    if (!isObject(searchParams)) {
      throw new Error("URL search params must be an object.");
    }

    const url = this.buildUrl(path, searchParams);

    return fetch(url, {
      method: "GET",
      headers: { ...this.headers, ...headers },
    });
  }

  public post(
    path: string,
    body: Record<string, any> = {},
    headers: Record<string, string> = {}
  ) {
    if (!path) {
      throw new Error("Path is required for POST request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    if (!isObject(body)) {
      throw new Error("Request body must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      method: "POST",
      headers: { ...this.headers, ...headers },
      body: JSON.stringify(body),
    });
  }

  public put(
    path: string,
    body: Record<string, any> = {},
    headers: Record<string, string> = {}
  ) {
    if (!path) {
      throw new Error("Path is required for PUT request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    if (!isObject(body)) {
      throw new Error("Request body must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      method: "PUT",
      headers: { ...this.headers, ...headers },
      body: JSON.stringify(body),
    });
  }

  patch(
    path: string,
    body: Record<string, any> = {},
    headers: Record<string, string> = {}
  ) {
    if (!path) {
      throw new Error("Path is required for PATCH request.");
    }

    if (!isObject(headers)) {
      throw new Error("Headers must be an object.");
    }

    if (!isObject(body)) {
      throw new Error("Request body must be an object.");
    }

    const url = this.buildUrl(path);

    return fetch(url, {
      method: "PATCH",
      headers: { ...this.headers, ...headers },
      body: JSON.stringify(body),
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
