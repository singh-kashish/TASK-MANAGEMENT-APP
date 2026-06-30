import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {Provider} from "react-redux";
import { store } from "./store";
import {QueryProvider} from "./providers/QueryProvider";
import {ThemeProvider} from "./providers/ThemeProvider";
import { Toaster }from "./components/ui/sonner";

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )!
).render(
  <React.StrictMode>

    <Provider
      store={store}
    >
      <QueryProvider>
        <ThemeProvider>
          <App/>
          <Toaster richColors closeButton position="bottom-right" expand visibleToasts={4}
            toastOptions={{
              classNames: {
                toast:
                  "rounded-xl shadow-2xl border",
              },
            }} />
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  </React.StrictMode>
);