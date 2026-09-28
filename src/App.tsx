import { Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import Dashboard from "./components/pages/dashboard/Dashboard";
import PpdSales from "./components/pages/dashboard/PpdSales";
import Daily from "./components/pages/dashboard/report/daily/Daily";

import AuthGuard from "./components/auth/AuthGuard";
import DashboardLayout from "./components/dashboard/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="ppdsales" element={<PpdSales />} />

        <Route path="report/daily" element={<Daily />} />
      </Route>
    </Routes>
  );
}

export default App;
