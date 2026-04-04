"use client";
import React from 'react';
import { TrendingDown, Plus, Download } from 'lucide-react';
import ExpensesTable from '@/components/dashboard/financial/ExpensesTable';

export default function ExpensesPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-[2rem] p-8 text-white shadow-lg shadow-rose-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px] w-full md:w-1/3">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <TrendingDown className="w-8 h-8" />
              المصاريف
            </h1>
            <p className="text-rose-100 font-medium">تتبع المصاريف التشغيلية للمدرسة</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm border border-slate-100 hover:bg-slate-50">
                <Download className="w-5 h-5 text-rose-600" />
                تحميل سجل المصاريف
            </button>
            <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/30 hover:-translate-y-0.5">
                <Plus className="w-5 h-5" />
                إضافة مصروف جديد
            </button>
        </div>
      </div>

      <ExpensesTable />
    </div>
  );
}
