"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { 
  X, Plus, Check, Info, Users, UserPlus, HardDrive, DollarSign,
  Layers, BarChart3, Gift, Calendar, Headphones, Bus, 
  Smartphone, Brain, FileSpreadsheet, ClipboardList, UserCheck, Shield
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createPlan, updatePlan, clearMessages } from "@/redux/slices/planSlice";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

// Feature flag configuration
const FEATURE_FLAGS = [
  { key: "hasBasicManagement", label: "إدارة البيانات الأساسية", icon: ClipboardList, description: "إدارة المدارس، الصفوف، والطلاب" },
  { key: "hasAttendance", label: "نظام الغياب والحضور", icon: UserCheck, description: "تسجيل الحضور اليومي ومتابعة الغياب" },
  { key: "hasSchedules", label: "إدارة الجداول الدراسية", icon: Calendar, description: "جداول الحصص والمواعيد الدراسية" },
  { key: "hasExcelUpload", label: "رفع البيانات عبر Excel", icon: FileSpreadsheet, description: "استيراد وتصدير البيانات بالجملة" },
  { key: "hasFinancials", label: "التقارير المالية والمصروفات", icon: BarChart3, description: "إدارة المدفوعات والمصروفات" },
  { key: "hasBusSystem", label: "نظام الحافلات", icon: Bus, description: "تتبع الحافلات وخطوط النقل (مستقبلي)" },
  { key: "hasMobileApp", label: "تطبيق الجوال", icon: Smartphone, description: "تطبيق خاص للمدرسة (مستقبلي)" },
  { key: "hasAiReports", label: "تقارير AI المتقدمة", icon: Brain, description: "تحليل أداء الطلاب بالذكاء الاصطناعي (مستقبلي)" },
];

const SUPPORT_LEVELS = [
  { value: "EMAIL", label: "بريد إلكتروني" },
  { value: "WHATSAPP", label: "بريد + واتساب" },
  { value: "PRIORITY", label: "واتساب سريع" },
  { value: "ACCOUNT_MANAGER", label: "مدير حساب خاص" },
];

const FormInput = memo(({ label, icon: Icon, value, onChange, name, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 mr-1">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
        {label}
      </label>
      <input
        {...props}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none placeholder:text-slate-400 shadow-sm"
      />
    </div>
  );
});
FormInput.displayName = "FormInput";

const FormTextarea = memo(({ label, icon: Icon, value, onChange, name, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 mr-1">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
        {label}
      </label>
      <textarea
        {...props}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none resize-none placeholder:text-slate-400 shadow-sm"
      />
    </div>
  );
});
FormTextarea.displayName = "FormTextarea";

const FeatureToggle = memo(({ featureKey, label, icon: Icon, description, checked, onChange }) => {
  return (
    <div 
      onClick={() => onChange(featureKey, !checked)}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group/feature",
        checked 
          ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200/50 dark:border-indigo-800/50 shadow-sm" 
          : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-200/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors",
          checked 
            ? "bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600" 
            : "bg-slate-100 dark:bg-slate-700/50 text-slate-400"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h4 className={cn(
            "text-[12px] font-black transition-colors",
            checked ? "text-indigo-900 dark:text-indigo-200" : "text-slate-600 dark:text-slate-400"
          )}>{label}</h4>
          <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-0.5">{description}</p>
        </div>
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full p-0.5 transition-all duration-300 flex items-center shrink-0",
        checked ? "bg-indigo-600 justify-end" : "bg-slate-300 dark:bg-slate-600 justify-start"
      )}>
        <div className={cn(
          "w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300",
          checked ? "shadow-indigo-500/30" : ""
        )} />
      </div>
    </div>
  );
});
FeatureToggle.displayName = "FeatureToggle";

const INITIAL_FORM_DATA = {
  name: "",
  price: "",
  description: "",
  maxStudents: "",
  bufferStudents: "10",
  pricePerExtraStudent: "9",
  maxTeachers: "",
  storageLimit: "100",
  durationInDays: "365",
};

const INITIAL_FEATURES = {
  hasBasicManagement: true,
  hasAttendance: true,
  hasSchedules: false,
  hasExcelUpload: false,
  hasFinancials: false,
  hasBusSystem: false,
  hasMobileApp: false,
  hasAiReports: false,
};

