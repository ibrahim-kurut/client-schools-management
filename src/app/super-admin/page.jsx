"use client";

import React from "react";
import Image from "next/image";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Wallet,
  Clock,
  Zap,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatCard from "@/components/dashboard/super-admin/StatCard";

// Mock data for the overview
const stats = [
  {
    label: "إجمالي المدارس",
    value: "142",
    change: "+12.5%",
    trend: "up",
    icon: Building2,
    color: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/20"
  },
  {
    label: "المستخدمين النشطين",
    value: "8,432",
    change: "+4.2%",
    trend: "up",
    icon: Users,
    color: "from-purple-600 to-violet-600",
    shadow: "shadow-purple-500/20"
  },
  {
    label: "الإيرادات الشهرية",
    value: "$14,250",
    change: "-2.1%",
    trend: "down",
    icon: Wallet,
    color: "from-emerald-600 to-teal-600",
    shadow: "shadow-emerald-500/20"
  },
  {
    label: "طلبات معلقة",
    value: "18",
    change: "+5",
    trend: "up",
    icon: Clock,
    color: "from-amber-600 to-orange-600",
    shadow: "shadow-amber-500/20"
  }
];

const plansPerformance = [
  { name: "الباقة الأساسية", subscriptions: 45, color: "bg-blue-500" },
  { name: "الباقة المتوسطة", subscriptions: 72, color: "bg-indigo-500" },
  { name: "الباقة المتقدمة (برو)", subscriptions: 25, color: "bg-purple-500" },
];

const recentRequests = [
  {
    id: "REQ-001",
    school: "مدرسة الأمل النموذجية",
    plan: "الباقة المتقدمة",
    amount: "$299/سنة",
    date: "منذ ساعتين",
    status: "PENDING",
    image: "https://via.placeholder.com/40"
  },
  {
    id: "REQ-002",
    school: "مدارس النور الأهلية",
    plan: "الباقة المتوسطة",
    amount: "$149/سنة",
    date: "منذ 4 ساعات",
    status: "PENDING",
    image: "https://via.placeholder.com/40"
  },
  {
    id: "REQ-003",
    school: "أكاديمية المستقبل",
    plan: "الباقة المتقدمة",
    amount: "$299/سنة",
    date: "منذ يوم واحد",
    status: "COMPLETED",
    image: "https://via.placeholder.com/40"
  }
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Header */}
      <DashboardPageHeader 
        title="لوحة تحكم النظام"
        description="أهلاً بك مجدداً، إليك نظرة سريعة على أداء المنصة اليوم."
        primaryAction={{
          label: "تحديث البيانات",
          icon: Zap,
          variant: "indigo",
          secondary: true,
          secondaryLabel: "تنزيل التقارير",
          onClick: () => console.log("Refresh"),
          onSecondaryClick: () => console.log("Download")
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart / Performance Area */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm group hover:shadow-xl hover:border-indigo-500/20 transition-all duration-500 overflow-hidden relative">
              <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                     <TrendingUp className="w-5 h-5 text-indigo-500" />
                     نمو المدارس والاشتراكات
                   </h3>
                   <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">نظرة عامة على الإيرادات الشهرية</p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                   <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 text-indigo-600 dark:text-white rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">سنوي</button>
                   <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">شهري</button>
                </div>
              </div>
              
              {/* Visual breakdown for Plans Performance */}
              <div className="space-y-8 mt-4">
                {plansPerformance.map((plan, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full ${plan.color} ring-4 ring-slate-100 dark:ring-slate-800/10 group-hover/item:scale-125 transition-transform`} />
                         <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-indigo-500 transition-colors uppercase tracking-tight">{plan.name}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">{plan.subscriptions}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-slate-50 dark:border-slate-800/20 group-hover/item:border-indigo-500/20 transition-all duration-300">
                      <div 
                        className={`h-full ${plan.color} rounded-full relative transition-all duration-1000 shadow-sm`}
                        style={{ width: `${plan.subscriptions}%` }}
                      >
                         <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-[1px]" />
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/50 grid grid-cols-3 gap-6">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">صافي الربح</p>
                    <p className="text-xl font-black text-emerald-500 tracking-tight">$8,642</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">النمو السنوي</p>
                    <p className="text-xl font-black text-indigo-500 tracking-tight">+18.4%</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تجديد الاشتراكات</p>
                    <p className="text-xl font-black text-amber-500 tracking-tight">92.1%</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar content: Recent Requests */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm group hover:shadow-xl hover:border-indigo-500/20 transition-all duration-500 overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  أحدث الطلبات
                </h3>
                <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline hover:underline-offset-4 decoration-indigo-500 transition-all">مشاهدة الكل</button>
              </div>
              
              <div className="space-y-2">
                {recentRequests.map((req, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group/card border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 overflow-hidden relative group-hover/card:scale-105 transition-transform duration-300">
                      <Image 
                        src={req.image} 
                        alt={req.school} 
                        fill 
                        className="object-cover group-hover/card:scale-110 transition-transform duration-500 opacity-80 group-hover/card:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-indigo-500/10 group-hover/card:bg-transparent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate tracking-tight">{req.school}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-tight">{req.plan} • {req.amount}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`p-1 rounded-lg ${req.status === "COMPLETED" ? "text-emerald-50" : "text-amber-50"}`}>
                        {req.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500 animate-pulse" />}
                      </div>
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 whitespace-nowrap">{req.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                 <div className="p-5 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 flex items-center justify-between group/total shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer">
                    <div>
                       <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">إجمالي الطلبات المعلقة</p>
                       <p className="text-xl font-black text-slate-900 dark:text-white">18 <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-2 tracking-tight group-hover/total:mr-4 transition-all">بإجمالي $3,540</span></p>
                    </div>
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 group-hover/total:translate-x-1 transition-transform">
                       <ExternalLink className="w-4 h-4" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
