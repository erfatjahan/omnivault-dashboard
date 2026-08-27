import React from "react";
import {
  Bell,
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  LogOut,
  MoveLeft,
  Store,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleComponent, toggleNavbar } from "../store/slices/extraSlice";
import { logout } from "../store/slices/authSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { openedComponent = "Dashboard", isNavbarOpened = false } = useSelector(
    (state) => state.extra || {}
  );

  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ListOrdered },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleSelect = (componentName) => {
    dispatch(toggleComponent(componentName));
    if (isNavbarOpened) {
      dispatch(toggleNavbar());
    }
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/login");
    });
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isNavbarOpened && (
        <div
          onClick={() => dispatch(toggleNavbar())}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#150d11] border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isNavbarOpened ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header & Navigation */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#9c5b6f] to-[#b36b81] flex items-center justify-center text-white shadow-md shadow-[#9c5b6f]/25">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Admin Panel
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => dispatch(toggleNavbar())}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <MoveLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                openedComponent?.toLowerCase() === item.id.toLowerCase();

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#9c5b6f] text-white shadow-lg shadow-[#9c5b6f]/25"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;