export default function CreatePlanModal({ isOpen, onClose, editPlan }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { status, error, successMessage } = useSelector((state) => state.plan);

  // Unified form state
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [features, setFeatures] = useState(INITIAL_FEATURES);
  const [allowReports, setAllowReports] = useState(false);
  const [supportLevel, setSupportLevel] = useState("EMAIL");
  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (key, value) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editPlan) {
        setFormData({
            name: editPlan.name || "",
            price: editPlan.price || "",
            description: editPlan.description || "",
            maxStudents: editPlan.maxStudents || "",
            bufferStudents: editPlan.bufferStudents || "10",
            pricePerExtraStudent: editPlan.pricePerExtraStudent || "9",
            maxTeachers: editPlan.maxTeachers || "",
            storageLimit: editPlan.storageLimit || "100",
            durationInDays: editPlan.durationInDays || "365",
        });
        setAllowReports(editPlan.allowReports || false);
        setSupportLevel(editPlan.supportLevel || "EMAIL");
        setFeatures({
          hasBasicManagement: editPlan.hasBasicManagement ?? true,
          hasAttendance: editPlan.hasAttendance ?? true,
          hasSchedules: editPlan.hasSchedules ?? false,
          hasExcelUpload: editPlan.hasExcelUpload ?? false,
          hasFinancials: editPlan.hasFinancials ?? false,
          hasBusSystem: editPlan.hasBusSystem ?? false,
          hasMobileApp: editPlan.hasMobileApp ?? false,
          hasAiReports: editPlan.hasAiReports ?? false,
        });
      } else {
        // Reset for new plan
        setFormData(INITIAL_FORM_DATA);
        setAllowReports(false);
        setSupportLevel("EMAIL");
        setFeatures(INITIAL_FEATURES);
      }
      setActiveTab("basic");
    }
  }, [isOpen, editPlan]);

  useEffect(() => {
    if (isOpen && successMessage && status === "succeeded") {
      toast.success(successMessage || (editPlan ? "تم تحديث الباقة بنجاح" : "تم إنشاء الباقة بنجاح"));
      dispatch(clearMessages());
      onClose();
    }
  }, [successMessage, status, onClose, editPlan, isOpen, dispatch]);

  useEffect(() => {
    if (isOpen && error && status === "failed") {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [error, status, isOpen, dispatch]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const planData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      maxStudents: parseInt(formData.maxStudents) || 15,
      bufferStudents: parseInt(formData.bufferStudents) || 10,
      pricePerExtraStudent: parseFloat(formData.pricePerExtraStudent) || 9,
      maxTeachers: parseInt(formData.maxTeachers) || 10,
      storageLimit: parseInt(formData.storageLimit) || 100,
      durationInDays: parseInt(formData.durationInDays) || 365,
      allowReports,
      supportLevel,
      ...features,
    };

    if (editPlan) {
      dispatch(updatePlan({ id: editPlan.id, planData }));
    } else {
      dispatch(createPlan(planData));
    }
  };

  const tabs = [
    { id: "basic", label: "البيانات الأساسية" },
    { id: "limits", label: "السعات والتسعير" },
    { id: "features", label: "الميزات" },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300 transform-gpu">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
              {editPlan ? <Layers className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {editPlan ? 'تعديل الباقة' : 'إضافة خطة جديدة'}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تحكم كامل بالميزات والأسعار</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 py-2 flex items-center gap-1 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors",
                activeTab === tab.id 
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-700" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 space-y-8 no-scrollbar">
          
          {activeTab === "basic" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="اسم الباقة"
                  icon={Info}
                  name="name"
                  placeholder="مثال: الباقة الاعتيادية"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="السعر السنوي (USD)"
                  icon={DollarSign}
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="900"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>

              <FormTextarea
                label="وصف الباقة"
                icon={Info}
                name="description"
                rows={3}
                placeholder="صف ميزات هذه الخطّة..."
                value={formData.description}
                onChange={handleInputChange}
              />

              {/* Support Level Selector */}
              <div className="flex flex-col gap-3">
                <label className="text-[12px] font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 mr-1">
                  <Headphones className="w-3.5 h-3.5 text-indigo-500" />
                  مستوى الدعم الفني
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SUPPORT_LEVELS.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSupportLevel(level.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 text-center",
                        supportLevel === level.value
                          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-200"
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

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
          ) : activeTab === "limits" ? (
            <div className="space-y-6">
              {/* Pricing Strategy Info */}
              <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800/50 text-amber-600 shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-amber-900 dark:text-amber-200 mb-1">نظام الديون المرن</h4>
                    <p className="text-[11px] text-amber-700/70 dark:text-amber-400/70 font-medium leading-relaxed">
                      عند تجاوز المدرسة سعة الطلاب الأساسية، يدخل في "منطقة الهدية" مجاناً. وإذا تجاوز الهدية، يُسمح بالإضافة وتُسجل كديون يتم احتسابها تلقائياً.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="سعة الطلاب الأساسية"
                  icon={Users}
                  name="maxStudents"
                  type="number"
                  placeholder="100"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="منطقة الهدية (Buffer)"
                  icon={Gift}
                  name="bufferStudents"
                  type="number"
                  placeholder="10"
                  value={formData.bufferStudents}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="سعر الطالب الإضافي ($)"
                  icon={DollarSign}
                  name="pricePerExtraStudent"
                  type="number"
                  step="0.01"
                  placeholder="9"
                  value={formData.pricePerExtraStudent}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="الحد الأقصى للمعلمين"
                  icon={UserPlus}
                  name="maxTeachers"
                  type="number"
                  placeholder="10"
                  value={formData.maxTeachers}
                  onChange={handleInputChange}
                />
              </div>
              <FormInput
                label="مساحة التخزين (GB)"
                icon={HardDrive}
                name="storageLimit"
                type="number"
                placeholder="100"
                value={formData.storageLimit}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            /* Features Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">التحكم بالميزات</h3>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                  {Object.values(features).filter(Boolean).length} / {FEATURE_FLAGS.length} مفعّلة
                </span>
              </div>
              {FEATURE_FLAGS.map(flag => (
                <FeatureToggle
                  key={flag.key}
                  featureKey={flag.key}
                  label={flag.label}
                  icon={flag.icon}
                  description={flag.description}
                  checked={features[flag.key]}
                  onChange={handleFeatureChange}
                />
              ))}
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
              className="px-8 py-3 bg-red-900 hover:bg-red-700 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
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
