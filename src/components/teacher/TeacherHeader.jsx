"use client";
import { Bell, Search, BookOpen, GraduationCap } from "lucide-react";
import { useSelector } from "react-redux";
import React from "react";

export default function TeacherHeader({ slug }) {
  const { user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const actualUser = user?.userData || user;
  const displayName = mounted
    ? actualUser?.firstName || "معلم"
    : "معلم";

  const schoolDisplayName = decodeURIComponent(slug || '').replace(/-/g, ' ');

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 lg:px-10 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      {/* Right: Welcome message */}
      <div className="flex items-center gap-4 mr-12 lg:mr-0">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800">
              مرحباً، {displayName} 👋
            </h2>
            <p className="text-xs font-bold text-slate-400 capitalize">{schoolDisplayName}</p>
          </div>
        </div>
      </div>

      {/* Left: Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:block relative group">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="ابحث عن طالب..."
            className="w-56 bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>
  );
}
