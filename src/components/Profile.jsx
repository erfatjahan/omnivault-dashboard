import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Camera, 
  Lock, 
  KeyRound, 
  Loader2, 
  Save, 
  Eye, 
  EyeOff 
} from "lucide-react";
import Header from "./Header";
import avatarFallback from "../assets/avatar.jpg";
import { updateProfile, updatePassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth || {}
  );

  // Profile Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar?.url || user.avatar || "");
    }
  }, [user]);

  // ইমেজ ফাইল হ্যান্ডলার
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // প্রোফাইল আপডেট সাবমিট
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    dispatch(updateProfile(formData));
  };

  // পাসওয়ার্ড পরিবর্তন সাবমিট
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    dispatch(
      updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
    ).then((res) => {
      if (!res.error) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header />

      <div className="p-6 max-w-5xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-[#9c5b6f]" /> Admin Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
            Manage your personal administrative credentials and account security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* বাম পাশ: প্রোফাইল কার্ড ও ছবি আপলোড */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col items-center text-center space-y-4">
            
            <div className="relative group">
              <img
                src={avatarPreview || avatarFallback}
                alt="Admin"
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-[#9c5b6f]/20 shadow-md"
              />
              <label className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Change</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {user?.name || "Admin"}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {user?.email || "admin@example.com"}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 text-[#9c5b6f] dark:text-[#e4a8b8] text-xs font-bold border border-[#9c5b6f]/20">
                <ShieldCheck className="w-3.5 h-3.5" /> {user?.role || "Admin"}
              </div>
            </div>

          </div>

          {/* ডান পাশ: এডিট ফর্ম ও পাসওয়ার্ড চেঞ্জ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info Form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-white/5">
                Edit Information
              </h3>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 mb-1.5">
                    Email Address
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] text-white text-xs font-bold rounded-2xl shadow-md shadow-[#9c5b6f]/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#9c5b6f]" /> Change Password
              </h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 chars"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c5b6f]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 dark:bg-white/10 hover:bg-slate-900 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;