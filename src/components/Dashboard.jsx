import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import { LayoutDashboard, RefreshCw } from "lucide-react";
import { fetchDashboardStats, fetchAllUsers } from "../store/slices/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading = false } = useSelector((state) => state.admin || {});

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAllUsers());
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-300">
      <Header />

      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Top Header & Refresh Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <LayoutDashboard className="w-6 h-6 text-[#9c5b6f]" />
              Performance Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
              Real-time business performance overview, sales trends and inventory reports
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#9c5b6f]" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>

        {/* 1. Metric Cards */}
        <MiniSummary />

        {/* 2. Charts Section (Monthly Trend + Order Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlySalesChart />
          </div>
          <div className="lg:col-span-1">
            <OrdersChart />
          </div>
        </div>

        {/* 3. Detailed Stats */}
        <Stats />

        {/* 4. Top Selling Table & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopSellingProducts />
          </div>
          <div className="lg:col-span-1">
            <TopProductsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;