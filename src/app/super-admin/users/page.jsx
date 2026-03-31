"use client";

import React from "react";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatusBadge from "@/components/dashboard/super-admin/StatusBadge";

const mockUsers = [
  {
    id: "1",
    name: "أحمد بن حافظ",
    email: "admin@eduflow.app",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    lastLogin: "منذ 10 دقائق",
    avatar: "https://ui-avatars.com/api/?name=أحمد+حافظ&background=4f46e5&color=fff"
  },
  {
    id: "2",
    name: "علي بن حسن",
    email: "ali@hope.edu",
    role: "SCHOOL_ADMIN",
    school: "مدرسة الأمل",
    status: "ACTIVE",
    lastLogin: "منذ ساعتين",
    avatar: "https://ui-avatars.com/api/?name=علي+حسن&background=0284c7&color=fff"
  },
  {
    id: "3",
    name: "مريم العلي",
    email: "maryam@future.edu",
    role: "TEACHER",
    school: "أكاديمية المستقبل",
    status: "INACTIVE",
    lastLogin: "منذ 3 أيام",
    avatar: "https://ui-avatars.com/api/?name=مريم+العلي&background=7c3aed&color=fff"
  }
];

export default function UsersManagement() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <DashboardPageHeader 
        title="إدارة المستخدمين"
        description="عرض وإدارة جميع حسابات المستخدمين في كافة المدارس."
        primaryAction={{
          label: "إضافة مدير نظام",
          icon: UserPlus,
          variant: "indigo",
          onClick: () => console.log("Add User")
        }}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="البحث عن مستخدم..." 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 rounded-xl py-3 pr-11 pl-4 text-sm outline-none"
            />
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
               <Filter className="w-4 h-4" />
               تصفية بالأدوار
            </button>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">المستخدم</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الرتبة</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">المدرسة</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">آخر ظهور</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {mockUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl shadow-sm group-hover:scale-110 transition-transform" alt="" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">{user.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                    user.role === "SUPER_ADMIN" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-xs text-slate-600 dark:text-slate-400">
                  {user.school || "—"}
                </td>
                <td className="px-6 py-6">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-6">
                  <button className="p-2 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-xl transition-all">
                    <MoreVertical className="w-4 h-4 text-slate-400 font-black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
