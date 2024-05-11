import { Dashboard } from "./dashboard/page";
import { Route, Switch } from "wouter";
import { Form } from "./form/page";
import { useSteinPagination } from "@/hooks/use-stein-pagination";
import { SteinPaginationProvider } from "@/providers/stein-pagination-provider";
import { Loader } from "@/components/loader";

export function App() {
  const store = useSteinPagination();

  if (store.state.loading) return <Loader />;
  return (
    <SteinPaginationProvider state={store}>
      <div className="container">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="form" component={Form} />
        </Switch>
      </div>
    </SteinPaginationProvider>
  );
}
