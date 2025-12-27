import { Base, type Params, type Response } from "./base";

interface RepoParams extends Params {
  repoName: string;
}

export class Git extends Base {
  protected namespace = "git";

  /**
   * Fetch repositories with optional query parameters.
   * @param limit - Maximum number of repositories to retrieve.
   * @param after - Cursor for pagination.
   * @param includeRaw - Whether to include raw response data.
   * @returns A promise that resolves to the fetch response.
   */
  async repos({ limit = 100, after, includeRaw }: Params = {}) {
    const url = this.buildUrl("repos", { limit, after });

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "BU-Include-Raw": includeRaw ? "true" : "false",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url.toString()}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Response<
      Array<{
        id: string;
        name: string;
        full_name: string;
        description: string | null;
        created_at: string;
        updated_at: string;
      }>
    >;
  }

  /**
   * Fetch pull requests for a specific repository.
   * @param repoName - The name of the repository.
   * @param limit - Maximum number of pull requests to retrieve.
   * @param after - Cursor for pagination.
   * @param includeRaw - Whether to include raw response data.
   * @returns A promise that resolves to the fetch response.
   * @throws If repoName is not provided.
   */
  async pulls({ repoName, limit = 100, after, includeRaw }: RepoParams) {
    if (!repoName) {
      throw new Error("repoName is required to fetch pulls.");
    }

    const url = this.buildUrl(`repos/${encodeURIComponent(repoName)}/pulls`, {
      limit,
      after,
    });

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "BU-Include-Raw": includeRaw ? "true" : "false",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url.toString()}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Response<
      Array<{
        id: string;
        number: number;
        title: string;
        state: string;
        created_at: string;
        updated_at: string;
        merged_at: string | null;
      }>
    >;
  }

  /**
   * Fetch tags for a specific repository.
   * @param repoName - The name of the repository.
   * @param limit - Maximum number of tags to retrieve.
   * @param after - Cursor for pagination.
   * @param includeRaw - Whether to include raw response data.
   * @returns A promise that resolves to the fetch response.
   * @throws If repoName is not provided.
   */
  async tags({ repoName, limit = 100, after, includeRaw }: RepoParams) {
    if (!repoName) {
      throw new Error("repoName is required to fetch tags.");
    }

    const url = this.buildUrl(`repos/${encodeURIComponent(repoName)}/tags`, {
      limit,
      after,
    });

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "BU-Include-Raw": includeRaw ? "true" : "false",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url.toString()}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Response<
      Array<{
        name: string;
        commit_sha: string;
      }>
    >;
  }
}
