import { useSteinPagination } from "@/hooks/use-stein-pagination";
import { SteinSheet, store } from "@/libs/stein/stein-store";
import { type List, parseList } from "@/libs/zod/parser";
import type { listScheme } from "@/libs/zod/scheme";
import type { z } from "zod";

import "@/app/componens/table.scss";
import { type MouseEventHandler, useEffect } from "react";

const DISPLAY_COUNT = 10;

export function Table() {
  const [{ data, batch }, dispatch] = useSteinPagination();
  const tableHeaders = ["No", "Commodity", "Size", "Price", "Domicile", "Date"];
  const start = batch * DISPLAY_COUNT - DISPLAY_COUNT;
  const end = batch * DISPLAY_COUNT;
  const previousButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("previous click");
    dispatch({ type: "previous" })
  }
  const nextButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("next click");
    dispatch({ type: "next" })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    store
      .read<z.infer<typeof listScheme>>(SteinSheet.LIST, { limit: 50 })
      .then((list) => dispatch({ type: "set", payload: list.filter(hasNonNullValues).map(parseList) as List[] }));
  }, []);

  return data.length === 0 ? (
    <p>loading..</p>
  ) : (
    <>
      <table className="table">
        <thead className="thead">
          <tr>
            {tableHeaders.map((e) => (
              <th key={e}>{e}</th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody">
          {data.slice(start, end).map((list) => (
            <tr key={list.uuid}>
              <td>{list.no}</td>
              <td>{list.commodity}</td>
              <td>{list.size}</td>
              <td>{list.price}</td>
              <td>
                {list.city} / {list.province}
              </td>
              <td>{list.date.getFullYear()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="controller">
        <button onClick={previousButtonCliclHandler} type="button">Previous</button>
        <button onClick={nextButtonCliclHandler} type="button">Next</button>
      </div>
    </>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function hasNonNullValues(listItem: any): boolean {
  return Object.values(listItem).every((value) => value !== null && value !== undefined);
}
