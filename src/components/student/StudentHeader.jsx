"use client";

import { Bell, Search, User as UserIcon, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function StudentHeader({ slug }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const userData = user?.userData || user;
  const firstName = userData?.firstName || "طالب";
  const lastName = userData?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم تسجيل خروجك من النظام.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // emerald-500
      cancelButtonColor: "#64748b",
      confirmButtonText: "نعم، خروج",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
      customClass: {
        popup: "rounded-[32px] font-sans border border-slate-100 shadow-2xl",
        title: "font-black text-slate-800",
        htmlContainer: "text-slate-500 font-bold",
        confirmButton: "rounded-2xl px-10 py-3 font-black text-sm",
        cancelButton: "rounded-2xl px-10 py-3 font-black text-sm",
      },
    });

    if (result.isConfirmed) {
      try {
        await dispatch(logout()).unwrap();
        toast.success("تم تسجيل الخروج بنجاح");
        router.push(`/school/${slug}/login`);
      } catch {
        router.push(`/school/${slug}/login`);
      }
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
      {/* Search Bar Area */}
      <div className="hidden md:flex items-center bg-slate-100/50 rounded-2xl px-4 py-2.5 w-80 border border-slate-200/50 focus-within:border-emerald-500/50 focus-within:bg-white transition-all shadow-input">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        <input
          type="text"
          placeholder="ابحث عن مواد، درجات، مدفوعات..."
          className="bg-transparent border-none outline-none w-full px-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium"
        />
      </div>

      <div className="flex-1 md:hidden" /> {/* Spacer for Mobile */}

      {/* User Actions */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Notifications */}
        <button className="hidden sm:block relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-slate-200/60 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-slate-800">{fullName}</span>
            <span className="hidden sm:block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
              طالب
            </span>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 items-center justify-center shadow-inner overflow-hidden">
            {userData?.image ? (
              <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-emerald-600" />
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
