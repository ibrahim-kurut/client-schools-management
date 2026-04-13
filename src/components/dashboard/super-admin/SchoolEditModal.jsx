"use client";

import React, { useState, useEffect, memo } from "react";
import { 
  X, 
  Save, 
  Shield, 
  Crown, 
  Calendar, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-toastify";
import { DOMAIN } from "@/lib/domain";

const SchoolEditModal = ({ isOpen, onClose, school, onUpdate, plans }) => {
  const [formData, setFormData] = useState({
    planId: "",
    status: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (school && isOpen) {
      setFormData({
        planId: school.subscription?.planId || (plans?.length > 0 ? plans[0].id : ""),
        status: school.subscription?.status || "PENDING",
        endDate: school.subscription?.endDate 
          ? new Date(school.subscription.endDate).toISOString().split('T')[0] 
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      });
    }
  }, [school, isOpen, plans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.put(`${DOMAIN}/subscriptions/update-school/${school.id}`, formData, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success("تم تحديث بيانات المدرسة بنجاح");
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error(error.response?.data?.message || "فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !school) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 isolate">
      {/* Backdrop - Optimized by removing expensive backdrop-blur */}
      <div 
        className="absolute inset-0 bg-slate-950/60 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container - Optimized with transform-gpu and better transition management */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-slate-200 dark:border-slate-800 transform-gpu translate-z-0">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">إدارة اشتراك المدرسة</h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{school.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Plan Selection */}
          <div className="space-y-3 font-arabic">
            <label className="flex items-center gap-2 text-[1rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              <Crown className="w-3 h-3" />
              باقة الاشتراك
            </label>
            <div className="grid grid-cols-1 gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, planId: plan.id }))}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-right group transform-gpu",
                    formData.planId === plan.id 
                      ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/5" 
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{plan.name}</span>
                    <span className="text-[1rem] opacity-70 mt-0.5 font-medium">{plan.price === 0 ? "مجانية" : `${plan.price}$ / طالب`}</span>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    formData.planId === plan.id 
                      ? "border-indigo-500 bg-indigo-500" 
                      : "border-slate-300 dark:border-slate-700"
                  )}>
                    {formData.planId === plan.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[1rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              <AlertCircle className="w-3 h-3" />
              حالة الحساب
            </label>
            <div className="flex gap-2">
              {["ACTIVE", "PENDING", "SUSPENDED", "EXPIRED"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[1rem] font-black tracking-widest uppercase transition-all transform-gpu",
                    formData.status === status
                      ? (status === "ACTIVE" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                         status === "PENDING" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" :
                         status === "SUSPENDED" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" :
                         "bg-slate-700 text-white")
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  )}
                >
                  {status === "ACTIVE" ? "نشط" : 
                   status === "PENDING" ? "معلق" : 
                   status === "SUSPENDED" ? "محظور" : "منتهي"}
                </button>
              ))}
            </div>
          </div>

          {/* End Date - Simplified container for better performance */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[1rem] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              <Calendar className="w-3 h-3" />
              تاريخ نهاية الاشتراك
            </label>
            <input 
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 rounded-2xl py-4 px-6 text-sm outline-none transition-shadow duration-200 focus:ring-4 focus:ring-indigo-500/10 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ التعديلات
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-4 rounded-2xl transition-all active:scale-95 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default memo(SchoolEditModal);
