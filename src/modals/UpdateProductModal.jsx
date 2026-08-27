import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";
import { updateProduct } from "../store/slices/productsSlice";
import { LoaderCircle, X } from "lucide-react";

const UpdateProductModal = () => {
  const dispatch = useDispatch();
  const { isUpdating } = useSelector((state) => state.products || {});
  const { selectedProduct } = useSelector((state) => state.extra || {});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
  });

  const categoryOptions = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
    "Kids & Baby",
  ];

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "Electronics",
        stock: selectedProduct.stock || "",
      });
    }
  }, [selectedProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productId = selectedProduct?.id || selectedProduct?._id;
    if (!productId) return;

    dispatch(updateProduct({ productId, formData })).then((res) => {
      if (!res.error) {
        dispatch(toggleUpdateProductModal());
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#150d11] rounded-3xl w-full max-w-2xl p-6 relative border border-slate-200/80 dark:border-white/10 shadow-2xl">
        <button
          onClick={() => dispatch(toggleUpdateProductModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
          Update Product
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            required
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
          />

          <select
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            {categoryOptions.map((cat, idx) => (
              <option key={idx} value={cat} className="dark:bg-[#150d11]">
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            required
            placeholder="Price (৳)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
          />

          <input
            type="number"
            required
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
          />

          <textarea
            required
            placeholder="Product Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] col-span-1 md:col-span-2"
            rows={3}
          />

          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center justify-center gap-2 bg-[#9c5b6f] hover:bg-[#854b5d] text-white py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm col-span-1 md:col-span-2 shadow-lg shadow-[#9c5b6f]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span>Updating Product...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;