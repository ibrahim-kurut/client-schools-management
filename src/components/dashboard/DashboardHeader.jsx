"use client";
import { Bell, Search, Settings, Sun, Moon } from 'lucide-react';

export default function DashboardHeader({ slug }) {
  const userName = "school admin";

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-6 px-10 py-6 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200">
      {/* Welcome Message */}
      <h1 className="text-2xl font-black text-slate-800">
        أهلاً بك، {userName}
      </h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text" 
          placeholder="ابحث هنا..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3">
        <button className="p-3 rounded-2xl bg-white text-slate-600 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
          <Moon className="w-5 h-5" />
        </button>
        <button className="relative p-3 rounded-2xl bg-white text-slate-600 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-3 rounded-2xl bg-white text-slate-600 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
