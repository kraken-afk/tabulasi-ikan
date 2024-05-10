import { useSteinPagination } from "@/hooks/use-stein-pagination";
import { listsParser } from "@/utils/lists-parser";
import { intlFormat } from "date-fns";

import { SteinSheet, store } from "@/libs/stein/stein-store";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { ButtonSequence } from "./buttons-sequence";
import { type MouseEventHandler, useEffect } from "react";
import type { ListResponse } from "@/libs/zod/scheme";

import "@/app/components/table.scss";

const DISPLAY_COUNT = 10;
const INITIAL_AMOUNT_OF_DATA = 60;

export function Table() {
  const [{ data, batch, totalFetched }, dispatch] = useSteinPagination();
  const tableHeaders = ["No", "Commodity", "Size", "Price", "Domicile", "Date"];
  const start = batch * DISPLAY_COUNT - DISPLAY_COUNT;
  const end = batch * DISPLAY_COUNT;
  const totalBatch =
    (data.length - (data.length % DISPLAY_COUNT)) / DISPLAY_COUNT + 1;
  const previousButtonCliclHandler: MouseEventHandler<HTMLButtonElement> =
    () => {
      dispatch({ type: "previous" });
    };
  const nextButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = () => {
    // If user has reach the 60% of data, it will requesr another peice of data
    if ((batch / totalBatch) * 100 > 20) {
      store
        .read<ListResponse>(SteinSheet.LIST, {
          limit: DISPLAY_COUNT * 3,
          offset: totalFetched,
        })
        .then((list) => {
          dispatch({
            type: "set",
            payload: {
              data: data
                .concat(listsParser(list))
                .map((x, i) => ({ ...x, no: i + 1 })),
              totalFetched: totalFetched + list.length,
            },
          });
        });
    }
    dispatch({ type: "next" });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    store
      .read<ListResponse>(SteinSheet.LIST, { limit: INITIAL_AMOUNT_OF_DATA })
      .then((list) =>
        dispatch({
          type: "set",
          payload: {
            data: listsParser(list).map((x, i) => ({ ...x, no: i + 1 })),
            totalFetched: totalFetched + list.length,
          },
        }),
      );
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
        <button
          onClick={previousButtonCliclHandler}
          className="table-controller__button"
          type="button">
          <ChevronLeft size={16} />
        </button>
        {batch > 3 && totalBatch > 5 && (
          <div className="table-controller__button__ellipsis">
            <Ellipsis size={16} />
          </div>
        )}

        <ButtonSequence
          batch={batch}
          total={data.length}
          displayCount={DISPLAY_COUNT}
        />

        {batch < totalBatch - 3 && totalBatch > 5 && (
          <div className="table-controller__button__ellipsis">
            <Ellipsis size={16} />
          </div>
        )}
        <button
          onClick={nextButtonCliclHandler}
          className="table-controller__button"
          type="button">
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}
