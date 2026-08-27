import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const OrdersChart = () => {
  const { orderStatusCounts = {} } = useSelector((state) => state.admin || {});

  const statusColors = {
    Processing: "#6366f1", // Indigo
    Shipped: "#3b82f6",    // Blue
    Delivered: "#10b981",  // Emerald
    Cancelled: "#f43f5e",  // Rose
    Pending: "#f59e0b",    // Amber
  };

  const defaultStatus = {
    Processing: 12,
    Shipped: 25,
    Delivered: 45,
    Cancelled: 4,
    Pending: 8,
  };

  const currentCounts =
    Object.keys(orderStatusCounts).length > 0
      ? orderStatusCounts
      : defaultStatus;

  const orderStatusData = Object.keys(currentCounts).map((status) => ({
    status,
    count: parseInt(currentCounts[status], 10) || 0,
  }));

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Order Status
        </h3>
        <p className="text-[11px] text-slate-400">Shipment fulfillment breakdown</p>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.status] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#150d11",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-bold">
        {orderStatusData.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: statusColors[item.status] || "#94a3b8" }}
            />
            <span>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersChart;