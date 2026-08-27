import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct, fetchAllProducts } from "../store/slices/productsSlice";
import { toggleCreateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle, X, Upload } from "lucide-react";

const CreateProductModal = () => {
  const dispatch = useDispatch();
  const { isCreating } = useSelector((state) => state.products || {});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
    images: [],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }

    const res = await dispatch(createNewProduct(data));
    if (!res.error) {
      dispatch(fetchAllProducts()); // 👈 প্রোডাক্ট তৈরি হওয়ার সাথে সাথে তালিকা রিফ্রেশ হবে
      dispatch(toggleCreateProductModal());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#150d11] rounded-3xl w-full max-w-2xl p-6 relative border border-slate-200/80 dark:border-white/10 shadow-2xl">
        <button
          onClick={() => dispatch(toggleCreateProductModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
          Create New Product
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
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
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
          />

          <input
            type="number"
            required
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
          />

          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-xs text-slate-500 cursor-pointer hover:border-[#9c5b6f]">
              <Upload className="w-4 h-4 text-[#9c5b6f]" />
              <span>
                {formData.images.length > 0
                  ? `${formData.images.length} images selected`
                  : "Upload Product Images"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: Array.from(e.target.files),
                  })
                }
                className="hidden"
              />
            </label>
          </div>

          <textarea
            required
            placeholder="Product Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] col-span-1 md:col-span-2"
            rows={3}
          />

          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center justify-center gap-2 bg-[#9c5b6f] hover:bg-[#854b5d] text-white py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm col-span-1 md:col-span-2 shadow-lg shadow-[#9c5b6f]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span>Creating Product...</span>
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;