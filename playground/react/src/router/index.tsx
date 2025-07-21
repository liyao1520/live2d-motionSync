import { createBrowserRouter } from "react-router";
import Index from "../pages/index";
import Test1 from "../pages/Test1";
import BasicMotionSync from "../pages/BasicMotionSync";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/test1",
    element: <Test1 />,
  },
  {
    path: "/demo/basic-motion-sync",
    element: <BasicMotionSync />,
  },
]);
export default router;
