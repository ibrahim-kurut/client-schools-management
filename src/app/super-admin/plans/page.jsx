"use client";

import React from "react";
import { 
  Plus, 
  CreditCard,
  TrendingUp,
  Settings
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatCard from "@/components/dashboard/super-admin/StatCard";
import PlanCard from "@/components/dashboard/super-admin/PlanCard";

const mockPlans = [
  {
    id: "1",
    name: "الباقة الأساسية",
    description: "مثالية للمدارس الصغيرة أو التي بدأت لتوها في التحول الرقمي.",
    price: 49,
    interval: "شهرياً",
    features: [
      { name: "حتى 50 طالب", included: true },
      { name: "حتى 10 معلمين", included: true },
      { name: "إدارة الحضور والغياب", included: true },
      { name: "مساحة تخزين 1GB", included: true },
      { name: "التقارير المتقدمة", included: false },
      { name: "تطبيق الموبايل", included: false },
    ],
    color: "from-blue-500 to-indigo-600",
    popular: false,
    activeSchools: 45
  },
  {
    id: "2",
    name: "الباقة المتوسطة",
    description: "الخيار الأكثر شيوعاً للمدارس المتوسطة التي تحتاج لمميزات إضافية.",
    price: 99,
    interval: "شهرياً",
    features: [
      { name: "حتى 200 طالب", included: true },
      { name: "حتى 30 معلم", included: true },
      { name: "إدارة الحضور والغياب", included: true },
      { name: "مساحة تخزين 5GB", included: true },
      { name: "التقارير المتقدمة", included: true },
      { name: "تطبيق الموبايل", included: false },
    ],
    color: "from-indigo-600 to-violet-600",
    popular: true,
    activeSchools: 72
  },
  {
    id: "3",
    name: "الباقة المتقدمة (برو)",
    description: "للصروح التعليمية الكبيرة التي تبحث عن تحكم كامل ومساحة غير محدودة.",
    price: 199,
    interval: "شهرياً",
    features: [
      { name: "عدد طلاب غير محدود", included: true },
      { name: "عدد معلمين غير محدود", included: true },
      { name: "إدارة الحضور والغياب", included: true },
      { name: "مساحة تخزين 50GB", included: true },
      { name: "التقارير المتقدمة", included: true },
      { name: "تطبيق الموبايل", included: true },
    ],
    color: "from-purple-600 to-fuchsia-600",
    popular: false,
    activeSchools: 25
  }
];

export default function PlansManagement() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <DashboardPageHeader 
        title="باقات الاشتراك"
        description="تخصيص وإدارة خطط الأسعار والمميزات المتاحة للمدارس."
        primaryAction={{
          label: "إضافة باقة جديدة",
          icon: Plus,
          variant: "indigo",
          onClick: () => console.log("Add Plan")
        }}
      />

      {/* Global Plan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
            label="إجمالي الاشتراكات"
            value="142"
            change="+12%"
            trend="up"
            icon={CreditCard}
            color="from-indigo-500 to-blue-600"
         />
         <StatCard 
            label="الإيرادات الشهرية المتكررة"
            value="$12,450"
            change="MRR"
            trend="up"
            icon={TrendingUp}
            color="from-emerald-500 to-teal-600"
         />
         <StatCard 
            label="التحويلات البنكية المعلقة"
            value="18"
            change="نشط"
            trend="up"
            icon={Settings}
            color="from-amber-500 to-orange-600"
         />
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {mockPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Analytics Snapshot */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-right">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  تحليلات الإيرادات
               </div>
               <h3 className="text-2xl font-black text-white tracking-tight leading-tight">هل ترغب في تعديل إستراتيجية الأسعار الخاصة بك؟</h3>
               <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-md mx-auto md:mx-0">بناءً على تحليلاتنا الأخيرة، الباقة المتوسطة حققت نمواً بنسبة 25% الشهر الماضي. قد يكون الوقت مناسباً لإضافة ميزات متميزة لها.</p>
            </div>
            <div className="flex items-center gap-4">
               <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all">تحميل التقرير الكامل</button>
               <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95">عرض الإحصائيات</button>
            </div>
         </div>
      </div>
    </div>
  );
}
