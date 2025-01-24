import { createHashRouter } from "react-router";
import Audio from "./pages/Audio";
import Stream from "./pages/Stream";
import Index from "./pages";

const router = createHashRouter([
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
]);

export default router;
