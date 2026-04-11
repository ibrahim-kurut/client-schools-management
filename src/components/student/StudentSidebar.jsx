"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Clock,
  CreditCard,
  Menu,
  X,
  Target
} from "lucide-react";

export default function StudentSidebar({ slug }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "الرئيسية", icon: LayoutDashboard, path: `/school/${slug}/student` },
    { name: "الدرجات الأكاديمية", icon: FileText, path: `/school/${slug}/student/grades` },
    { name: "الجدول الدراسي", icon: Calendar, path: `/school/${slug}/student/schedule` },
    { name: "سجل الحضور", icon: Clock, path: `/school/${slug}/student/attendance` },
    { name: "السجل المالي", icon: CreditCard, path: `/school/${slug}/student/payments` },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Core */}
      <aside
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-72 bg-white/80 backdrop-blur-xl border-l border-white/40 shadow-[8px_0_24px_-12px_rgba(0,0,0,0.1)]
          transform transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100/50 bg-gradient-to-l from-emerald-50/50 to-transparent">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-800 tracking-tight">منصة الطالب</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">بوابة التعليم الذكية</span>
            </div>
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            // Fix: the "Home" path should only match exactly, otherwise it stays active on all nested paths.
            const isHome = item.path === `/school/${slug}/student`;
            const isActive = isHome 
              ? pathname === item.path 
              : (pathname === item.path || pathname?.startsWith(`${item.path}/`));
              
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50"
                  }
                `}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full shadow-sm" />
                )}

                <div
                  className={`
                  p-2 rounded-xl transition-colors duration-300
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100/50 text-slate-400 group-hover:bg-emerald-100/50 group-hover:text-emerald-600"
                  }
                `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`text-sm tracking-wide ${isActive ? "font-bold" : "font-semibold"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100/50 bg-slate-50/50">
          <div className="bg-gradient-to-br from-emerald-100/50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-800 mb-2">تحتاج مساعدة؟</p>
            <p className="text-[11px] text-emerald-600/80 leading-relaxed">
              تواصل مع إدارة المدرسة أو الدعم الفني لحل أي مشكلة تواجهك.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
