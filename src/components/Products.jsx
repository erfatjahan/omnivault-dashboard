import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, 
  Search, 
  Package, 
  Eye, 
  Pencil, 
  Trash2, 
  LoaderCircle,
  AlertTriangle,
  Layers
} from "lucide-react";
import Header from "./Header";
import CreateProductModal from "../modals/CreateProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";
import { fetchAllProducts, deleteProduct } from "../store/slices/productsSlice";
import { 
  toggleCreateProductModal, 
  toggleUpdateProductModal, 
  toggleViewProductModal 
} from "../store/slices/extraSlice";

const Products = () => {
  const dispatch = useDispatch();

  const { products = [], loading = false, isDeleting = false } = useSelector(
    (state) => state.products || state.product || {}
  );
  const { 
    isCreateProductModalOpened, 
    isUpdateProductModalOpened, 
    isViewProductModalOpened 
  } = useSelector((state) => state.extra || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // ডাইনামিক ক্যাটাগরি তালিকা ফিল্টারিং
  const categories = ["All", ...new Set((products || []).map((p) => p.category).filter(Boolean))];

  const filteredProducts = (products || []).filter((prod) => {
    // 🔴 Postgres (title) এবং MongoDB/সাধারণ (name) দুই ফরম্যাটই সাপোর্ট করবে
    const title = String(prod.title || prod.name || "").toLowerCase();
    const desc = String(prod.description || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = title.includes(search) || desc.includes(search);
    const matchesCategory =
      selectedCategory === "All" || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(res)) {
        dispatch(fetchAllProducts()); // ডিলিট হওয়ার পর তালিকা রিফ্রেশ
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header />

      <div className="p-6 space-y-6">
        
        {/* Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-[#9c5b6f]" /> Store Inventory
            </h1>
            <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
              Add, update, view, or manage your stock catalog
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleCreateProductModal())}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#9c5b6f]/25 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] transition-all"
            />
          </div>

          {/* Category Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-slate-400">
                      <LoaderCircle className="w-6 h-6 animate-spin mx-auto text-[#9c5b6f] mb-2" />
                      Loading inventory...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => {
                    const id = prod.id || prod._id;
                    const title = prod.title || prod.name || "Product";
                    const stock = Number(prod.stock || prod.quantity || 0);
                    const isOutOfStock = stock === 0;
                    const isLowStock = stock > 0 && stock <= 5;
                    
                    // 🔴 ইমেজ হ্যান্ডলার
                    const image =
                      prod.image?.url ||
                      prod.images?.[0]?.url ||
                      (typeof prod.image === "string" ? prod.image : null) ||
                      (Array.isArray(prod.images) ? prod.images[0] : null) ||
                      "https://placehold.co/100x100?text=Product";

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Image & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={title}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                                {title}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate max-w-xs">
                                {prod.description?.slice(0, 45)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold">
                            <Layers className="w-3 h-3 text-[#9c5b6f]" />
                            {prod.category || "General"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-black text-slate-900 dark:text-white">
                          ৳{Number(prod.price || 0).toLocaleString()}
                        </td>

                        {/* Stock Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                              isOutOfStock
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : isLowStock
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {isOutOfStock ? (
                              "Out of Stock"
                            ) : (
                              <>
                                {isLowStock && <AlertTriangle className="w-3 h-3" />}
                                {stock} units
                              </>
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => dispatch(toggleViewProductModal(prod))}
                              title="View Details"
                              className="p-2 rounded-xl text-slate-500 hover:text-[#9c5b6f] hover:bg-[#9c5b6f]/10 dark:hover:bg-white/5 transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => dispatch(toggleUpdateProductModal(prod))}
                              title="Edit Product"
                              className="p-2 rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 dark:hover:bg-white/5 transition-all cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(id)}
                              disabled={isDeleting}
                              title="Delete Product"
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-white/5 transition-all cursor-pointer disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-14 text-center text-slate-400">
                      No products found. Click "Add New Product" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Product Modals */}
      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && <UpdateProductModal />}
      {isViewProductModalOpened && <ViewProductModal />}
    </div>
  );
};

export default Products;