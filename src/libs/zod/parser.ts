import { listScheme } from "@/libs/zod/scheme";
import { parseISO } from "date-fns";

export type List = {
  uuid: string;
  commodity: string;
  province: string | null;
  city: string | null;
  size: number;
  price: number;
  date: Date;
};

export function parseList(raw: unknown): List {
  const data = listScheme.parse(raw);
  const { uuid, komoditas, area_provinsi, area_kota } = data;
  const price = Number.parseInt(data.price);
  const size = Number.parseInt(data.size);
  const date = parseISO(data.tgl_parsed);

  return {
    price,
    uuid,
    size,
    date,
    commodity: komoditas,
    province: area_provinsi,
    city: area_kota,
  };
}
