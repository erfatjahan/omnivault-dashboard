import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/stats");
    
      return res.data?.stats || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats."
      );
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/users");
      return res.data?.users || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users."
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/user/${userId}/role`, { role });
      toast.success(res.data.message || "User role updated successfully!");
      return { userId, role };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update role.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/user/${userId}`);
      toast.success(res.data.message || "User deleted successfully!");
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    users: [],
    totalUsersCount: 0,
    newUsersThisMonth: 0,
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    currentMonthSales: 0,
    revenueGrowth: "0%",
    lowStockProducts: 0,
    monthlySales: [],
    topSellingProducts: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {};
        state.totalUsersCount = Number(
          data.totalUsersCount ?? data.totalUsers ?? data.usersCount ?? state.totalUsersCount
        );
        state.newUsersThisMonth = Number(
          data.newUsersThisMonth ?? data.newUsers ?? 0
        );
        state.totalRevenueAllTime = Number(
          data.totalRevenueAllTime ?? data.totalRevenue ?? 0
        );
        state.todayRevenue = Number(data.todayRevenue ?? 0);
        state.yesterdayRevenue = Number(data.yesterdayRevenue ?? 0);
        state.currentMonthSales = Number(
          data.currentMonthSales ?? data.monthlySalesTotal ?? 0
        );
        state.revenueGrowth = String(data.revenueGrowth ?? "0%");
        state.lowStockProducts = data.lowStockProducts ?? 0;
        state.monthlySales = Array.isArray(data.monthlySales) ? data.monthlySales : [];
        state.topSellingProducts = Array.isArray(data.topSellingProducts)
          ? data.topSellingProducts
          : [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        if (state.users.length > 0) {
          state.totalUsersCount = state.users.length;
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const index = state.users.findIndex(
          (u) => String(u.id || u._id) === String(userId)
        );
        if (index !== -1) {
          state.users[index].role = role;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => String(u.id || u._id) !== String(action.payload)
        );
        state.totalUsersCount = state.users.length;
      });
  },
});

export default adminSlice.reducer;