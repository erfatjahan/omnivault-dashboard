import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ১. সমস্ত অর্ডার ফেচ করা (অ্যাডমিন)
export const fetchAdminOrders = createAsyncThunk(
  "order/fetchAdminOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/admin/orders");
      return res.data.orders || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch orders.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// অন্যান্য কম্পোনেন্টের সাপোর্টের জন্য একই থাঙ্ক এক্সপোর্ট
export const fetchAllOrders = fetchAdminOrders;

// ২. অর্ডার স্ট্যাটাস আপডেট
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/order/admin/order/${orderId}`, {
        status,
        order_status: status,
      });
      toast.success(res.data.message || "Order status updated!");
      return { orderId, status };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update order status.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ৩. অর্ডার ডিলিট
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/order/admin/order/${orderId}`);
      toast.success(res.data.message || "Order deleted successfully!");
      return orderId;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete order.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const index = state.orders.findIndex(
          (o) => String(o.id || o._id) === String(orderId)
        );
        if (index !== -1) {
          state.orders[index].order_status = status;
          state.orders[index].orderStatus = status;
        }
      })

      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (o) => String(o.id || o._id) !== String(action.payload)
        );
      });
  },
});

export default orderSlice.reducer;