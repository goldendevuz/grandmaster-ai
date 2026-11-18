import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    {/* One broken section must not leave the whole site white. */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// A published page arrives already rendered on the server (data-ssr): React
// takes it over instead of drawing it again.
if (root.dataset.ssr) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
