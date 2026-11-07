import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={withLabel ? undefined : nextLabel}
      title={nextLabel}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-ink-soft transition-colors hover:bg-muted hover:text-ink ${
        withLabel ? "border border-line px-4 text-sm" : "size-11"
      }`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      {withLabel && <span>{theme === "dark" ? "Light theme" : "Dark theme"}</span>}
    </button>
  );
}
