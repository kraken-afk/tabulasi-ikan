import { z } from "zod";

export type ListResponse = z.infer<typeof listScheme>;

const uppercaseRegex = /^[A-Z ]+$/;
export const areaScheme = z.object({
  province: z.string().refine((str) => !str || uppercaseRegex.test(str)),
  city: z.string().refine((str) => !str || uppercaseRegex.test(str)),
});
export const sizeScheme = z.object({
  size: z.number(),
});
export const listScheme = z.object({
  uuid: z.string(),
  komoditas: z.string(),
  area_provinsi: z.string().nullable(),
  area_kota: z.string().nullable(),
  size: z.string(),
  price: z.string(),
  tgl_parsed: z.string(),
  timestamp: z.string(),
});
