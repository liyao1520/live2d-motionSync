import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Stream from "./pages/Stream";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/stream",
      element: <Stream />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export default router;
