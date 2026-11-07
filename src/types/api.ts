/**
 * One shape for every async request in the app (discriminated union).
 * Components switch on `status`, so TypeScript knows `data` only exists on success.
 */
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string; code: number | null };
