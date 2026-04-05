"use client";
import React, { useState } from 'react';
import { CreditCard, Plus, Download } from 'lucide-react';
import FeesTable from '@/components/dashboard/financial/FeesTable';
import AddPaymentModal from '@/components/dashboard/financial/AddPaymentModal';

export default function StudentFeesPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px] w-full md:w-1/3">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <CreditCard className="w-8 h-8" />
              رسوم الطلاب
            </h1>
            <p className="text-blue-100 font-medium">إدارة وتحصيل الرسوم الدراسية</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <Download className="w-5 h-5 text-blue-600" />
                تحميل كشف الرسوم
            </button>
            <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 cursor-pointer"
            >
                <Plus className="w-5 h-5" />
                تسجيل دفعة جديدة
            </button>
        </div>
      </div>

      <FeesTable />

      <AddPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </div>
  );
}
