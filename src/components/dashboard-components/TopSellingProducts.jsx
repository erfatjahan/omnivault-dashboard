import React from "react";
import { useSelector } from "react-redux";
import { Package, TrendingUp } from "lucide-react";

const TopSellingProducts = () => {
  const { topSellingProducts = [], loading = false } = useSelector(
    (state) => state.admin || {}
  );

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Top Selling Products
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time best performing inventory items
          </p>
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
            {loading ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-400">
                  Loading sales data...
                </td>
              </tr>
            ) : topSellingProducts.length > 0 ? (
              topSellingProducts.map((prod, idx) => {
                const title =
                  prod.name || prod.title || prod.product_name || "Unnamed Product";
                const category =
                  prod.category?.name ||
                  prod.category ||
                  prod.category_name ||
                  "General";
                const price = Number(prod.price || 0);
                const unitsSold = Number(
                  prod.totalSold ??
                    prod.soldCount ??
                    prod.unitsSold ??
                    prod.total_sold ??
                    prod.sales ??
                    0
                );

                return (
                  <tr
                    key={prod.id || prod._id || prod.product_id || idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#9c5b6f] shrink-0" />
                        <span className="truncate max-w-xs">{title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{category}</td>
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                      ৳{price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>{unitsSold.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 text-xs">
                  No sales recorded yet. Completed orders will appear here automatically.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;