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
  const { topSellingProducts = [] } = useSelector((state) => state.admin || {});

  const sampleProducts = [
    { name: "Wireless Earbuds", sales: 120 },
    { name: "Smart Watch", sales: 95 },
    { name: "Running Shoes", sales: 80 },
    { name: "Backpack", sales: 60 },
  ];

  const chartData =
    topSellingProducts.length > 0
      ? topSellingProducts.map((p) => ({
          name: p.name?.slice(0, 12) + "...",
          sales: p.totalSold || p.sales || 0,
        }))
      : sampleProducts;

  const barColors = ["#9c5b6f", "#b36b81", "#c97c94", "#df8da6"];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Top Products Sales
        </h3>
        <p className="text-[11px] text-slate-400">Sales volume by item</p>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              fontSize={11}
              stroke="#94a3b8"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#150d11",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="sales" radius={[0, 8, 8, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;