import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import { LayoutDashboard } from "lucide-react";
import { fetchDashboardStats } from "../store/slices/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#9c5b6f]" /> Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
            Real-time business performance overview, sales trends and inventory reports
          </p>
        </div>

        <MiniSummary />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlySalesChart />
          </div>
          <div>
            <OrdersChart />
          </div>
        </div>

        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopSellingProducts />
          </div>
          <div>
            <TopProductsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;