"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Plus, 
  Check, 
  Info, 
  Users, 
  UserPlus, 
  HardDrive, 
  DollarSign,
  Layers,
  Layout,
  BarChart3
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createPlan } from "@/redux/slices/planSlice";
import { cn } from "@/lib/utils";



const FormInput = memo(({ label, icon: Icon, inputRef, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 mr-1">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
        {label}
      </label>
      <input
        {...props}
        ref={inputRef}
        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none placeholder:text-slate-400 shadow-sm"
      />
    </div>
  );
});

FormInput.displayName = "FormInput";

const FormTextarea = memo(({ label, icon: Icon, inputRef, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 mr-1">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
        {label}
      </label>
      <textarea
        {...props}
        ref={inputRef}
        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none resize-none placeholder:text-slate-400 shadow-sm"
      />
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";

export default function CreatePlanModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { status, error, successMessage } = useSelector((state) => state.plan);

  // Uncontrolled state (Refs) for absolute zero lag
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const maxStudentsRef = useRef(null);
  const maxTeachersRef = useRef(null);
  const storageLimitRef = useRef(null);
  
  // Minimal UI state
  const [allowReports, setAllowReports] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (successMessage && status === "succeeded") {
      setAllowReports(false);
      onClose();
    }
  }, [successMessage, status, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(createPlan({
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      price: parseFloat(priceRef.current?.value) || 0,
      maxStudents: parseInt(maxStudentsRef.current?.value) || 50,
      maxTeachers: parseInt(maxTeachersRef.current?.value) || 10,
      storageLimit: parseInt(storageLimitRef.current?.value) || 100,
      allowReports
    }));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Overlay - Simplified CSS, No backdrop-blur */}
      <div 
        className="absolute inset-0 bg-slate-950/80 transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300 transform-gpu">
        
        {/* Atomic Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">إضافة خطة جديدة</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تحسين أداء الواجهة 60FPS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Static Tab Bar */}
        <div className="px-6 py-2 flex items-center gap-1 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("basic")}
            className={cn(
              "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors",
              activeTab === "basic" 
                ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            البيانات الأساسية
          </button>
          <button
            onClick={() => setActiveTab("limits")}
            className={cn(
              "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors",
              activeTab === "limits" 
                ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            الحدود والسعات
          </button>
        </div>

        {/* Scrollable Form Body - Using native scroll for performance */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 space-y-8 no-scrollbar">
          
          {activeTab === "basic" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="اسم الباقة"
                  icon={Info}
                  placeholder="مثال: الباقة البرونزية"
                  inputRef={nameRef}
                />
                <FormInput
                  label="السعر (USD)"
                  icon={DollarSign}
                  type="number"
                  placeholder="0.00"
                  inputRef={priceRef}
                />
              </div>

              <FormTextarea
                label="وصف الباقة"
                icon={Info}
                rows={3}
                placeholder="صف ميزات هذه الخطّة..."
                inputRef={descriptionRef}
              />

              <div className="flex items-center justify-between p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200/50 dark:border-indigo-800/50 rounded-[1.5rem]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-indigo-900 dark:text-indigo-200">التقارير المتقدمة</h4>
                    <p className="text-[10px] text-indigo-700/60 dark:text-indigo-400/60 font-bold uppercase tracking-tighter">إتاحة التحليلات المتقدمة للمدير</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={allowReports}
                  onChange={(e) => setAllowReports(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="الحد الأقصى للطلاب"
                  icon={Users}
                  type="number"
                  placeholder="50"
                  inputRef={maxStudentsRef}
                />
                <FormInput
                  label="الحد الأقصى للمعلمين"
                  icon={UserPlus}
                  type="number"
                  placeholder="10"
                  inputRef={maxTeachersRef}
                />
              </div>
              <FormInput
                label="مساحة التخزين (GB)"
                icon={HardDrive}
                type="number"
                placeholder="100"
                inputRef={storageLimitRef}
              />
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between gap-4">
          <div className="flex-1">
            {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-3 rounded-xl text-xs font-black text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
            >
              {status === 'loading' ? 'جاري الحفظ...' : (
                <>
                  <Check className="w-4 h-4" />
                  حفظ الباقة
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
