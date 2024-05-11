import { Dashboard } from "./dashboard/page";
import { Route, Switch } from "wouter";
import { Form } from "./form/page";

export function App() {
  return (
    <div className="container">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="form" component={Form} />
      </Switch>
    </div>
  );
}
