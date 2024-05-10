import type { List } from "@/libs/zod/parser";
import { useReducer } from "react";
import { match } from "ts-pattern";

type SteinPaginationAction =
  | { type: "next" | "previous" }
  | {
      type: "set";
      payload?: { data: List[]; totalFetched: number };
    };
type SteinPaginationState = {
  data: List[];
  batch: number;
  totalFetched: number;
};

function reducer(state: SteinPaginationState, action: SteinPaginationAction) {
  return match(action.type)
    .with("next", () => ({ ...state, batch: state.batch + 1 }))
    .with("previous", () => ({ ...state, batch: state.batch - 1 }))
    .with("set", () => {
      const { payload } = action as SteinPaginationAction & {
        payload: { data: List[]; totalFetched: number };
      };
      return { ...state, ...payload };
    })
    .otherwise(() => {
      throw new Error("Unrecognized action");
    });
}
export function useSteinPagination() {
  return useReducer(reducer, { data: [], batch: 1, totalFetched: 0 });
}
