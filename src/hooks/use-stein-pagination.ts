import { DISPLAY_COUNT, INITIAL_AMOUNT_OF_DATA } from "@/app/components/table";
import { A } from "@mobily/ts-belt";
import { listsParser } from "@/utils/lists-parser";
import { useEffect, useLayoutEffect, useReducer, useState } from "react";
import { match } from "ts-pattern";
import { useLocation } from "wouter";
import { useSearch } from "./use-search";
import { SteinSheet, store } from "@/libs/stein/stein-store";
import type { List } from "@/libs/zod/parser";
import type { ListResponse } from "@/libs/zod/scheme";

type SteinPaginationAction =
  | { type: "next" | "previous" }
  | {
      type: "set";
      payload: { data: List[]; totalFetched: number };
    }
  | { type: "goto"; payload: { batch: number } };
type SteinPaginationState = {
  data: List[];
  batch: number;
  totalFetched: number;
};
type SteinPageSearchParam = {
  page: number;
};

function reducer(state: SteinPaginationState, action: SteinPaginationAction) {
  return match(action)
    .with({ type: "next" }, () => {
      return { ...state, batch: state.batch + 1 };
    })
    .with({ type: "previous" }, () => {
      return { ...state, batch: state.batch - 1 };
    })
    .with({ type: "goto" }, (action) => {
      return { ...state, batch: action.payload.batch };
    })
    .with({ type: "set" }, (action) => {
      return { ...state, ...action.payload };
    })
    .exhaustive();
}

export function useSteinPagination() {
  const [_, setLocation] = useLocation();
  const [isEnd, setEnd] = useState(false);
  const search = useSearch<SteinPageSearchParam>();

  const [state, dispatch] = useReducer(reducer, {
    data: [],
    batch: search.page,
    totalFetched: 0,
  });

  useLayoutEffect(() => {
    setLocation(`/?page=${state.batch}`);

    const totalBatch = Math.ceil(state.data.length / DISPLAY_COUNT);
    const loadThreshold = 40;

    const shouldLoadMore =
      !A.isEmpty(state.data) &&
      (state.batch / totalBatch) * 100 > loadThreshold &&
      !isEnd;

    if (shouldLoadMore) {
      store
        .read<ListResponse>(SteinSheet.LIST, {
          limit: DISPLAY_COUNT * 3,
          offset: state.totalFetched,
        })
        .then((list) => {
          if (A.isEmpty(list)) {
            setEnd(true);
          }
          return list;
        })
        .then((list) => {
          dispatch({
            type: "set",
            payload: {
              data: state.data
                .concat(listsParser(list))
                .map((x, i) => ({ ...x, no: i + 1 })),
              totalFetched: state.totalFetched + list.length,
            },
          });
        });
    }
  }, [state, setLocation, isEnd]);

  useEffect(() => {
    if (A.isEmpty(state.data)) {
      store
        .read<ListResponse>(SteinSheet.LIST, {
          limit: INITIAL_AMOUNT_OF_DATA + DISPLAY_COUNT * (state.batch - 1),
        })
        .then((list) =>
          dispatch({
            type: "set",
            payload: {
              data: listsParser(list).map((x, i) => ({ ...x, no: i + 1 })),
              totalFetched: state.totalFetched + list.length,
            },
          }),
        );
    }
  }, [state.totalFetched, state.data, state.batch]);

  return [state, dispatch] as const;
}
