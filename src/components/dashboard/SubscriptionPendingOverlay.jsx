"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Zap, ShieldCheck, AlertCircle, LogOut } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function SubscriptionPendingOverlay() {
  const [status, setStatus] = useState(null); // 'ACTIVE', 'PENDING', etc.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/my-subscription");
        if (response.data.success) {
          setStatus(response.data.data.status);
        }
      } catch (err) {
        console.error("Failed to fetch subscription status:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
    
    // Polling every 30 seconds to check if approved
    const interval = setInterval(checkSubscription, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // If loading or active, we don't show the overlay (or show a small loader for loading)
  if (loading) return null; 
  if (status === "ACTIVE") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Darkened Background for Contrast */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl transition-opacity duration-300" />
      
      {/* Static Subtle Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]" />

      {/* Main Card - Solid Dark Theme */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-[3rem] p-10 shadow-2xl text-white text-center">
        
        {/* Icon Header - Static */}
        <div className="relative mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Zap className="w-12 h-12 text-white fill-current" />
          </div>
          <div className="absolute -bottom-2 right-1/2 translate-x-12 bg-amber-500 p-2 rounded-xl shadow-lg border-4 border-slate-900">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">طلبك قيد المراجعة</h2>
            <p className="text-slate-400 font-bold text-sm">نعمل على تفعيل مدرستكم في أقرب وقت</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-4 text-right">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">حالة الطلب</p>
                <p className="text-sm font-bold text-white leading-relaxed">بانتظار موافقة الإدارة العامة (Admin Confirmation)</p>
              </div>
            </div>
            
            <div className="h-px bg-slate-700 w-full" />
            
            <p className="text-sm text-slate-300 font-bold leading-relaxed px-2">
              سيتم إرسال إشعار تفعيل حسابك مباشرة إلى بريدك الإلكتروني فور الموافقة على الطلب.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            تحديث الحالة يدوياً
          </button>
          <button 
            onClick={handleLogout}
            className="flex-1 py-4 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-black text-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500">
           <AlertCircle className="w-4 h-4 text-blue-500" />
           <span className="text-[10px] font-black uppercase tracking-widest">EduFlow Support System Area</span>
        </div>
      </div>
    </div>
  );
}
