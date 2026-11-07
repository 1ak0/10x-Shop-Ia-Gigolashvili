import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage, isAbortError, isApiError } from "../api/ApiError";
import type { AsyncState } from "../types/api";

interface UseFetchResult<T> {
  state: AsyncState<T>;
  retry: () => void;
}

/**
 * Runs `fetcher` whenever `key` changes and exposes loading / success / error.
 *
 * - AbortController: when the key changes (or the component unmounts) before the
 *   previous response arrives, that request is cancelled, so an old response can
 *   never overwrite a newer one.
 * - `key` is a string describing the request (e.g. "q=dior|category="), which keeps
 *   the dependency list simple and honest.
 */
export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>, key: string): UseFetchResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  // Always call the latest fetcher without re-running the effect on every render.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState({
          status: "error",
          message: getErrorMessage(error),
          code: isApiError(error) ? error.status : null,
        });
      });

    return () => controller.abort();
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, retry };
}
