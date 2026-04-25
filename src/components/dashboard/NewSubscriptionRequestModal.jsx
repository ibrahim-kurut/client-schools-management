"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { 
  X, 
  Send , 
  ShieldCheck, 
  Check,
  Zap,
  Database
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "@/redux/slices/planSlice";
import { createSubscriptionRequest } from "@/redux/slices/subscriptionRequestsSlice";

// Memoized Plan Card - uses only GPU-friendly properties (opacity, border-color)
const PlanCard = memo(({ plan, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(plan.id)}
      style={{ 
        borderColor: isSelected ? '#4548ffff' : '#acadffff',
        backgroundColor: isSelected ? 'rgba(238, 242, 255, 0.3)' : 'transparent'
      }}
      className="relative p-8 rounded-[2.5rem] border-2 cursor-pointer group"
    >
      {isSelected && (
        <div className="absolute top-6 left-6 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 font-black" />
        </div>
      )}

      <div className="mb-6">
          <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{plan.name}</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">${plan.price}</span>
            <span className="text-xs font-bold text-slate-400">/سنوياً</span>
          </div>
      </div>

      <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{plan.maxStudents} طالب كحد أقصى</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-500">
            <Check className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">دعم {plan.supportLevel}</span>
          </div>
          {plan.hasFinancials && (
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">نظام مالي متكامل</span>
            </div>
          )}
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
          <p className="text-[10px] leading-relaxed text-slate-400 font-medium italic">
            {plan.description || "باقة تضمن لك السيطرة الكاملة على إدارة مدرستك."}
          </p>
      </div>

      <div 
        style={{
          backgroundColor: isSelected ? '#4f46e5' : '#f1f5f9',
          color: isSelected ? '#fff' : '#94a3b8'
        }}
        className="py-3 w-full rounded-2xl font-black text-[14px] uppercase tracking-widest text-center"
      >
          {isSelected ? 'تم الاختيار' : 'اختر الباقة'}
      </div>
    </div>
  );
});

PlanCard.displayName = 'PlanCard';

export default function NewSubscriptionRequestModal({ isOpen, onClose }) {
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { plans } = useSelector((state) => state.plan);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPlans());
    }
  }, [isOpen, dispatch]);

  const handleSelect = useCallback((planId) => {
    setSelectedPlanId(planId);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedPlanId) return;
    setLoading(true);
    await dispatch(createSubscriptionRequest(selectedPlanId));
    setLoading(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 flex items-start justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">اختر خطة الاشتراك المناسبة</h3>
              <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">ارفع مستوى مدرستك مع أدواتنا المتطورة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-red-400 hover:bg-red-500 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer text-white font-black text-sm">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Scrollable Plans */}
        <div className="p-8 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">
           {plans.map((plan) => (
             <PlanCard 
               key={plan.id}
               plan={plan}
               isSelected={selectedPlanId === plan.id}
               onSelect={handleSelect}
             />
           ))}
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3 bg-amber-500/5 dark:bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/10">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-400 leading-relaxed">
                بمجرد الإرسال، سيتم مراجعة طلبك من قبل ادارة المنصة
              </p>
           </div>
           
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              >
                تجاهل
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!selectedPlanId || loading}
                className="flex-1 sm:flex-none px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
