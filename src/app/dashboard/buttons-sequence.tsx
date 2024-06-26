import { B } from "@mobily/ts-belt";
import clsx from "clsx/lite";
import type { MouseEventHandler } from "react";

type ButtonsSequenceProps = {
  batch: number;
  total: number;
  displayCount: number;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export function ButtonSequence({
  batch,
  total,
  displayCount,
  onClick,
}: ButtonsSequenceProps) {
  const totalBatch = (total - (total % displayCount)) / displayCount + 1;
  const sequence = B.ifElse(
    batch > 3,
    () =>
      B.ifElse(
        batch > totalBatch - 4,
        () => {
          return [
            totalBatch - 4,
            totalBatch - 3,
            totalBatch - 2,
            totalBatch - 1,
            totalBatch,
          ];
        },
        () => [batch - 2, batch - 1, batch, batch + 1, batch + 2],
      ),
    () => [1, 2, 3, 4, 5],
  );

  return (
    <>
      {sequence.map((n) => (
        <button
          key={n}
          disabled={n > totalBatch}
          className={clsx(
            batch === n && "hightlight",
            "table-controller__button",
            n > totalBatch && "disabled",
          )}
          data-sequence={n}
          type="button"
          onClick={onClick}>
          <span className="table-controller__button__text">{n}</span>
        </button>
      ))}
    </>
  );
}
