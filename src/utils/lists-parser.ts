import type { ListResponse } from "@/libs/zod/scheme";
import { toCapitilize } from "@/utils/to-capitalize";
import { parseISO } from "date-fns";

export type List = {
  uuid: string;
  no: number;
  commodity: string;
  province: string | null;
  city: string | null;
  size: number;
  price: number;
  date: Date;
};

function hasNonNullValues(listItem: ListResponse): boolean {
  return Object.values(listItem).every(
    (value) => value !== null && value !== undefined,
  );
}

export function listsParser(raw: ListResponse[]): List[] {
  return raw.filter(hasNonNullValues).map((item) => {
    const { uuid, komoditas, area_provinsi, area_kota } = item;

    const formattedCommodity = toCapitilize(komoditas);
    const formattedCity = toCapitilize(area_kota || "");
    const formattedProvince = toCapitilize(area_provinsi || "");

    const price = Number.parseInt(item.price);
    const size = Number.parseInt(item.size);

    const date = parseISO(item.tgl_parsed);

    return {
      no: 0,
      price,
      uuid,
      size,
      date,
      commodity: formattedCommodity,
      province: formattedProvince,
      city: formattedCity,
    };
  });
}
