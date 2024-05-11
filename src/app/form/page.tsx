import { useContext } from "react";
import { SteinPaginationStore } from "@/providers/stein-pagination-provider";
import { Input } from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import "./main.scss";
import { toCapitilize } from "@/utils/to-capitalize";
import { formatGram } from "@/utils/format-gram";
import { CommoditySchema, type CommoditySchemaType } from "@/libs/zod/scheme";
import { generateList } from "@/utils/generateList";
import { SteinSheet, store } from "@/libs/stein/stein-store";
import { useLocation } from "wouter";

export function Form() {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const { state } = useContext(SteinPaginationStore)!;
  const { area, size } = state;
  const [_, setLocation] = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommoditySchemaType>({
    resolver: zodResolver(CommoditySchema),
  });

  const onSubmitHanlder = (event: CommoditySchemaType) => {
    const list = generateList(event);
    store.append(SteinSheet.LIST, [list]).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="form-wrapper">
      <h1>Sell your fish</h1>
      <form onSubmit={handleSubmit(onSubmitHanlder)} className="form">
        {/* Commodity Input */}
        <div className="form__input">
          <Input
            input={{
              type: "text",
              id: "commodity",
              placeholder: "",
              ...register("commodity"),
            }}
            label={{ htmlFor: "commodity" }}
          />
          {errors.commodity && (
            <span className="error">{errors.commodity.message}</span>
          )}
        </div>

        <div className="form__select-wrapper">
          <div className="form__select">
            <select id="size" {...register("size")}>
              <option value="">Size</option>
              {[...new Set(size.map((e) => e.size))].map((size) => (
                <option key={size} value={size}>
                  {formatGram(size)}
                </option>
              ))}
            </select>
            {errors.size && (
              <span className="error">{errors.size.message}</span>
            )}
          </div>
          <div className="form__select">
            <select id="domicile" {...register("domicile")}>
              <option value="">Domicile</option>
              {area.map(({ city, province }) => {
                const dom = `${city} / ${province}`;
                return (
                  <option key={dom} value={dom}>
                    {toCapitilize(dom)}
                  </option>
                );
              })}
            </select>
            {errors.domicile && (
              <span className="error">{errors.domicile.message}</span>
            )}
          </div>
        </div>

        <div className="form__input">
          <Input
            input={{
              type: "number",
              id: "price",
              placeholder: "Rp. ",
              ...register("price"),
            }}
            label={{ htmlFor: "price" }}
          />
          {errors.price && (
            <span className="error">{errors.price.message}</span>
          )}
        </div>
        <div className="form__button-wrapper">
          <button
            className="form__back"
            type="button"
            onClick={() => setLocation("/")}>
            Back
          </button>
          <button className="form__submit" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
