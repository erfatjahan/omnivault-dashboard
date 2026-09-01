
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      toast.success(res.data.message || "Login Successful!");
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      return res.data?.user || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Invalid credentials.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data?.user || res.data;
    } catch (error) {
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Session expired."
      );
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      toast.success(res.data.message || "Logged out successfully!");
      localStorage.removeItem("token");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed.";
      toast.error(message);
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Profile updated successfully!");
      return res.data?.user || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ currentPassword, newPassword, confirmNewPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/password/update", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success(res.data.message || "Password updated successfully!");
      return res.data?.user || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update password.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/password/forgot", { email });
      toast.success(res.data.message || "Reset link sent to email!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(res.data.message || "Password reset successfully!");
      return res.data?.user || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        localStorage.removeItem("token");
      })

      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload?.user || action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload;
      })

      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;