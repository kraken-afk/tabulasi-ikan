import { z } from "zod";

export type ListResponse = z.infer<typeof listScheme>;
export type CommoditySchemaType = z.infer<typeof CommoditySchema>;

const uppercaseRegex = /^[A-Z ]+$/;

export const CommoditySchema = z.object({
  commodity: z.string().min(1, "Commodity is required"),
  size: z.string().min(1, "Size is required"), // Change to string for select
  price: z
    .string()
    .refine(
      (v) => Number.parseInt(v) > 5000,
      "Price must be greater than 5000",
    ),
  domicile: z
    .string()
    .refine(
      (val) => val.includes("/"),
      "Invalid domicile format (city/province)",
    ),
});
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
