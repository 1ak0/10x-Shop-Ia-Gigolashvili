import { ApiError, isAbortError } from "./ApiError";

/**
 * Small typed wrapper around fetch.
 * - one place for the base URL and error handling
 * - generic get<T>() so every response is typed at the call site
 */
export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response;

    try {
      response = await fetch(this.baseUrl + path, {
        ...init,
        headers: { Accept: "application/json" },
      });
    } catch (error: unknown) {
      // An aborted request is not a real error — let the caller ignore it.
      if (isAbortError(error)) throw error;
      throw new ApiError(0, "We couldn't reach the store. Please check your connection and try again.");
    }

    if (!response.ok) {
      const message =
        response.status === 404 ? "We couldn't find what you were looking for." : `Request failed (${response.status}).`;
      throw new ApiError(response.status, message);
    }

    return (await response.json()) as T;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal });
  }
}

export const api = new ApiClient("https://dummyjson.com");
