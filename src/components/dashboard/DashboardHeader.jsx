"use client";
import { Search, Settings, Sun, Moon, Menu } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '@/redux/slices/uiSlice';

export default function DashboardHeader({ slug }) {
  const dispatch = useDispatch();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-10 py-4 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200/60">
      {/* Mobile Menu Toggle & Search Container */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2.5 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative group hidden sm:block">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="البحث في النظام..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:text-blue-600">
            <Moon className="w-5 h-5" />
          </button>
        </div>
        
        <NotificationsDropdown />
        
        <button className="p-2.5 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:text-blue-600">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
