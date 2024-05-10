import { useStein } from "@/hooks/use-stein";
import { Table } from "./componens/table";
import { SteinSheet } from "@/libs/stein/stein-store";

export function App() {
  // useStein(SteinSheet.LIST, "read");

  return <Table />;
}
