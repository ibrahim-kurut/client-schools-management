"use client";

import React from "react";
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RequestCard({ request, onApprove, onReject }) {
  const { school, plan, status, createdAt, adminNotes } = request;

  // Format date
  const date = new Date(createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500 group relative overflow-hidden"
    >
      {/* Status Badge Top Right */}
      <div className={cn(
        "absolute top-6 left-6 scale-90 p-1.5 rounded-lg border",
        status === "PENDING" ? "bg-amber-50 text-amber-500 border-amber-200 shadow-amber-500/20 shadow-[0_0_12px]" : 
        status === "APPROVED" ? "bg-emerald-50 text-emerald-500 border-emerald-200 shadow-emerald-500/20 shadow-[0_0_12px]" : 
        "bg-rose-50 text-rose-500 border-rose-200 shadow-rose-500/20 shadow-[0_0_12px]"
      )}>
        {status === "PENDING" ? <Clock className="w-4 h-4 animate-pulse" /> : 
         status === "APPROVED" ? <CheckCircle2 className="w-4 h-4" /> : 
         <XCircle className="w-4 h-4" />}
      </div>

      <div className="flex items-center gap-4 mb-8">
         <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500 border border-indigo-100 dark:border-indigo-500/20 p-2 overflow-hidden shadow-sm">
            <Building2 className="w-8 h-8" />
         </div>
         <div className="flex flex-col min-w-0 pr-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">المدرسة</span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{school?.name}</h4>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300">
            <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">الباقة</p>
            <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
               <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
               {plan?.name}
            </p>
         </div>
         <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300">
            <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">القيمة</p>
            <p className="text-xs font-black text-slate-900 dark:text-white">${plan?.price}</p>
         </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
         <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-slate-300" />
            <span>{date}</span>
         </div>
         {adminNotes && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-400 italic">
               "ملاحظات الإدارة: {adminNotes}"
            </div>
         )}
      </div>

      {/* Action Footer for Pending Only */}
      {status === "PENDING" ? (
         <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
            <button 
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
            >
               قبول الطلب
            </button>
            <button 
              onClick={onReject}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-100 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            >
               رفض
            </button>
         </div>
      ) : (
        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">تمت معالجة الطلب بنجاح</p>
        </div>
      )}
    </div>
  );
}

