import { useSteinPagination } from "@/hooks/use-stein-pagination";
import { listsParser } from "@/utils/lists-parser";
import { intlFormat } from "date-fns";

import { SteinSheet, store } from "@/libs/stein/stein-store";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { ButtonSequence } from "./buttons-sequence";
import type { MouseEventHandler } from "react";
import type { ListResponse } from "@/libs/zod/scheme";

import clsx from "clsx";
import { A } from "@mobily/ts-belt";

import "@/app/components/table.scss";

export const DISPLAY_COUNT = 10;
export const INITIAL_AMOUNT_OF_DATA = 60;

export function Table() {
  const [[{ data, batch, totalFetched }, dispatch], [sortCriteria, dispatchSortCriteria]] = useSteinPagination();
  const start = batch * DISPLAY_COUNT - DISPLAY_COUNT;
  const end = batch * DISPLAY_COUNT;
  const totalBatch =
    (data.length - (data.length % DISPLAY_COUNT)) / DISPLAY_COUNT + 1;
  const previousButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const button = event.currentTarget;
    const siblings = button.parentElement?.lastChild as HTMLButtonElement;
    if (batch <= 1) {
      button.classList.add("disabled");
      button.disabled = true;
    }

    if (
      siblings.hasAttribute("disabled") &&
      siblings.classList.contains("disabled")
    ) {
      siblings.classList.remove("disabled");
      siblings.disabled = false;
    }

    dispatch({ type: "previous" });
  };
  const nextButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const button = event.currentTarget;
    const siblings = button.parentElement?.firstChild as HTMLButtonElement;
    if (batch >= totalBatch) {
      button.classList.add("disabled");
      button.disabled = true;
    }

    if (
      siblings.hasAttribute("disabled") &&
      siblings.classList.contains("disabled")
    ) {
      siblings.classList.remove("disabled");
      siblings.disabled = false;
    }
    dispatch({ type: "next" });
  };


  return A.isEmpty(data) ? (
    <p>loading..</p>
  ) : (
    <>
      <div className="sort-controller">
        <h3>Sorting: </h3>
        <button onClick={() => dispatchSortCriteria({ type: "size", category: sortCriteria.size === "asc" ? "desc" : "asc" })} type="button" className="sort-controller__button">Size | {sortCriteria.size}</button>
        <button onClick={() => dispatchSortCriteria({ type: "price", category: sortCriteria.price === "asc" ? "desc" : "asc" })} type="button" className="sort-controller__button">Price | {sortCriteria.price}</button>
      </div>
      <table className="table">
        <thead className="table__head">
          <tr className="table__row">
            <th className="table__cell">No</th>
            <th className="table__cell">Commodity</th>
            <th className="table__cell">Size</th>
            <th className="table__cell">Price</th>
            <th className="table__cell">Domicile</th>
            <th className="table__cell">Date</th>
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
          className={clsx(
            "table-controller__button",
            batch === 1 && "disabled",
          )}
          disabled={batch === 1}
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
          onClick={(event) => {
            const button = event.currentTarget as HTMLButtonElement;
            const sequence = Number.parseInt(button.dataset.sequence || "", 10);

            if (sequence > totalBatch) {
              store
                .read<ListResponse>(SteinSheet.LIST, {
                  limit: INITIAL_AMOUNT_OF_DATA * batch,
                })
                .then((list) => {
                  // Check if component is still mounted before dispatching
                  if (button.closest("body")) {
                    dispatch({
                      type: "set",
                      payload: {
                        data: listsParser(list).map((x, i) => ({
                          ...x,
                          no: i + 1,
                        })),
                        totalFetched: totalFetched + list.length,
                      },
                    });
                  }
                })
                .then(() =>
                  dispatch({ type: "goto", payload: { batch: sequence } }),
                );
            } else {
              dispatch({ type: "goto", payload: { batch: sequence } });
            }
          }}
        />

        {batch < totalBatch - 3 && totalBatch > 5 && (
          <div className="table-controller__button__ellipsis">
            <Ellipsis size={16} />
          </div>
        )}
        <button
          onClick={nextButtonCliclHandler}
          className={clsx(
            "table-controller__button",
            batch >= totalBatch && "disabled",
          )}
          disabled={batch >= totalBatch}
          type="button">
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}
