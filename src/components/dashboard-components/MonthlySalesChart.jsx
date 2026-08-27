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
  const { monthlySales = [] } = useSelector((state) => state.admin || {});

  // গত ৬ মাসের ডামি ডেটা ফলব্যাক
  const defaultMonths = getLastNMonths(6).map((item) => ({
    month: item.month,
    sales: 0,
  }));

  const chartData = monthlySales.length > 0 ? monthlySales : defaultMonths;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Monthly Revenue Trend
          </h3>
          <p className="text-[11px] text-slate-400">Sales performance over time</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
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
                borderRadius: "16px",
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
      </div>
    </div>
  );
};

export default MonthlySalesChart;