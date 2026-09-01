import React from "react";
import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getLastNMonths, formatNumber } from "../../lib/helper";

const MonthlySalesChart = () => {
  const { monthlySales = [], loading = false } = useSelector(
    (state) => state.admin || {}
  );
  const last6Months = getLastNMonths(6);
  const chartData = last6Months.map((m) => {
    const matched = (monthlySales || []).find(
      (item) =>
        String(item.month || item.name || "").toLowerCase() ===
        String(m.month).toLowerCase()
    );

    const revenue = Number(
      matched?.revenue ??
        matched?.sales ??
        matched?.totalAmount ??
        matched?.totalSales ??
        matched?.amount ??
        0
    );

    return {
      month: m.month,
      sales: revenue,
    };
  });

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Monthly Revenue Trend
          </h3>
          <p className="text-[11px] text-slate-400">Sales performance over time</p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
          6M Total: ৳{totalRevenue.toLocaleString()}
        </span>
      </div>

      <div className="w-full h-72 flex items-center justify-center">
        {loading ? (
          <p className="text-xs text-slate-400">Loading trend data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.15} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `৳${formatNumber(val)}`}
              />
              <Tooltip
                formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#150d11",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#9c5b6f"
                strokeWidth={3}
                dot={{ r: 4, fill: "#9c5b6f" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlySalesChart;