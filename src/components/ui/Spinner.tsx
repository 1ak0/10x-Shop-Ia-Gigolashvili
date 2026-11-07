interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-24 text-ink-soft">
      <span className="size-8 animate-spin rounded-full border-2 border-line border-t-accent" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
