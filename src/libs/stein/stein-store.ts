import SteinStore from "stein-js-client";

export const STEIN_STORAGE_URL =
  "https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4";
export enum SteinSheet {
  LIST = "list",
  AREA = "option_area",
  SIZE = "option_size",
}
export const store = new SteinStore(STEIN_STORAGE_URL);
