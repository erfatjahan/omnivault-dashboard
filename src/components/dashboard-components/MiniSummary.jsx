import React from "react";
import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    totalRevenueAllTime = 0,
    todayRevenue = 0,
    currentMonthSales = 0,
    revenueGrowth = "0%",
    lowStockProducts = 0,
    newUsersThisMonth = 0,
  } = useSelector((state) => state.admin || {});

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `৳${formatNumber(totalRevenueAllTime)}`,
      icon: Wallet,
      color: "from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      badge: "All time",
    },
    {
      title: "Today's Revenue",
      value: `৳${Number(todayRevenue).toLocaleString()}`,
      icon: TrendingUp,
      color: "from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20",
      badge: "Live",
    },
    {
      title: "This Month Sales",
      value: `৳${formatNumber(currentMonthSales)}`,
      icon: BarChart4,
      color: "from-[#9c5b6f]/10 to-[#9c5b6f]/5 text-[#9c5b6f] dark:text-[#e4a8b8] border-[#9c5b6f]/20",
      badge: revenueGrowth || "+0%",
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts,
      icon: AlertTriangle,
      color: "from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20",
      badge: "Needs action",
    },
    {
      title: "New Users",
      value: newUsersThisMonth,
      icon: UserPlus,
      color: "from-purple-500/10 to-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-500/20",
      badge: "This month",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {summaryCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-gradient-to-br border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {card.value}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniSummary;