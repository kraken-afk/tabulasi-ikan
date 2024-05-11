import { useStein } from "@/hooks/use-stein";
import { Table } from "./components/table";
import { SteinSheet } from "@/libs/stein/stein-store";
import { Route, Switch } from "wouter";

export function App() {
  // useStein(SteinSheet.LIST, "read");

  return (
    <div className="container">
      <Switch>
        <Route path="/" component={Table} />
      </Switch>
    </div>
  );
}
