import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleViewProductModal } from "../store/slices/extraSlice";
import { X, Layers, Tag, Box } from "lucide-react";

const ViewProductModal = () => {
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.extra || {});

  if (!selectedProduct) return null;

  const images = selectedProduct.images || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#150d11] rounded-3xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
        
        <button
          onClick={() => dispatch(toggleViewProductModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            ID: {selectedProduct.id || selectedProduct._id}
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {selectedProduct.name || selectedProduct.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img?.url || img}
                    alt={`Product ${idx}`}
                    className="w-full h-32 rounded-2xl object-cover border border-slate-200/80 dark:border-white/10"
                  />
                ))
              ) : (
                <div className="col-span-2 h-36 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs text-slate-400">
                  No images attached
                </div>
              )}
            </div>
          </div>

          {/* Info Details */}
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Description
              </p>
              <p className="text-slate-700 dark:text-slate-300 mt-1">
                {selectedProduct.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  {selectedProduct.category || "General"}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                <p className="font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  ৳{Number(selectedProduct.price || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Stock</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Box className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  {Number(selectedProduct.stock) > 0
                    ? `${selectedProduct.stock} units available`
                    : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewProductModal;