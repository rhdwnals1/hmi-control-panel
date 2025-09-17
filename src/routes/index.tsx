import type { RouteObject } from "react-router-dom";
import TanksOverview from "../pages/TanksOverview";
import TankDetailPage from "../pages/TankDetailPage";

/**
 * 애플리케이션 라우트 정의
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <TanksOverview />,
  },
  {
    path: "/tanks",
    element: <TanksOverview />,
  },
  {
    path: "/tanks/:tankId",
    element: <TankDetailPage />,
  },
];
