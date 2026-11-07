import { MinusIcon, PlusIcon } from "./Icons";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md";
}

/** − value + ; the edge buttons are disabled at min / max. */
export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
  label = "Quantity",
  size = "md",
}: QuantityStepperProps) {
  const box = size === "sm" ? "size-9" : "size-11";
  const buttonClass = `focus-ring grid ${box} place-items-center rounded-full text-ink transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-ink-soft/40 disabled:hover:bg-transparent`;

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface" role="group" aria-label={label}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
