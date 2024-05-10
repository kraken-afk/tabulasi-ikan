import { B } from "@mobily/ts-belt";
import clsx from "clsx/lite";

type ButtonsSequenceProps = {
  batch: number;
  total: number;
  displayCount: number;
};

export function ButtonSequence({
  batch,
  total,
  displayCount,
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
          className={clsx(
            batch === n && "hightlight",
            "table-controller__button",
          )}
          data-sequence={n}
          type="button">
          <span className="table-controller__button__text">{n}</span>
        </button>
      ))}
    </>
  );
}
