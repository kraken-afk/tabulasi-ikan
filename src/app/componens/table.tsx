import { useSteinPagination } from "@/hooks/use-stein-pagination";
import { SteinSheet, store } from "@/libs/stein/stein-store";
import { type List, parseList } from "@/libs/zod/parser";
import type { listScheme } from "@/libs/zod/scheme";
import type { z } from "zod";

import "@/app/componens/table.scss";
import { type MouseEventHandler, useEffect } from "react";
import { intlFormat } from "date-fns";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { ButtonSequence } from "./buttons-sequence";

const DISPLAY_COUNT = 5;
const INITIAL_AMOUNT_OF_DATA = 50;

export function Table() {
  const [{ data, batch }, dispatch] = useSteinPagination();
  const tableHeaders = ["No", "Commodity", "Size", "Price", "Domicile", "Date"];
  const start = batch * DISPLAY_COUNT - DISPLAY_COUNT;
  const end = batch * DISPLAY_COUNT;
  const previousButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("previous click");
    dispatch({ type: "previous" });
  };
  const nextButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("next click");
    dispatch({ type: "next" });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    store
      .read<z.infer<typeof listScheme>>(SteinSheet.LIST, { limit: INITIAL_AMOUNT_OF_DATA })
      .then((list) => dispatch({ type: "set", payload: list.filter(hasNonNullValues).map(parseList) as List[] }));
  }, []);

  return data.length === 0 ? (
    <p>loading..</p>
  ) : (
    <>
      <table className="table">
        <thead className="table__head">
          <tr className="table__row">
            {tableHeaders.map((e) => (
              <th className="table__cell" key={e}>
                {e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {data.slice(start, end).map((list) => (
            <tr className="table__row" key={list.uuid}>
              <td className="table__cell">{list.no}</td>
              <td className="table__cell">{list.commodity}</td>
              <td className="table__cell">{list.size}</td>
              <td className="table__cell">{list.price}</td>
              <td className="table__cell">
                {list.city} / {list.province}
              </td>
              <td className="table__cell">{intlFormat(list.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-controller">
        <button onClick={previousButtonCliclHandler} className="table-controller__button" type="button">
          <ChevronLeft size={16} />
        </button>
        {batch > 3 && (
          <div className="table-controller__button__ellipsis">
            <Ellipsis size={16} />
          </div>
        )}
        <ButtonSequence batch={batch} total={data.length} displayCount={DISPLAY_COUNT} />
        {batch < (data.length - (data.length % DISPLAY_COUNT)) / DISPLAY_COUNT + 1 - 3 && (
          <div className="table-controller__button__ellipsis">
            <Ellipsis size={16} />
          </div>
        )}
        <button onClick={nextButtonCliclHandler} className="table-controller__button" type="button">
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function hasNonNullValues(listItem: any): boolean {
  return Object.values(listItem).every((value) => value !== null && value !== undefined);
}
