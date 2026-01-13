import { isObject } from "../utils";

export interface Params {
  limit?: number;
  after?: string;
  includeRaw?: boolean;
}

export interface Response<T> {
  data: T;
  _raw?: any;
  metadata: {
    next: string | null;
  };
}

export abstract class Base {
  private baseUrl = "https://unify.bundleup.io";
  private version = "v1";

  protected abstract namespace: string;

  protected get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "BU-Connection-Id": this.connectionId,
    };
  }

  protected buildUrl(
    path?: string | null,
    searchParams: Record<string, any> = {}
  ): URL {
    if (!isObject(searchParams)) {
      throw new Error("URL search params must be an object.");
    }

    const parts = [this.version, this.namespace, path]
      .filter(Boolean)
      .join("/");

    const url = new URL(parts, this.baseUrl);
    url.search = new URLSearchParams(searchParams).toString();

    return url;
  }

  constructor(private apiKey: string, private connectionId: string) {}
}
