import type { ReactNode } from "react";
import { InfoIcon, SparkleIcon } from "./Icons";

interface StatusMessageProps {
  title: string;
  description?: string;
  tone?: "neutral" | "error";
  /** Actions (buttons / links) rendered under the text — composition via children. */
  children?: ReactNode;
}

/** Shared look for Empty and Error states. */
export function StatusMessage({ title, description, tone = "neutral", children }: StatusMessageProps) {
  const isError = tone === "error";

  return (
    <div
      role={isError ? "alert" : undefined}
      className="mx-auto flex max-w-md animate-fade-in flex-col items-center px-4 py-16 text-center sm:py-24"
    >
      <span
        className={`mb-5 grid size-14 place-items-center rounded-full ${
          isError ? "bg-danger/10 text-danger" : "bg-muted text-gold"
        }`}
      >
        {isError ? <InfoIcon width={26} height={26} /> : <SparkleIcon width={26} height={26} />}
      </span>
      <h2 className="text-3xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-ink-soft">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
