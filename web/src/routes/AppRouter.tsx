import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";

import ProtectedRoute from "./ProtectedRoute";

import AppShell from "../components/layout/AppShell";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Protected */}

        <Route
          element={
            <ProtectedRoute />
          }
        >
          <Route
            element={<AppShell />}
          >
            <Route
              path="/dashboard"
              element={
                <DashboardPage />
              }
            />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;