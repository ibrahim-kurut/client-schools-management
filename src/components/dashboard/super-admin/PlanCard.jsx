"use client";

import React from "react";
import { 
  Check, X, Layers, Edit3, Trash2, Users, Gift, DollarSign, 
  Calendar, Headphones, Shield, Bus, Smartphone, Brain, 
  FileSpreadsheet, BarChart3, ClipboardList, UserCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { deletePlan } from "@/redux/slices/planSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// Feature flag configuration with icons and labels
const FEATURE_FLAGS = [
  { key: "hasBasicManagement", label: "إدارة البيانات الأساسية", icon: ClipboardList },
  { key: "hasAttendance", label: "نظام الغياب والحضور", icon: UserCheck },
  { key: "hasSchedules", label: "إدارة الجداول الدراسية", icon: Calendar },
  { key: "hasExcelUpload", label: "رفع البيانات (Excel)", icon: FileSpreadsheet },
  { key: "hasFinancials", label: "التقارير المالية والمصروفات", icon: BarChart3 },
  { key: "hasBusSystem", label: "نظام الحافلات", icon: Bus },
  { key: "hasMobileApp", label: "تطبيق الجوال", icon: Smartphone },
  { key: "hasAiReports", label: "تقارير AI المتقدمة", icon: Brain },
];

const SUPPORT_LABELS = {
  EMAIL: "بريد إلكتروني",
  WHATSAPP: "بريد + واتساب",
  PRIORITY: "واتساب سريع",
  ACCOUNT_MANAGER: "مدير حساب خاص"
};

const PLAN_COLORS = {
  0: "from-slate-500 to-slate-600",      // Free
  1: "from-indigo-500 to-blue-600",      // Standard
  2: "from-purple-500 to-violet-600",    // Pro
  3: "from-amber-500 to-orange-600",     // Enterprise
};

export default function PlanCard({ plan, onEdit, index = 0 }) {
  const { 
    name, description, price, durationInDays, 
    maxStudents, bufferStudents, pricePerExtraStudent,
    maxTeachers, supportLevel
  } = plan;

  const intervalLabel = durationInDays === 365 ? "سنوياً" : durationInDays === 30 ? "شهرياً" : `كل ${durationInDays} يوم`;
  const color = PLAN_COLORS[index % 4] || PLAN_COLORS[1];
  const enabledFeatures = FEATURE_FLAGS.filter(f => plan[f.key]);
  const disabledFeatures = FEATURE_FLAGS.filter(f => !plan[f.key]);
  const isPopular = index === 2; // The "Pro" plan is usually the most popular

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
        isPopular && "ring-2 ring-indigo-500 shadow-indigo-500/10 relative"
      )}
    >
      {isPopular && (
        <div className="absolute top-8 -left-12 -rotate-45 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-12 py-2 shadow-lg z-10">
          الأكثر تداولاً
        </div>
      )}

      <div className="p-6">
        {/* Header: Icon + Price */}
        <div className="flex items-center justify-between mb-8">
           <div className={cn("p-4 rounded-3xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500", color)}>
              <Layers className="w-8 h-8" />
           </div>
           <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${price}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{intervalLabel}</span>
           </div>
        </div>

        {/* Plan Name & Description */}
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{name}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>

        {/* Capacity & Pricing Info */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">سعة الطلاب الأساسية</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">{maxStudents} طالب</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">منطقة الهدية (Buffer)</span>
            </div>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+{bufferStudents} طالب</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">سعر الطالب الإضافي</span>
            </div>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">${pricePerExtraStudent}/سنوياً</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">الحد الأقصى للمعلمين</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">{maxTeachers} معلم</span>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="space-y-3 mb-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">الميزات المتاحة</h4>
          {enabledFeatures.map(({ key, label, icon: Icon }) => (
            <FeatureItem key={key} label={label} icon={Icon} included={true} />
          ))}
          {disabledFeatures.map(({ key, label, icon: Icon }) => (
            <FeatureItem key={key} label={label} icon={Icon} included={false} />
          ))}
        </div>

        {/* Support Level */}
        <div className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-xl mb-6">
          <Headphones className="w-4 h-4 text-indigo-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">مستوى الدعم</span>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{SUPPORT_LABELS[supportLevel] || supportLevel}</span>
          </div>
        </div>

        {/* Footer: Actions */}
        <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">السعة القصوى</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1">{maxStudents + bufferStudents} <span className="text-[10px] text-slate-400 font-bold">طالب</span></span>
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
      
      <div className={cn("absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r transition-all duration-500 group-hover:h-2 opacity-30 group-hover:opacity-100", color)} />
    </div>
  );
}

function FeatureItem({ label, icon: Icon, included = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-6 h-6 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform",
        included ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" : "bg-slate-50 dark:bg-slate-800 text-slate-300"
      )}>
        {included ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : <X className="w-3.5 h-3.5" />}
      </div>
      <div className="flex items-center gap-2">
        <Icon className={cn("w-3.5 h-3.5", included ? "text-slate-500" : "text-slate-300")} />
        <span className={cn(
          "text-xs font-bold transition-colors",
          included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"
        )}>{label}</span>
      </div>
    </div>
  );
}
