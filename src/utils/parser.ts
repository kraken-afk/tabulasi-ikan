import type { Area, Size } from "@/hooks/use-stein-pagination";
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function hasNonNullValues(listItem: any[]): boolean {
  return Object.values(listItem).every(
    (value) => value !== null && value !== undefined,
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function hasLowercase(listItem: any[]): boolean {
  const uppercaseRegex = /^[A-Z ]$/;
  return Object.values(listItem).every(
    (value) => typeof value === "string" && uppercaseRegex.test(value),
  );
}

function removeDuplicateArea(data: Area[]): Area[] {
  const uniqueMap = new Map<string, { city: string; province: string }>();

  for (const obj of data) {
    // Create a unique key based on city and province
    const key = `${obj.city}-${obj.province}`;

    // If the key isn't in the map, it's a new unique combination
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, obj);
    }
  }

  // Extract the unique objects back into an array
  return Array.from(uniqueMap.values());
}

export function sizeParser(size: Size[]): Size[] {
  const numericRegex = /^[0-9]$/;
  return (
    size
      // @ts-ignore
      .filter((e) => hasNonNullValues(e) && !numericRegex.test(e))
      // @ts-ignore
      .map((e) => ({ size: Number.parseInt(e.size) }))
  );
}

export function areaParser(areas: Area[]): Area[] {
  return removeDuplicateArea(
    areas
      // @ts-ignore
      .filter((e) => hasNonNullValues(e) || hasLowercase(e)),
  );
}

export function listsParser(list: ListResponse[]): List[] {
  // @ts-ignore
  return list.filter(hasNonNullValues).map((item) => {
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
