import React from "react";
import {
  Wallet,
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
    loading = false,
  } = useSelector((state) => state.admin || {});

  const lowStockCount = Array.isArray(lowStockProducts)
    ? lowStockProducts.length
    : typeof lowStockProducts === "object" && lowStockProducts !== null
    ? Number(lowStockProducts.stock ?? lowStockProducts.count ?? 0)
    : Number(lowStockProducts || 0);
  const formatGrowth = (val) => {
    if (typeof val === "number") {
      return val > 0 ? `+${val}%` : `${val}%`;
    }
    if (typeof val === "string") {
      const clean = val.trim();
      if (!clean.startsWith("+") && !clean.startsWith("-") && clean !== "0%") {
        return `+${clean}`;
      }
      return clean;
    }
    return "+0%";
  };

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `৳${formatNumber(Number(totalRevenueAllTime || 0))}`,
      icon: Wallet,
      color:
        "from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      badge: "All time",
      badgeColor: "bg-slate-100 dark:bg-white/5 text-slate-500",
    },
    {
      title: "Today's Revenue",
      value: `৳${Number(todayRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color:
        "from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20",
      badge: "Live",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "This Month Sales",
      value: `৳${formatNumber(Number(currentMonthSales || 0))}`,
      icon: BarChart4,
      color:
        "from-[#9c5b6f]/10 to-[#9c5b6f]/5 text-[#9c5b6f] dark:text-[#e4a8b8] border-[#9c5b6f]/20",
      badge: formatGrowth(revenueGrowth),
      badgeColor: "bg-[#9c5b6f]/10 text-[#9c5b6f] dark:text-[#e4a8b8]",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      color:
        "from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20",
      badge: lowStockCount > 0 ? "Needs action" : "Optimal",
      badgeColor:
        lowStockCount > 0
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "bg-slate-100 dark:bg-white/5 text-slate-500",
    },
    {
      title: "New Users",
      value: Number(
        typeof newUsersThisMonth === "object" ? 0 : newUsersThisMonth || 0
      ).toLocaleString(),
      icon: UserPlus,
      color:
        "from-purple-500/10 to-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-500/20",
      badge: "This month",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {summaryCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div
                className={`p-2 rounded-xl bg-gradient-to-br border ${card.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              {loading ? (
                <div className="h-7 w-20 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
              ) : (
                <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
                  {card.value}
                </h3>
              )}

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${card.badgeColor}`}
              >
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