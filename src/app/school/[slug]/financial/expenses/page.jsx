"use client";
import React, { useState } from 'react';
import { TrendingDown, Plus, Download, FileText, PieChart } from 'lucide-react';
import ExpensesTable from '@/components/dashboard/financial/ExpensesTable';
import ExpenseModal from '@/components/dashboard/financial/ExpenseModal';
import { useSelector } from 'react-redux';

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [modalMode, setModalMode] = useState('form'); // 'form' or 'voucher'
  const { pagination } = useSelector((state) => state.expenses);

  const handleOpenAddModal = () => {
    setSelectedExpense(null);
    setModalMode('form');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setSelectedExpense(expense);
    setModalMode('form');
    setIsModalOpen(true);
  };

  const handleOpenPrintModal = (expense) => {
    setSelectedExpense(expense);
    setModalMode('voucher');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
    setModalMode('form');
  };

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Main Stats Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden flex flex-col justify-center min-h-[180px] w-full md:w-[450px]">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                  <TrendingDown className="w-8 h-8 text-white" />
               </div>
               <div>
                 <h1 className="text-3xl font-black tracking-tight">المصاريف</h1>
                 <p className="text-emerald-100 font-bold text-sm">إجمالي السجلات: {pagination.total || 0}</p>
               </div>
            </div>
            
            <div className="pt-4 flex items-center gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">الحالة المالية</span>
                  <span className="text-xl font-black">نشط (مصاريف تشغيلية)</span>
               </div>
               <div className="w-px h-10 bg-white/20"></div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">العملة</span>
                  <span className="text-xl font-black">IQD</span>
               </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white text-slate-700 px-8 py-4 rounded-[1.5rem] font-black transition-all shadow-sm border border-slate-100 hover:bg-slate-50 hover:shadow-md active:scale-95">
                <Download className="w-5 h-5 text-emerald-600" />
                تصدير السجل
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-[1.5rem] font-black transition-all shadow-xl shadow-emerald-600/30 hover:-translate-y-1 active:scale-95"
            >
                <Plus className="w-6 h-6" />
                إضافة مصروف جديد
            </button>
        </div>
      </div>

      {/* ─── Informative Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-emerald-200 transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
               <FileText className="w-7 h-7" />
            </div>
            <div>
               <h4 className="font-bold text-slate-400 text-xs">تقارير المصاريف</h4>
               <p className="font-black text-slate-800 text-lg">عرض تفصيلي للفواتير</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-purple-200 transition-colors">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
               <PieChart className="w-7 h-7" />
            </div>
            <div>
               <h4 className="font-bold text-slate-400 text-xs">توزيع المصروفات</h4>
               <p className="font-black text-slate-800 text-lg">تحليل التصنيفات</p>
            </div>
         </div>
      </div>

      {/* ─── Table Section ─── */}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        <ExpensesTable onEdit={handleOpenEditModal} onPrint={handleOpenPrintModal} />
      </div>

      {/* ─── Modal ─── */}
      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        expense={selectedExpense} 
        mode={modalMode}
      />
    </div>
  );
}
