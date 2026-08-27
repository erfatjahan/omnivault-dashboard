import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ১. ড্যাশবোর্ড পরিসংখ্যান ফেচ
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/stats");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats."
      );
    }
  }
);

// ২. সব ইউজার ফেচ
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/users");
      return res.data.users || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users."
      );
    }
  }
);

// ৩. রোল পরিবর্তন
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

// ৪. ইউজার ডিলিট
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
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    monthlySales: [],
    topSellingProducts: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.totalUsersCount = state.users.length;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const index = state.users.findIndex(
          (u) => String(u.id || u._id) === String(userId)
        );
        if (index !== -1) {
          state.users[index].role = role;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => String(u.id || u._id) !== String(action.payload)
        );
        state.totalUsersCount = state.users.length;
      });
  },
});

export default adminSlice.reducer;