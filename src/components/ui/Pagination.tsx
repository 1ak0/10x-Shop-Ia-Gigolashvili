interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

type PageItem = number | "gap-start" | "gap-end";

/** ‹ 1 2 3 … 10 › — always shows first, last and the pages around the current one. */
function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("gap-start");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("gap-end");
  items.push(totalPages);
  return items;
}

const baseButton =
  "focus-ring grid size-11 place-items-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-35";

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        className={`${baseButton} hover:bg-muted`}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      {getPageItems(page, totalPages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${baseButton} ${item === page ? "bg-accent font-semibold text-on-accent" : "text-ink hover:bg-muted"}`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="grid size-11 place-items-center text-ink-soft" aria-hidden="true">
            …
          </span>
        ),
      )}
      <button
        type="button"
        className={`${baseButton} hover:bg-muted`}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
