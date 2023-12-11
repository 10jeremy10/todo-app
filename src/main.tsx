import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root";
import { ThemeModeProvider } from "./context/themeContext";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <Root />
    </ThemeModeProvider>
  </React.StrictMode>
);
