import type { CommoditySchemaType, ListResponse } from "@/libs/zod/scheme";

export function generateList({
  price,
  domicile,
  commodity,
  size,
}: CommoditySchemaType): ListResponse {
  const uuid = crypto.randomUUID();
  const time = new Date();
  const [area_kota, area_provinsi] = domicile
    .split(" / ")
    .map((s) => s.toUpperCase());

  return {
    uuid,
    price,
    size,
    area_kota,
    area_provinsi,
    komoditas: commodity.toUpperCase(),
    timestamp: time.getTime().toString(),
    tgl_parsed: time.toISOString(),
  };
}
