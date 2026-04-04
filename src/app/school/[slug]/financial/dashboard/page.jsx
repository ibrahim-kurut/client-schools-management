"use client";
import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import FinancialStats from '@/components/dashboard/financial/FinancialStats';
import FinancialChart from '@/components/dashboard/financial/FinancialChart';

export default function FinancialDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-lg shadow-purple-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px] w-full md:w-1/3">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              الشؤون المالية
            </h1>
            <p className="text-purple-100 font-medium">نظرة عامة على أداء المدرسة المالي</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm border border-slate-100 hover:bg-slate-50">
                <Calendar className="w-5 h-5 text-purple-600" />
                تحميل تقرير شهري
            </button>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/30 hover:-translate-y-0.5">
                <Download className="w-5 h-5" />
                تصدير البيانات
            </button>
        </div>
      </div>

      <FinancialStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FinancialChart />
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-right">
          <h3 className="text-xl font-black text-slate-800 mb-6">آخر العمليات</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {i % 2 === 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                      {i % 2 === 0 ? "دفعة رسوم طالب" : "فاتورة صيانة"}
                    </h4>
                    <p className="text-slate-400 text-xs font-medium">قبل {i * 2} ساعات</p>
                  </div>
                </div>
                <div className={`font-black ${i % 2 === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {i % 2 === 0 ? "+" : "-"}{i * 150} $
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
            عرض كافة العمليات
          </button>
        </div>
      </div>
    </div>
  );
}
