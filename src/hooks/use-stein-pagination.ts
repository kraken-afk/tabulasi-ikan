import { A } from "@mobily/ts-belt";

import { listsParser } from "@/utils/lists-parser";
import { useEffect, useLayoutEffect, useReducer } from "react";
import { match } from "ts-pattern";
import { useLocation } from "wouter";
import { useSearch } from "./use-search";

import { SteinSheet, store } from "@/libs/stein/stein-store";

import type { List } from "@/libs/zod/parser";
import type { ListResponse } from "@/libs/zod/scheme";
import { sort } from "fast-sort";

type SteinPaginationAction =
  | { type: "next" | "previous" }
  | { type: "goto"; payload: { batch: number } }
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

type ShortingType = "asc" | "desc";
type ShortingCategories = {
  price: ShortingType;
  size: ShortingType;
};
type ShortingState = ShortingCategories;
type ShortingAction = {
  type: keyof ShortingCategories;
  category: ShortingType;
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

function sortReducer(state: ShortingState, action: ShortingAction) {
  return match(action)
    .with({ type: "price" }, () => ({ ...state, price: action.category }))
    .with({ type: "size" }, () => ({ ...state, size: action.category }))
    .exhaustive();
}

function sortList(data: List[], sortCriteria: ShortingCategories): List[] {
  const sortBy: Record<ShortingType, "price" | "size">[] = [];

  // @ts-expect-error
  sortBy.push({
    // @ts-expect-error
    [sortCriteria.size]: (u) => u.size,
  });
  // @ts-expect-error
  sortBy.push({
    // @ts-expect-error
    [sortCriteria.price]: (u) => u.price,
  });

  return sort(data).by(sortBy);
}

export function useSteinPagination() {
  const [_, setLocation] = useLocation();
  const search = useSearch<SteinPageSearchParam>();
  const [sortCriteria, dispatchSortCriteria] = useReducer(sortReducer, {
    price: "asc",
    size: "asc",
  });
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    batch: search.page,
    totalFetched: 0,
  });

  useLayoutEffect(() => {
    setLocation(`/?page=${state.batch}`);
  }, [state, setLocation]);

  useEffect(() => {
    if (A.isEmpty(state.data)) {
      store.read<ListResponse>(SteinSheet.LIST).then((list) =>
        dispatch({
          type: "set",
          payload: {
            data: listsParser(list),
            totalFetched: state.totalFetched + list.length,
          },
        }),
      );
    }
  }, [state.totalFetched, state.data]);

  const sortedData = sortList(state.data, sortCriteria).map((x, i) => ({
    ...x,
    no: i + 1,
  }));

  return [
    [{ ...state, data: sortedData }, dispatch],
    [sortCriteria, dispatchSortCriteria],
  ] as const;
}
