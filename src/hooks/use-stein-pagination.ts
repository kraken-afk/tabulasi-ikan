import type { List } from "@/libs/zod/parser";
import { useLayoutEffect, useReducer } from "react";
import { match } from "ts-pattern";
import { useLocation } from "wouter";
import { useSearch } from "./use-search";

type SteinPaginationAction =
  | { type: "next" | "previous" }
  | {
      type: "set";
      payload: { data: List[]; totalFetched: number };
    };
type SteinPaginationState = {
  data: List[];
  batch: number;
  totalFetched: number;
};
type SteinPageSearchParam = {
  page: number;
};

function reducer(
  setLocation: (
    to: string | URL,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    options?: { replace?: boolean; state?: any }, // Fix setLocation type
  ) => void,
) {
  return (state: SteinPaginationState, action: SteinPaginationAction) => {
    return match(action)
      .with({ type: "next" }, () => {
        return { ...state, batch: state.batch + 1 };
      })
      .with({ type: "previous" }, () => {
        return { ...state, batch: state.batch - 1 };
      })
      .with({ type: "set" }, (action) => {
        return { ...state, ...action.payload };
      })
      .exhaustive();
  };
}

export function useSteinPagination() {
  const [_, setLocation] = useLocation();
  const search = useSearch<SteinPageSearchParam>();

  const [state, dispatch] = useReducer(reducer(setLocation), {
    data: [],
    batch: search.page,
    totalFetched: 0,
  });

  useLayoutEffect(() => {
    setLocation(`/?page=${state.batch}`);
  }, [state, setLocation]);

  return [state, dispatch] as const;
}
