"use client";

import React from "react";
import SuperAdminSidebar from "@/components/dashboard/SuperAdminSidebar";
import SuperAdminHeader from "@/components/dashboard/SuperAdminHeader";

export default function SuperAdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SuperAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <SuperAdminHeader onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scroll-smooth relative z-0">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {children}
          </div>
        </main>

        <footer className="h-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-1.5 group">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
            <span className="group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">نظام EduFlow الإداري متاح الآن</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default underline decoration-indigo-500/30 underline-offset-4">نسخة v1.0.4 - بريميوم</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default" suppressHydrationWarning>
              جميع الحقوق محفوظة {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
