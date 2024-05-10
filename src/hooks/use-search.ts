import { useSearch as useSearchWouter } from "wouter";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function useSearch<T extends Object>(): T {
  const numericRegex = /^[0-9]$/;
  const search = useSearchWouter();
  const keypairs =
    search === ""
      ? [["page", 1]]
      : search.split("&").map((x) => {
          const [key, value] = x.split("=");
          return [
            key,
            numericRegex.test(value) ? Number.parseInt(value) : value,
          ];
        });

  return Object.fromEntries(keypairs);
}
