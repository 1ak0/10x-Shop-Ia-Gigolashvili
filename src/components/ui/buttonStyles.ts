export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "focus-ring inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent shadow-soft hover:bg-accent-strong",
  secondary: "border border-line bg-surface text-ink hover:border-ink/30 hover:bg-muted",
  ghost: "text-ink-soft hover:bg-muted hover:text-ink",
  danger: "text-danger hover:bg-danger/10",
};

// min-h-11 = 44px touch target on every size except "sm" (used only on desktop toolbars)
const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-[0.95rem]",
};

/** Shared by <Button> and by router <Link>s that should look like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`.trim();
}
