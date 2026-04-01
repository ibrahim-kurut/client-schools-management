"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  CreditCard,
  TrendingUp,
  Settings,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "@/redux/slices/planSlice";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatCard from "@/components/dashboard/super-admin/StatCard";
import PlanCard from "@/components/dashboard/super-admin/PlanCard";
import CreatePlanModal from "@/components/dashboard/super-admin/CreatePlanModal";

export default function PlansManagement() {
  const dispatch = useDispatch();
   const { plans, status, error } = useSelector((state) => state.plan);
  const [addPlanModel, setAddPlanModel] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const handleOpenNew = () => {
    setEditPlan(null);
    setAddPlanModel(true);
  };

  const handleOpenEdit = (plan) => {
    setEditPlan(plan);
    setAddPlanModel(true);
  };


  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

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
          onClick: handleOpenNew
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
            label="الخطط النشطة حالياً"
            value={plans?.length || 0}
            change="نشط"
            trend="up"
            icon={Settings}
            color="from-amber-500 to-orange-600"
         />
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mr-2">قائمة الخطط المتوفرة</h2>
        
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-800">
             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
             <p className="text-slate-500 font-bold">جاري تحميل الخطط...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-4 p-8 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-[2.5rem]">
             <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-rose-600" />
             </div>
             <div>
                <h4 className="text-lg font-black text-rose-900 dark:text-rose-200">فشل في جلب البيانات</h4>
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
             </div>
             <button 
              onClick={() => dispatch(fetchPlans())}
              className="ms-auto px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
             >
               إعادة المحاولة
             </button>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-800">
             <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <Settings className="w-10 h-10 text-slate-400" />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا يوجد خطط حالياً</h3>
             <p className="text-slate-500 font-medium mb-8">ابدأ بإنشاء أول باقة اشتراك للمدارس عبر الضغط على الزر أعلاه</p>
             <button 
              onClick={() => setAddPlanModel(true)}
              className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
             >
               إنشاء أول باقة
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onEdit={handleOpenEdit} />
            ))}

          </div>
        )}
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

       <CreatePlanModal 
        isOpen={addPlanModel} 
        onClose={() => setAddPlanModel(false)} 
        editPlan={editPlan}
      />

    </div>
  );
}
