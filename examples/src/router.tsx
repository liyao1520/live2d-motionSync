import { createBrowserRouter } from "react-router";
import Audio from "./pages/Audio";
import Stream from "./pages/Stream";
import Index from "./pages";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Index,
      children: [
        {
          path: "/",
          element: <Audio />,
        },
        {
          path: "/stream",
          element: <Stream />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export default router;
