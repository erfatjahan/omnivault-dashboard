import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Bell, ShieldCheck, User } from "lucide-react";
import avatarFallback from "../assets/avatar.jpg";
import { toggleNavbar, toggleComponent } from "../store/slices/extraSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const [imgError, setImgError] = useState(false);

  const avatarSrc =
    !imgError && (user?.avatar?.url || user?.avatar)
      ? user?.avatar?.url || user?.avatar
      : avatarFallback;

  const roleText =
    user?.role && typeof user.role === "string"
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
      : "Admin";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/80 dark:bg-[#150d11]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => dispatch(toggleNavbar())}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="hidden sm:block text-[11px] font-medium text-slate-400 dark:text-rose-200/60">
            Manage your store data, orders and products
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#9c5b6f] ring-2 ring-white dark:ring-[#150d11]" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block" />

        <button
          type="button"
          onClick={() => dispatch(toggleComponent("profile"))}
          className="flex items-center gap-2.5 sm:gap-3 p-1 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
          aria-label="Open User Profile"
        >
          <div className="relative shrink-0">
            <img
              src={avatarSrc}
              alt={user?.name || "Admin Avatar"}
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#9c5b6f]/30 group-hover:ring-[#9c5b6f] transition-all bg-slate-100 dark:bg-white/5"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#150d11]"
              title="Active Status"
            />
          </div>

          <div className="hidden md:block max-w-[140px]">
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[10px] font-semibold text-[#9c5b6f] dark:text-[#e4a8b8] flex items-center gap-1 mt-0.5 capitalize">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span className="truncate">{roleText}</span>
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;