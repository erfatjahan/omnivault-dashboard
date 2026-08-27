import React from "react";
import { formatNumber } from "../../lib/helper";
import { useSelector } from "react-redux";
import { DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Stats = () => {
  const {
    todayRevenue = 0,
    yesterdayRevenue = 0,
    totalUsersCount = 0,
    totalUsers = 0,
  } = useSelector((state) => state.admin || {});

  const revenueDiff = todayRevenue - yesterdayRevenue;
  const isRevenueUp = revenueDiff >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Yesterday vs Today Revenue */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Yesterday vs Today
          </p>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            ৳{Number(todayRevenue).toLocaleString()}
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
            {isRevenueUp ? (
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +৳{formatNumber(revenueDiff)}
              </span>
            ) : (
              <span className="text-rose-500 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> -৳{formatNumber(Math.abs(revenueDiff))}
              </span>
            )}
            <span>vs yesterday (৳{formatNumber(yesterdayRevenue)})</span>
          </p>
        </div>
      </div>

      {/* Registered User Base */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Customer Base
          </p>
          <div className="p-2 rounded-xl bg-[#9c5b6f]/10 text-[#9c5b6f]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {totalUsersCount || totalUsers || 0}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Total registered accounts on platform
          </p>
        </div>
      </div>

      {/* Store Conversion Health */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fulfillment Rate
          </p>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            94.8%
          </h3>
          <p className="text-xs font-medium text-emerald-500 mt-1">
            High order completion rate
          </p>
        </div>
      </div>

    </div>
  );
};

export default Stats;