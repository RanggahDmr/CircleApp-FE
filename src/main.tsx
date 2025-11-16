import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css"  
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
  </AuthProvider>
);
