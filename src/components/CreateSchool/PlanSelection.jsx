'use client';

import React, { useEffect, useState } from 'react';
import { Check, Shield, Zap, Rocket, AlertCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';

const iconMap = {
  0: Shield,
  1: Zap,
  2: Rocket
};

const colorMap = {
  0: { color: 'text-blue-600', bgColor: 'bg-blue-50', ringColor: 'ring-blue-600', btnColor: 'bg-blue-600' },
  1: { color: 'text-indigo-600', bgColor: 'bg-indigo-50', ringColor: 'ring-indigo-600', btnColor: 'bg-indigo-600' },
  2: { color: 'text-purple-600', bgColor: 'bg-purple-50', ringColor: 'ring-purple-600', btnColor: 'bg-purple-600' }
};

export default function PlanSelection({ selectedPlanId, onSelectPlan }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get('/plans');
        // The server returns the plans in the 'plans' field, not 'data'
        const rawPlans = response.data.plans || [];
        
        if (rawPlans.length === 0) {
          setError('لا توجد خطط اشتراك متاحة حالياً. يرجى مراجعة الإدارة.');
          return;
        }

        const sortedPlans = [...rawPlans].sort((a, b) => a.price - b.price);
        setPlans(sortedPlans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
        setError('فشل في جلب خطط الاشتراك. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">جاري تحميل الخطط المتاحة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <p className="text-slate-800 font-bold text-lg mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-indigo-600 font-bold hover:underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-backwards delay-200">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900">اختر خطة الاشتراك</h3>
        <p className="text-slate-500 mt-2">اختر الخطة الأنسب لاحتياجات مدرستك. (يمكنك التخطي للحصول على الخطة المجانية)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = iconMap[index % 3] || Shield;
          const style = colorMap[index % 3] || colorMap[0];
          const isSelected = selectedPlanId === plan.id;

          // Build dynamic features list
          const features = [
            `حتى ${plan.maxStudents} طالب`,
            `حتى ${plan.maxTeachers} معلم`,
            plan.hasBasicManagement && 'إدارة المدارس الأساسية',
            plan.hasAttendance && 'نظام التحضير والغياب',
            plan.hasSchedules && 'نظام الجداول الحصص',
            plan.hasFinancials && 'إدارة الحسابات والرسوم',
            plan.hasMobileApp && 'تطبيق الموبايل',
          ].filter(Boolean);

          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative cursor-pointer group transition-all duration-300 transform hover:-translate-y-2 ${
                isSelected
                  ? `ring-4 ${style.ringColor} scale-105 z-10`
                  : 'hover:shadow-xl border border-slate-200 hover:border-indigo-200'
              } bg-white rounded-[2rem] p-8 h-full flex flex-col shadow-sm`}
            >
              {index === 1 && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-widest">
                    الأكثر شعبية
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`w-14 h-14 ${style.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <Icon className={`w-7 h-7 ${style.color}`} />
                </div>
                <h4 className="font-black text-xl text-slate-900 text-black capitalize">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 text-black">${plan.price}</span>
                  <span className="text-slate-500 text-sm font-bold">/ سنوي</span>
                </div>
                <p className="text-slate-600 bg-red-100 p-2 rounded-lg text-xs mt-3 font-medium ">{plan.description}</p>
              </div>

              <div className="h-px bg-slate-100 w-full mb-6" />

              <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[13px] font-bold text-slate-600">
                    <div className={`mt-0.5 ${style.bgColor} rounded-full p-1 shrink-0`}>
                      <Check className={`w-3 h-3 ${style.color}`} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={`mt-auto py-4 px-4 rounded-2xl text-center font-black text-[12px] uppercase tracking-widest transition-all duration-300 ${
                isSelected
                  ? `${style.btnColor} text-white shadow-lg shadow-indigo-200`
                  : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-900'
              }`}>
                {isSelected ? 'تم اختيار هذه الخطة' : 'اختر هذه الخطة'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
