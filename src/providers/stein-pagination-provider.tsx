import type { useSteinPagination } from "@/hooks/use-stein-pagination";
import { type PropsWithChildren, createContext } from "react";

export const SteinPaginationStore = createContext<ReturnType<
  typeof useSteinPagination
> | null>(null);
export function SteinPaginationProvider({
  state,
  children,
}: PropsWithChildren<{ state: ReturnType<typeof useSteinPagination> }>) {
  return (
    <SteinPaginationStore.Provider value={state}>
      {children}
    </SteinPaginationStore.Provider>
  );
}
