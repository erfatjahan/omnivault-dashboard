import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TopProductsChart = () => {
  const { topSellingProducts = [], loading = false } = useSelector(
    (state) => state.admin || {}
  );

  const chartData = (topSellingProducts || [])
    .slice(0, 5)
    .map((p) => {
      const rawTitle = p.name || p.title || p.product_name || "Unnamed";
      const displayName =
        rawTitle.length > 14 ? `${rawTitle.slice(0, 14)}...` : rawTitle;

      const sales = Number(
        p.totalSold ??
          p.soldCount ??
          p.unitsSold ??
          p.total_sold ??
          p.sales ??
          0
      );

      return {
        name: displayName,
        fullName: rawTitle,
        sales,
      };
    });

  const barColors = ["#9c5b6f", "#b36b81", "#c97c94", "#df8da6", "#f0a2ba"];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Top Products Sales
        </h3>
        <p className="text-[11px] text-slate-400">Sales volume by item</p>
      </div>

      <div className="w-full h-56 flex items-center justify-center">
        {loading ? (
          <p className="text-xs text-slate-400">Loading chart data...</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                fontSize={11}
                width={100}
                stroke="#94a3b8"
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                formatter={(value) => [`${value} units`, "Sold"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName || ""
                }
                contentStyle={{
                  backgroundColor: "#150d11",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="sales" radius={[0, 8, 8, 0]} barSize={16}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-400">
            No sales data available to display chart.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;