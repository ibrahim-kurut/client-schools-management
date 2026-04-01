"use client";

import React, { useState } from "react";
import { Bell, Search, User, ChevronDown, HelpCircle, Globe, Settings } from "lucide-react";
import { useSelector } from "react-redux";

export default function SuperAdminHeader({ onMenuClick }) {


  const auth = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const superAdminName = auth?.user?.firstName + " " + auth?.user?.lastName;
  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 px-4 md:px-8 flex items-center justify-between z-10 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      
      {/* Mobile Toggle Button (Gear Icon) */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2.5 ml-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <Settings className="w-5 h-5 animate-spin-slow hover:text-indigo-600 transition-colors" />
      </button>

      <div className="flex items-center gap-6 flex-1 max-w-xl hidden md:flex">
        <div className="relative group w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="البحث عن مدرسة، مالي، أو اشتراك..."
            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 rounded-xl py-2.5 pr-11 pl-4 text-white text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <Globe className="w-5 h-5" />
        </button>

        {/* Support/Help */}
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
          </button>
        </div>

        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />

        {/* User Profile */}
        <button className="flex items-center gap-3 p-1.5 pr-1.5 pl-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95">
          <span className="text-left flex flex-col justify-center">
            <span className="font-bold text-sm text-slate-900 dark:text-white leading-none">مدير النظام</span>
            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest mt-1">
              {mounted ? superAdminName : "..."}
            </span>
          </span>
          <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-indigo-500/10">
            <span className="w-full h-full rounded-[6px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-indigo-600 dark:text-white overflow-hidden">
               <User className="w-6 h-6" />
            </span>
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
        </button>
      </div>
    </header>
  );
}
