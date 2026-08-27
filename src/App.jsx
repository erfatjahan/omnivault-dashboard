import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Actions
import { getUser } from "./store/slices/authSlice";

// Components & Pages
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Products from "./components/Products";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const dispatch = useDispatch();

  const { openedComponent = "Dashboard" } = useSelector(
    (state) => state.extra || {}
  );
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const renderDashboardContent = () => {
    switch (openedComponent?.toLowerCase()) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "users":
        return <Users />;
      case "profile":
        return <Profile />;
      case "products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  const isAdmin =
    isAuthenticated &&
    (user?.role?.toLowerCase() === "admin" || user?.role === "Admin");

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f9] dark:bg-[#0f090c]">
        <div className="w-8 h-8 border-4 border-[#9c5b6f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAdmin ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* Protected Admin Route */}
        <Route
          path="/"
          element={
            isAdmin ? (
              <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a]">
                <SideBar />
                <main className="flex-1 p-6 overflow-y-auto max-h-screen">
                  {renderDashboardContent()}
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer theme="dark" position="bottom-right" />
    </Router>
  );
}

export default App;