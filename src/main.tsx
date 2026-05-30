import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppBootstrap } from "@/app/bootstrap/app-bootstrap";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/900.css";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>
);
