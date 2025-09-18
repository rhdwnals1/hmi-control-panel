import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TanksOverview from "@/pages/TanksOverview";
import TankDetailPage from "@/pages/TankDetailPage";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
        <Routes>
          <Route path="/" element={<TanksOverview />} />
          <Route path="/tanks" element={<TanksOverview />} />
          <Route path="/tanks/:tankId" element={<TankDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
