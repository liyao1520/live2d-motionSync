import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import router from "./router";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
