"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  School, 
  CreditCard, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/super-admin" },
  { icon: School, label: "إدارة المدارس", href: "/super-admin/schools" },
  { icon: CreditCard, label: "باقات الاشتراك", href: "/super-admin/plans" },
  { icon: ClipboardList, label: "طلبات الاشتراك", href: "/super-admin/requests" },
  { icon: Users, label: "المستخدمين", href: "/super-admin/users" },
  { icon: Settings, label: "الإعدادات العامة", href: "/super-admin/settings" },
];

export default function SuperAdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "bg-slate-900 text-slate-300 h-screen fixed inset-y-0 right-0 z-50 w-64 flex flex-col border-l border-slate-800 shadow-xl overflow-y-auto shrink-0 transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0",
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            E
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Super Admin</span>
        </div>
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-indigo-600/10 text-white border-r-4 border-indigo-600" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-indigo-500" : "text-slate-400 group-hover:text-white"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-indigo-500 rounded-l-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 w-full text-slate-400">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
