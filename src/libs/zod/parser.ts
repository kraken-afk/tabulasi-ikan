import { listScheme } from "@/libs/zod/scheme";
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

export function parseList(raw: unknown, no: number): List {
  const data = listScheme.parse(raw);
  const { uuid, komoditas, area_provinsi, area_kota } = data;
  const commodity = toCapitilize(komoditas);
  const city = toCapitilize(area_kota || "");
  const province = toCapitilize(area_provinsi || "");
  const price = Number.parseInt(data.price);
  const size = Number.parseInt(data.size);
  const date = parseISO(data.tgl_parsed);

  return {
    no: no + 1,
    price,
    uuid,
    size,
    date,
    commodity,
    province,
    city,
  };
}
