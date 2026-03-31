"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Plus,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatusBadge from "@/components/dashboard/super-admin/StatusBadge";

const mockSchools = [
  {
    id: "1",
    name: "مدرسة الأمل النموذجية",
    slug: "hope-model-school",
    owner: "أحمد محمد علي",
    email: "ahmed@hope.edu",
    phone: "0123456789",
    plan: "الباقة المتقدمة",
    status: "ACTIVE",
    students: 450,
    joinedDate: "2024-01-15",
    logo: "https://ui-avatars.com/api/?name=مدرسة+الأمل&background=4f46e5&color=fff"
  },
  {
    id: "2",
    name: "مدارس النور الأهلية",
    slug: "al-noor-schools",
    owner: "سارة محمود الرشيدي",
    email: "sara@alnoor.edu",
    phone: "0987654321",
    plan: "الباقة المتوسطة",
    status: "ACTIVE",
    students: 210,
    joinedDate: "2024-02-10",
    logo: "https://ui-avatars.com/api/?name=مدارس+النور&background=0284c7&color=fff"
  },
  {
    id: "3",
    name: "أكاديمية المستقبل الدولية",
    slug: "future-academy",
    owner: "خالد بن وليد",
    email: "khaled@future.edu",
    phone: "0554433221",
    plan: "الباقة المتقدمة",
    status: "PENDING",
    students: 0,
    joinedDate: "2024-03-20",
    logo: "https://ui-avatars.com/api/?name=أكاديمية+المستقبل&background=7c3aed&color=fff"
  },
  {
    id: "4",
    name: "مبتدئ المعرفة الابتدائية",
    slug: "knowledge-beginners",
    owner: "ليلى حسن",
    email: "layla@knowledge.edu",
    phone: "0112233445",
    plan: "الباقة الأساسية",
    status: "SUSPENDED",
    students: 125,
    joinedDate: "2023-11-05",
    logo: "https://ui-avatars.com/api/?name=مبتدئ+المعرفة&background=ea580c&color=fff"
  }
];

export default function SchoolsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <DashboardPageHeader 
        title="إدارة المدارس"
        description="عرض وإدارة جميع المدارس المسجلة في المنصة."
        primaryAction={{
          label: "إضافة مدرسة جديدة",
          icon: Plus,
          variant: "indigo",
          onClick: () => console.log("Add School")
        }}
      />

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 group hover:shadow-md transition-all duration-300">
         <div className="relative w-full md:w-96 group/search">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="البحث بالاسم، المالك، أو البريد..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-500/10"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border-dashed">
               <Filter className="w-4 h-4" />
               تصفية
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block" />
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden md:block whitespace-nowrap">إجمالي المدارس: {mockSchools.length}</span>
         </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">المدرسة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">المالك</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الباقة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الطلاب</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الحالة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">تاريخ الانضمام</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {mockSchools.map((school) => (
                <tr 
                  key={school.id} 
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all duration-300"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center p-0.5 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 group-hover:scale-110 transition-transform duration-500">
                        <img src={school.logo} alt={school.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate tracking-tight">{school.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider lowercase mt-0.5">eduflow.app/{school.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{school.owner}</span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">{school.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                       <Crown className={cn("w-3.5 h-3.5", 
                          school.plan.includes("متقدمة") ? "text-amber-500" : 
                          school.plan.includes("متوسطة") ? "text-indigo-500" : "text-slate-400"
                       )} />
                       <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight">{school.plan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{school.students}</span>
                  </td>
                  <td className="px-6 py-6 font-bold">
                    <StatusBadge status={school.status} />
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{school.joinedDate}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-indigo-500 shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all active:scale-90">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all active:scale-90 border border-transparent hover:border-slate-100">
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-rose-500 shadow-sm border border-transparent hover:border-rose-100 dark:hover:border-rose-500/30 transition-all active:scale-90">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination omitted for brevity, keeping same logic as before */}
      </div>
    </div>
  );
}
