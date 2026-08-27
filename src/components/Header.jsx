import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Bell, ShieldCheck } from "lucide-react";
import avatarFallback from "../assets/avatar.jpg";
import { toggleNavbar, toggleComponent } from "../store/slices/extraSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#150d11]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
      
      {/* বাম পাশ: মোবাইল মেনু টগল ও পেজ টাইটেল */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleNavbar())}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="hidden sm:block text-[11px] font-medium text-slate-400 dark:text-rose-200/60">
            Manage your store data, orders and products
          </p>
        </div>
      </div>

      {/* ডান পাশ: নোটিফিকেশন ও অ্যাডমিন প্রোফাইল */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* নোটিফিকেশন বাটন */}
        <button
          className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#9c5b6f] ring-2 ring-white dark:ring-[#150d11]"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

        {/* প্রোফাইল কার্ড */}
        <button
          onClick={() => dispatch(toggleComponent("profile"))}
          className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-left cursor-pointer group"
        >
          <div className="relative">
            <img
              src={user?.avatar?.url || user?.avatar || avatarFallback}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#9c5b6f]/30 group-hover:ring-[#9c5b6f] transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#150d11]"></span>
          </div>

          <div className="hidden md:block">
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[10px] font-semibold text-[#9c5b6f] dark:text-[#e4a8b8] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> {user?.role || "Admin"}
            </p>
          </div>
        </button>
      </div>

    </header>
  );
};

export default Header;