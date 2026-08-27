import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Package, 
  Truck, 
  XCircle, 
  AlertCircle,
  X,
  User,
  MapPin,
  Phone,
  CreditCard
} from "lucide-react";
import Header from "./Header";
import { fetchAdminOrders, updateOrderStatus, deleteOrder } from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order?.orders || state.orders?.orders || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); // 👈 View Details Modal State

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const orderId = String(order.id || order._id || "").toLowerCase();
    const customer = String(order.customerName || order.shipping_info?.full_name || order.user?.name || "").toLowerCase();
    const email = String(order.customerEmail || order.user?.email || "").toLowerCase();
    const matchesSearch =
      orderId.includes(searchTerm.toLowerCase()) ||
      customer.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const currentStatus = order.order_status || order.orderStatus || order.status || "Pending";
    const matchesStatus =
      statusFilter === "All" || currentStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await dispatch(updateOrderStatus({ orderId, status: newStatus }));
    if (updateOrderStatus.fulfilled.match(res)) {
      dispatch(fetchAdminOrders());
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const res = await dispatch(deleteOrder(orderId));
      if (deleteOrder.fulfilled.match(res)) {
        dispatch(fetchAdminOrders());
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Package className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Header />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#9c5b6f]" /> Customer Orders
            </h1>
            <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
              View, filter, and manage customer orders and shipment statuses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
              Total Orders: <span className="text-[#9c5b6f] dark:text-[#e4a8b8]">{orders.length}</span>
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, Customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Update Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const id = order.id || order._id;
                    const customer = order.customerName || order.shipping_info?.full_name || order.user?.name || "Customer";
                    const email = order.customerEmail || order.user?.email || "N/A";
                    const currentStatus = order.order_status || order.orderStatus || order.status || "Pending";
                    const amount = order.total_price ?? order.totalAmount ?? order.totalPrice ?? 0;
                    const items = Array.isArray(order.order_items) 
                      ? order.order_items.length 
                      : Number(order.itemsCount || 0);

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                          {String(id).slice(0, 8)}...
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">{customer}</p>
                            <p className="text-[11px] text-slate-400">{email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">
                          {items} {items === 1 ? "item" : "items"}
                        </td>
                        <td className="py-4 px-6 font-black text-slate-900 dark:text-white">
                          ৳{Number(amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                            {order.payment_method || order.paymentMethod || "COD"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(currentStatus)}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                            className="text-xs font-bold py-1.5 px-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#9c5b6f] cursor-pointer"
                          >
                            <option value="Pending" className="dark:bg-[#150d11]">Pending</option>
                            <option value="Processing" className="dark:bg-[#150d11]">Processing</option>
                            <option value="Shipped" className="dark:bg-[#150d11]">Shipped</option>
                            <option value="Delivered" className="dark:bg-[#150d11]">Delivered</option>
                            <option value="Cancelled" className="dark:bg-[#150d11]">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* 🔴 Eye Icon দিয়ে Modal খোলা */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="View Details"
                              className="p-2 rounded-xl text-slate-500 hover:text-[#9c5b6f] hover:bg-[#9c5b6f]/10 dark:hover:bg-white/5 transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* ডিলিট বাটন */}
                            <button
                              onClick={() => handleDeleteOrder(id)}
                              title="Delete Order"
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-white/5 transition-all cursor-pointer"
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
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      No orders found matching your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔴 View Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1116] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Order Details
                </h3>
                <p className="text-xs font-mono text-slate-400">ID: {selectedOrder.id || selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-2 border border-slate-100 dark:border-white/5">
                <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm">
                  <User className="w-4 h-4 text-[#9c5b6f]" /> Customer Info
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Name:</strong> {selectedOrder.customerName || selectedOrder.shipping_info?.full_name || "N/A"}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Email:</strong> {selectedOrder.customerEmail || "N/A"}
                </p>
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.shipping_info?.phone || "N/A"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-2 border border-slate-100 dark:border-white/5">
                <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#9c5b6f]" /> Shipping Address
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedOrder.shipping_info?.address || "Address not provided"}
                </p>
                <p className="text-slate-500">
                  {selectedOrder.shipping_info?.city && `${selectedOrder.shipping_info?.city}, `}
                  {selectedOrder.shipping_info?.state && `${selectedOrder.shipping_info?.state} - `}
                  {selectedOrder.shipping_info?.pincode}
                </p>
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Payment:</strong> {selectedOrder.payment_method || "COD"} ({selectedOrder.payment_status || "Unpaid"})
                </p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Items ({selectedOrder.order_items?.length || 0})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  selectedOrder.order_items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                            {item.title || "Product"}
                          </p>
                          <p className="text-xs text-slate-400">
                            Quantity: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        ৳{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No product items found for this order.</p>
                )}
              </div>
            </div>

            {/* Order Summary Pricing */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-600 dark:text-slate-300">Total Order Amount:</span>
              <span className="text-lg font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
                ৳{Number(selectedOrder.total_price || selectedOrder.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;