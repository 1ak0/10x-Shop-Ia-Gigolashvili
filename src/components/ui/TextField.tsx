import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

/** Label + input + error message, wired together for screen readers (htmlFor / aria-describedby). */
export function TextField({ id, label, error, hint, className = "", ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-12 w-full rounded-xl border bg-surface px-4 text-[0.95rem] text-ink transition-colors placeholder:text-ink-soft/70 focus:outline-none focus-visible:ring-2 ${
          error
            ? "border-danger focus-visible:ring-danger/25"
            : "border-line hover:border-ink/30 focus-visible:border-accent focus-visible:ring-accent/20"
        }`}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
