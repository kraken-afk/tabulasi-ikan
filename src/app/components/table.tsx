import { ButtonSequence } from "./buttons-sequence";
import { useSteinPagination } from "@/hooks/use-stein-pagination";
import { formatDate, intlFormat } from "date-fns";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import type { MouseEventHandler } from "react";
import { A } from "@mobily/ts-belt";
import clsx from "clsx";

import "@/app/components/table.scss";
import { toCapitilize } from "@/utils/to-capitalize";

export const DISPLAY_COUNT = 10;
export const INITIAL_AMOUNT_OF_DATA = 60;

export function Table() {
  const [
    { data, batch, size, area },
    dispatch,
    sortCriteria,
    dispatchSortCriteria,
    { start: startDate, end: endDate },
    setDate,
    setSize,
    setCity,
    setProvince,
  ] = useSteinPagination();

  const start = batch * DISPLAY_COUNT - DISPLAY_COUNT;
  const end = batch * DISPLAY_COUNT;
  const totalBatch = Math.ceil(data.length / DISPLAY_COUNT);

  const previousButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const button = event.currentTarget;
    if (batch <= 1) {
      button.classList.add("disabled");
      button.disabled = true;
    }
    dispatch({ type: "previous" });
  };

  const nextButtonCliclHandler: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const button = event.currentTarget;
    if (batch >= totalBatch) {
      button.classList.add("disabled");
      button.disabled = true;
    }
    dispatch({ type: "next" });
  };

  const handlePaginationClick: MouseEventHandler<HTMLButtonElement> = (event) =>
    dispatch({
      type: "goto",
      payload: {
        batch: Number.parseInt(event.currentTarget.dataset.sequence as string),
      },
    });

  return A.isEmpty(data) ? (
    <p>loading..</p>
  ) : (
    <>
      <div className="controller-container">
        <div className="sort-controller">
          <button
            onClick={() =>
              dispatchSortCriteria({
                type: "size",
                category: sortCriteria.size === "asc" ? "desc" : "asc",
              })
            }
            type="button"
            className="sort-controller__button">
            Size | {sortCriteria.size}
          </button>
          <button
            onClick={() =>
              dispatchSortCriteria({
                type: "price",
                category: sortCriteria.price === "asc" ? "desc" : "asc",
              })
            }
            type="button"
            className="sort-controller__button">
            Price | {sortCriteria.price}
          </button>
        </div>
        <div className="date-controller">
          <div className="date-controller__input">
            <label htmlFor="start">Start</label>
            <input
              type="date"
              id="start"
              name="start"
              value={formatDate(startDate, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate((prev) => ({
                  ...prev,
                  start: new Date(e.target.value),
                }))
              }
            />
          </div>
          <div className="date-controller__input">
            <label htmlFor="end">End</label>
            <input
              type="date"
              id="end"
              name="end"
              value={formatDate(endDate, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate((prev) => ({ ...prev, end: new Date(e.target.value) }))
              }
            />
          </div>
        </div>
        <div className="domicile-controller">
          <div className="domicile-controller__input">
            <label htmlFor="city">City</label>
            <select
              name="city"
              id="city"
              onChange={(e) => setCity(e.currentTarget.value)}>
              <option value="">-</option>
              {area.map((e) => (
                <option key={e.city} value={e.city as string}>
                  {toCapitilize(e.city as string)}
                </option>
              ))}
            </select>
          </div>
          <div className="domicile-controller__input">
            <label htmlFor="province">Province</label>
            <select
              name="province"
              id="province"
              onChange={(e) => setProvince(e.currentTarget.value)}>
              <option value="">-</option>
              {[...new Set(area.map((e) => e.province))].map((e) => (
                <option key={e} value={e}>
                  {toCapitilize(e)}
                </option>
              ))}
            </select>
          </div>
          <div className="domicile-controller__input">
            <label htmlFor="size">Size</label>
            <select
              name="size"
              id="size"
              onChange={(e) => setSize(+e.currentTarget.value)}>
              <option value="0">-</option>
              {[
                ...new Set(
                  size.sort((a, b) => a.size - b.size).map((e) => e.size),
                ),
              ].map((e) => (
                <option key={e} value={e}>
                  {e.toString()}
                </option>
              ))}
            </select>
          </div>
        </div>
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
          onClick={handlePaginationClick}
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
