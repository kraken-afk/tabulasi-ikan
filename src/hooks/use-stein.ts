import type { SteinSheet } from "@/libs/stein/stein-store";
import { match } from "ts-pattern";

export type SteinAction = "read" | "append" | "edit" | "delete";
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type SteinQuery<T extends Object> = {
  data: T;
  loading: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any;
};
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type SteinOptions<T extends Object> = {
  read: {
    limit?: number;
    offset?: number;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    search?: Record<string, any>;
    authentication?: {
      username: string;
      password: string;
    };
  };
  append: {
    authentication?: {
      username: string;
      password: string;
    };
  };
  edit: {
    search: Partial<T>;
    set: Partial<T>;
    limit?: number;
    authentication?: {
      username: string;
      password: string;
    };
  };
  delete: {
    search: Partial<T>;
    limit?: number;
    authentication?: {
      username: string;
      password: string;
    };
  };
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function useStein<T extends Object>(
  sheet: SteinSheet,
  action: "read",
  option?: SteinOptions<T>["read"],
): SteinQuery<T>;
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function useStein<T extends Object>(
  sheet: SteinSheet,
  action: "append",
  row: T,
  option?: SteinOptions<T>["append"],
): SteinQuery<T>;
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function useStein<T extends Object>(
  sheet: SteinSheet,
  action: "edit",
  option?: SteinOptions<T>["edit"],
): SteinQuery<T>;
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function useStein<T extends Object>(
  sheet: SteinSheet,
  action: "delete",
  option?: SteinOptions<T>["delete"],
): SteinQuery<T>;
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function useStein<T extends Object>(
  sheet: SteinSheet,
  action: SteinAction,
  option?: SteinOptions<T>[SteinAction],
): SteinQuery<T> {
  return match(action)
    .with("read", () => {
      stein;
    })
    .with("append", () => {})
    .with("edit", () => {
      // Handle edit action
    })
    .with("delete", () => {
      // Handle delete action
    })
    .otherwise(() => {
      throw new Error("Unrecognized action");
    });
}
