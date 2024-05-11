import { SquareMousePointer } from "lucide-react";

import "./nothing-to-see.scss";
import clsx from "clsx";

export function NothingToSee({ className }: { className?: string }) {
  return (
    <div className={clsx("nothing-to-see", className)}>
      <SquareMousePointer size={64} />
      <h1>Nothing to see here</h1>
    </div>
  );
}
