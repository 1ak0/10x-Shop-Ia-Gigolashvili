import { Component, type ErrorInfo, type ReactNode } from "react";
import { buttonClasses } from "./ui/buttonStyles";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const RELOAD_FLAG = "reloaded-after-deploy";

/** True when a lazy page file could not be loaded — usually an old tab after a new deploy. */
function isOldVersionError(error: Error): boolean {
  return /dynamically imported module|Importing a module script failed/i.test(error.message);
}

/**
 * Catches render errors in its children and shows a fallback instead of a blank page.
 * Must be a class: there is no hook equivalent of getDerivedStateFromError / componentDidCatch.
 * (It does not catch errors in event handlers or async code — those are handled where they happen.)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // After a new deploy, an old tab may ask for page files that no longer exist.
    // Reload once to get the new version instead of showing the error screen.
    try {
      if (isOldVersionError(error) && !sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
        return;
      }
    } catch {
      /* storage blocked — show the fallback below */
    }

    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="container-page flex flex-col items-center py-24 text-center">
          <p className="eyebrow text-accent">Unexpected error</p>
          <h1 className="mt-2 text-4xl font-semibold">Something went wrong.</h1>
          <p className="mt-3 max-w-md text-ink-soft">
            Sorry about that. Reloading the page usually fixes it — your cart is saved.
          </p>
          <button type="button" onClick={() => window.location.reload()} className={buttonClasses("primary", "md", "mt-6")}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}