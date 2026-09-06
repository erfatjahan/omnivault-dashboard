import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Users as UsersIcon, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  Trash2 
} from "lucide-react";
import Header from "./Header";
import avatarFallback from "../assets/avatar.jpg";
import { fetchAllUsers, sendRoleUpdateOTP, updateUserRoleWithOTP, deleteUser } from "../store/slices/adminSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users = [], totalUsersCount = 0 } = useSelector((state) => state.admin || state.user || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredUsers = (users || []).filter((u) => {
    const name = String(u.name || "").toLowerCase();
    const email = String(u.email || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" || u.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}? An OTP will be sent to your SuperAdmin email.`)) {
      return;
    }
    const otpRes = await dispatch(sendRoleUpdateOTP(userId));
    
    if (sendRoleUpdateOTP.fulfilled.match(otpRes)) {
      const otp = prompt("Enter the 6-digit OTP sent to your SuperAdmin email:");
      
      if (otp) {
        const updateRes = await dispatch(updateUserRoleWithOTP({ userId, role: newRole, otp }));
        if (updateUserRoleWithOTP.fulfilled.match(updateRes)) {
          dispatch(fetchAllUsers()); 
        }
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      const res = await dispatch(deleteUser(userId));
      if (deleteUser.fulfilled?.match(res) || !res?.error) {
        dispatch(fetchAllUsers());
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-[#9c5b6f]" /> Registered Accounts
            </h1>
            <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
              Manage system access permissions, administrative privileges and user roles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
              Total Accounts: <span className="text-[#9c5b6f] dark:text-[#e4a8b8]">{totalUsersCount || users.length}</span>
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
              placeholder="Search by name, email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto">
            {["All", "Admin", "User"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {role === "All" ? "All Users" : `${role}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Change Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => {
                    const id = item.id || item._id;
                    const roleName = item.role || "User";
                    const isAdmin = roleName.toLowerCase() === "admin";
                    const avatarSrc = item.avatar?.url || (typeof item.avatar === "string" ? item.avatar : null) || avatarFallback;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarSrc}
                              alt={item.name}
                              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-white/10 bg-slate-100 dark:bg-white/5"
                              onError={(e) => { e.currentTarget.src = avatarFallback; }}
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {item.name || "User"}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                ID: #{String(id).slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">
                          {item.email}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                              isAdmin
                                ? "bg-[#9c5b6f]/10 text-[#9c5b6f] dark:text-[#e4a8b8] border border-[#9c5b6f]/20"
                                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                            }`}
                          >
                            {isAdmin ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5" />
                            )}
                            {roleName}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={roleName}
                            onChange={(e) => handleRoleChange(id, e.target.value)}
                            className="text-xs font-bold py-1.5 px-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#9c5b6f] cursor-pointer"
                          >
                            <option value="User" className="dark:bg-[#150d11]">User</option>
                            <option value="Admin" className="dark:bg-[#150d11]">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteUser(id)}
                            title="Delete User"
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      No accounts found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;