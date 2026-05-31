import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppBootstrap } from "@/app/bootstrap/app-bootstrap";
import "@/styles/theme.css";
import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>
);
