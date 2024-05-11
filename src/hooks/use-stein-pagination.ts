import { useState, useEffect, useLayoutEffect, useReducer } from "react";
import { match } from "ts-pattern";
import { useLocation } from "wouter";
import { A } from "@mobily/ts-belt";
import { areaParser, listsParser, sizeParser } from "@/utils/parser";
import { store, SteinSheet } from "@/libs/stein/stein-store";
import { sort } from "fast-sort";

import type { List } from "@/utils/parser";
import type { ListResponse, areaScheme, sizeScheme } from "@/libs/zod/scheme";
import type { z } from "zod";

export type Area = z.infer<typeof areaScheme>;
export type Size = z.infer<typeof sizeScheme>;

type SteinPaginationAction =
  | { type: "next" | "previous" }
  | { type: "goto"; payload: { batch: number } }
  | {
      type: "set";
      payload: {
        data: List[];
        totalFetched: number;
        area: Area[];
        size: Size[];
        loading: boolean;
      };
    };

type SteinPaginationState = {
  area: Area[];
  data: List[];
  size: Size[];
  batch: number;
  loading: boolean;
  totalFetched: number;
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
    .with({ type: "next" }, () => ({ ...state, batch: state.batch + 1 }))
    .with({ type: "previous" }, () => ({ ...state, batch: state.batch - 1 }))
    .with({ type: "goto" }, (action) => ({
      ...state,
      batch: action.payload.batch,
    }))
    .with({ type: "set" }, (action) => ({ ...state, ...action.payload }))
    .exhaustive();
}

function sortReducer(state: ShortingState, action: ShortingAction) {
  return {
    ...state,
    [action.type]: action.category,
  };
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
  const [sortCriteria, dispatchSortCriteria] = useReducer(sortReducer, {
    price: "asc",
    size: "asc",
  });
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    size: [],
    area: [],
    batch: 1,
    loading: true,
    totalFetched: 0,
  });
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });
  const [size, setSize] = useState(0);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    setLocation(`/?page=${state.batch}`);
  }, [state.batch, setLocation]);

  useEffect(() => {
    async function fetchData() {
      if (A.isEmpty(state.data)) {
        const [listResponse, areas, sizes] = await Promise.all([
          store.read<ListResponse>(SteinSheet.LIST),
          store.read<Area>(SteinSheet.AREA),
          store.read<Size>(SteinSheet.SIZE),
        ]);
        const list = listsParser(listResponse);
        const area = areaParser(areas);
        const size = sizeParser(sizes);

        const minDate = list.reduce(
          (acc, v) => (acc.getTime() > v.date.getTime() ? v.date : acc),
          new Date(),
        );
        const maxDate = list.reduce(
          (acc, v) => (acc.getTime() < v.date.getTime() ? v.date : acc),
          minDate,
        );

        setDateRange({ start: minDate, end: maxDate });

        dispatch({
          type: "set",
          payload: {
            data: list,
            area,
            size,
            loading: false,
            totalFetched: state.totalFetched + listResponse.length,
          },
        });
      }
    }

    fetchData();
  }, [state.data, state.totalFetched]);
  const filteredData = state.data.filter(
    (e) =>
      e.date.getTime() >= dateRange.start.getTime() &&
      e.date.getTime() <= dateRange.end.getTime(),
  );

  const sortedData = sortList(filteredData, sortCriteria)
    .filter((e) => {
      return (
        (size === 0 || size === e.size) &&
        (city === "" || city === e.city?.toUpperCase()) &&
        (province === "" || province === e.province?.toUpperCase()) &&
        (search === "" ||
          e.commodity.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .map((x, i) => ({ ...x, no: i + 1 }));

  return [
    { ...state, data: sortedData },
    dispatch,
    sortCriteria,
    dispatchSortCriteria,
    dateRange,
    setDateRange,
    setSize,
    setCity,
    setProvince,
    setSearch,
  ] as const;
}
