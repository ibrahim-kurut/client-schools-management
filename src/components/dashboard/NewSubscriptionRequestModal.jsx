"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ChevronRight, 
  ShieldCheck, 
  Check,
  Zap,
  Globe,
  Database
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "@/redux/slices/planSlice";
import { createSubscriptionRequest } from "@/redux/slices/subscriptionRequestsSlice";
import { cn } from "@/lib/utils";

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

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedPlanId) return;
    setLoading(true);
    await dispatch(createSubscriptionRequest(selectedPlanId));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">اختر خطة الاشتراك المناسبة</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">ارفع مستوى مدرستك مع أدواتنا المتطورة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content - Scrollable Plans */}
        <div className="p-8 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">
           {plans.map((plan) => (
             <div 
               key={plan.id}
               onClick={() => setSelectedPlanId(plan.id)}
               className={cn(
                 "relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 group",
                 selectedPlanId === plan.id 
                  ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/5 shadow-2xl shadow-indigo-500/10 scale-[1.02]" 
                  : "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
               )}
             >
                {selectedPlanId === plan.id && (
                  <div className="absolute top-6 left-6 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40">
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

                <div className={cn(
                  "py-3 w-full rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all",
                  selectedPlanId === plan.id ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                   اختر الباقة
                </div>
             </div>
           ))}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">بمجرد الإرسال، سيتم مراجعة طلبك من قبل السوبر أدمن</p>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all"
              >
                تجاهل
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!selectedPlanId || loading}
                className="px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
