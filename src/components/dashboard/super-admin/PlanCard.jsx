"use client";

import React from "react";
import { Check, X, Layers, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { deletePlan } from "@/redux/slices/planSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


export default function PlanCard({ plan, onEdit }) {

  const { 
    name, 
    description, 
    price, 
    durationInDays, 
    maxStudents, 
    maxTeachers, 
    storageLimit, 
    allowReports,
    features = [], 
    color = "from-indigo-600 to-violet-600", 
    popular = false, 
    activeSchools = 0 
  } = plan;

  const intervalLabel = durationInDays === 365 ? "سنوياً" : "شهرياً";

  const dispatch = useDispatch();

  const handleDelete = () => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذه العملية!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        container: 'font-arabic',
        popup: 'rounded-[1.5rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-2.5',
        cancelButton: 'rounded-xl font-bold px-6 py-2.5'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePlan(plan.id)).then((action) => {
          if (action.meta.requestStatus === 'fulfilled') {
            toast.success("تم حذف الباقة بنجاح");
          } else {
            toast.error(action.payload?.message || "فشل في حذف الباقة");
          }
        });

      }
    });
  };



  return (
    <div 
      className={cn(
        "relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500 group overflow-hidden",
        popular && "ring-2 ring-indigo-500 shadow-indigo-500/10 relative"
      )}
    >
      {popular && (
        <div className="absolute top-8 -left-12 -rotate-45 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-12 py-2 shadow-lg z-10">
          الأكثر تداولاً
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
           <div className={cn("p-4 rounded-3xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500", color)}>
              <Layers className="w-8 h-8" />
           </div>
           <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${price}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{intervalLabel}</span>
           </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{name}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>

        <div className="space-y-4 mb-10">
          {/* Main Limits */}
          <LimitItem label="الحد الأقصى للطلاب" value={maxStudents} icon={Check} />
          <LimitItem label="الحد الأقصى للمعلمين" icon={Check} value={maxTeachers} />
          <LimitItem label="مساحة التخزين" icon={Check} value={`${storageLimit} GB`} />
          <LimitItem 
            label="التقارير المتقدمة" 
            icon={allowReports ? Check : X} 
            included={allowReports} 
          />

          {/* Dynamic Features (Fallback if any) */}
          {features?.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform",
                feature.included ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" : "bg-slate-50 dark:bg-slate-800 text-slate-300"
              )}>
                {feature.included ? <Check className="w-3 h-3 stroke-[3px]" /> : <X className="w-3 h-3" />}
              </div>
              <span className={cn(
                "text-xs font-bold transition-colors",
                feature.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"
              )}>{feature.name}</span>
            </div>
          ))}
        </div>


        <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">مدارس نشطة</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1">{activeSchools}</span>
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(plan)}
                className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white rounded-2xl border border-emerald-100 dark:border-emerald-500/20 transition-all duration-300 active:scale-90 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-emerald-500/20"
                title="تعديل الباقة"
              >
                 <Edit3 className="w-5 h-5" />
              </button>

              <button 
                onClick={handleDelete}
                className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white dark:hover:text-white rounded-2xl border border-rose-100 dark:border-rose-500/20 transition-all duration-300 active:scale-90 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-rose-500/20"
                title="حذف الباقة"
              >
                 <Trash2 className="w-5 h-5" />
              </button>


           </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r transition-all duration-500 group-hover:h-2 opacity-30 group-hover:opacity-100" style={{ backgroundImage: `linear-gradient(to right, transparent, ${color?.split(' ')[1]?.replace('to-', '') || 'indigo-500'}, transparent)` }} />
    </div>
  );
}

function LimitItem({ label, value, icon: Icon, included = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform",
        included ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" : "bg-slate-50 dark:bg-slate-800 text-slate-300"
      )}>
        <Icon className={cn("w-3 h-3", included && "stroke-[3px]")} />
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "text-xs font-bold transition-colors",
          included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"
        )}>{label}</span>
        {value && <span className="text-[10px] text-slate-400 font-bold">{value}</span>}
      </div>
    </div>
  );
}

