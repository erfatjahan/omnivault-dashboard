import React from "react";
import { useSelector } from "react-redux";
import { Package, TrendingUp } from "lucide-react";

const TopSellingProducts = () => {
  const { topSellingProducts = [] } = useSelector((state) => state.admin || {});

  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      category: "Electronics",
      price: 4500,
      totalSold: 140,
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      category: "Home & Garden",
      price: 12500,
      totalSold: 98,
    },
    {
      id: 3,
      name: "Sports Running Shoes",
      category: "Sports",
      price: 3200,
      totalSold: 85,
    },
  ];

  const productList =
    topSellingProducts.length > 0 ? topSellingProducts : sampleProducts;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Top Selling Products
          </h3>
          <p className="text-[11px] text-slate-400">Best performing inventory items</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Unit Price</th>
              <th className="py-3 px-4 text-right">Units Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
            {productList.map((prod, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#9c5b6f]" />
                  <span className="truncate max-w-xs">{prod.name}</span>
                </td>
                <td className="py-3 px-4 text-slate-500">{prod.category || "General"}</td>
                <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                  ৳{Number(prod.price || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {prod.totalSold || prod.sales || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;