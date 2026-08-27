import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Mail, KeyRound, ArrowLeft, Send, Loader2 } from "lucide-react";
import { forgotPassword } from "../store/slices/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth || {}
  );

  const [email, setEmail] = useState("");

  // ইতিমধ্যে লগইন করা থাকলে ড্যাশবোর্ডে রিডাইরেক্ট হবে
  if (isAuthenticated && user?.role === "Admin") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f9] dark:bg-[#0f090c] p-4 sm:p-6 transition-colors duration-500">
      <div className="w-full max-w-md bg-white dark:bg-[#150d11] rounded-3xl p-8 shadow-xl border border-slate-200/80 dark:border-white/10 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] mb-2 shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs text-slate-500 dark:text-rose-200/60 font-medium leading-relaxed">
            Enter your admin email address and we'll send you a secure link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#9c5b6f]/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="pt-2 text-center border-t border-slate-100 dark:border-white/5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-rose-200/70 hover:text-[#9c5b6f] dark:hover:text-[#e4a8b8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;