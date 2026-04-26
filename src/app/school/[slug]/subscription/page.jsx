"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { 
  ShieldCheck, 
  CreditCard, 
  Users, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Calendar,
  ChevronRight,
  Sparkles,
  ZapOff,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPendingRequest } from "@/redux/slices/subscriptionRequestsSlice";
import NewSubscriptionRequestModal from "@/components/dashboard/NewSubscriptionRequestModal";

export default function SubscriptionPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { data, status: subscriptionStatus } = useSelector((state) => state.mySubscription);
  const loading = subscriptionStatus === 'loading' || subscriptionStatus === 'idle';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pendingRequest } = useSelector((state) => state.subscriptionRequests);

  useEffect(() => {
    dispatch(fetchMyPendingRequest());
  }, [slug, dispatch]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold">جاري تحميل بيانات الاشتراك...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { plan, usage, currentDebt, endDate, status } = data;
  const usagePercentage = Math.min(100, Math.round((usage.studentCount / usage.totalLimit) * 100));

  const features = [
    { label: "الإدارة الأساسية", key: "hasBasicManagement" },
    { label: "نظام الغياب", key: "hasAttendance" },
    { label: "جداول الحصص", key: "hasSchedules" },
    { label: "رفع ملفات إكسل", key: "hasExcelUpload" },
    { label: "النظام المالي", key: "hasFinancials" },
    { label: "نظام الباصات", key: "hasBusSystem" },
    { label: "تطبيق المحمول", key: "hasMobileApp" },
    { label: "تقارير الذكاء الاصطناعي", key: "hasAiReports" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-8 pb-10">
      
      {/* Page Title */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div>
              <h2 className="text-2xl font-black text-slate-800">الاشتراك والفوترة</h2>
              <p className="text-slate-400 font-bold text-sm">إدارة خطة مدرستك وتتبع الاستهلاك</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
              {status === 'ACTIVE' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-black text-sm">{status === 'ACTIVE' ? 'نشط' : 'قيد الانتظار'}</span>
          </div>
      </div>

      {/* Pending Request Banner */}
      {pendingRequest && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-6 text-center md:text-right">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                   <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                   <h4 className="text-lg font-black text-amber-900 dark:text-amber-400">طلبك قيد المراجعة</h4>
                   <p className="text-xs font-bold text-amber-600/70">لقد أرسلت طلباً للاشتراك في باقة <span className="underline">{pendingRequest.plan.name}</span>. سيتم إخطارك بمجرد الموافقة.</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest border border-amber-200 rounded-lg px-2 py-1">قيد الانتظار</span>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Plan Info Card */}
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#1e293b] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-700">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-4">
                          <div className="flex items-center gap-3">
                              <div className="p-3 bg-blue-500/20 rounded-2xl">
                                  <Zap className="w-6 h-6 text-blue-400" />
                              </div>
                              <h3 className="text-3xl font-black">{plan.name}</h3>
                          </div>
                          <p className="text-slate-400 font-bold max-w-md">{plan.description}</p>
                      </div>
                      <div className="text-left md:text-right bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                          <p className="text-slate-400 text-xs font-bold uppercase mb-1">تاريخ انتهاء الاشتراك</p>
                          <div className="flex items-center gap-2 justify-end text-xl font-black">
                              <Calendar className="w-5 h-5 text-blue-400" />
                              {new Date(endDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                      </div>
                  </div>

                  <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-slate-500 text-[10px] font-bold mb-1 uppercase">سعر الاشتراك سنوي</p>
                          <p className="text-xl font-black">${plan.price}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-slate-500 text-[10px] font-bold mb-1 uppercase">سعة الطلاب الأساسية</p>
                          <p className="text-xl font-black">{plan.maxStudents}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-slate-500 text-[10px] font-bold mb-1 uppercase">سعة الهدية (Buffer)</p>
                          <p className="text-xl font-black text-blue-400">+{plan.bufferStudents}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-slate-500 text-[10px] font-bold mb-1 uppercase">سعر الطالب الإضافي</p>
                          <p className="text-xl font-black text-emerald-400">${plan.pricePerExtraStudent}</p>
                      </div>
                  </div>
              </div>

              {/* Features List */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-8 border-r-4 border-blue-600 pr-4">الميزات المشمولة في خطتك</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, i) => (
                          <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${plan[feature.key] ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                              <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${plan[feature.key] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                                      {plan[feature.key] ? <ShieldCheck className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                  </div>
                                  <span className={`font-bold text-sm ${plan[feature.key] ? 'text-emerald-900' : 'text-slate-500'}`}>{feature.label}</span>
                              </div>
                              {plan[feature.key] && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Usage & Billing Sidebar */}
          <div className="space-y-8">
              
              {/* Student Usage Card */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <Users className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-black text-slate-800 mb-1">استهلاك سعة الطلاب</h3>
                  <p className="text-slate-400 font-bold text-xs mb-8">إجمالي الطلاب المضافين في النظام</p>

                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                          <circle 
                              cx="96" cy="96" r="80" stroke="#2563eb" strokeWidth="16" fill="transparent"
                              strokeDasharray={2 * Math.PI * 80}
                              strokeDashoffset={(2 * Math.PI * 80) - (usagePercentage / 100) * (2 * Math.PI * 80)}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                          />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-black text-slate-800">{usage.studentCount}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">طالب</span>
                      </div>
                  </div>

                  <div className="w-full space-y-4">
                      <div className="flex justify-between text-sm px-2">
                          <span className="text-slate-500 font-bold">السعة المتبقية (الهدية):</span>
                          <span className="font-black text-blue-600">{Math.max(0, usage.totalLimit - usage.studentCount)}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                              className={`h-full transition-all duration-1000 ${usagePercentage > 90 ? 'bg-rose-500' : usagePercentage > 75 ? 'bg-orange-500' : 'bg-blue-600'}`} 
                              style={{ width: `${usagePercentage}%` }}
                          />
                      </div>
                  </div>
              </div>

              {/* Debt / Billing Card */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                  {currentDebt > 0 && <div className="absolute top-4 left-4"><AlertCircle className="w-6 h-6 text-rose-500 animate-pulse" /></div>}
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                          <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-slate-800">المستحقات المالية</h3>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-tighter">إجمالي الرصيد المطلوب سداده</p>
                      </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 mb-6 text-center">
                      <span className="text-4xl font-black text-slate-800">${currentDebt}</span>
                  </div>

                  {currentDebt > 0 ? (
                     <div className="space-y-4">
                          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                              دفع المبالغ المستحقة الآن <ChevronRight className="w-4 h-4 mr-1" />
                          </button>
                     </div>
                  ) : (
                      <div className="flex flex-col items-center text-center py-4">
                          <Sparkles className="w-8 h-8 text-emerald-400 mb-2" />
                          <p className="text-sm font-bold text-slate-500">سجل ديونك نظيف حالياً!</p>
                      </div>
                  )}
              </div>

              {/* Manage Subscription / Upgrade Button */}
              <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30 group cursor-pointer" onClick={() => !pendingRequest && setIsModalOpen(true)}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                  <div className="relative z-10">
                      <h3 className="text-lg font-black mb-1">تطوير أو تجديد الاشتراك</h3>
                      <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-6 opacity-70">اختر باقة جديدة للحصول على ميزات أكثر</p>
                      <button 
                        disabled={!!pendingRequest}
                        className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group-hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {pendingRequest ? 'لديك طلب معلق بالفعل' : 'ابدأ الترقية الآن'}
                          <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
              </div>

          </div>
      </div>

      <NewSubscriptionRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
