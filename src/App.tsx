import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

/**
 * 메인 애플리케이션 컴포넌트
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
