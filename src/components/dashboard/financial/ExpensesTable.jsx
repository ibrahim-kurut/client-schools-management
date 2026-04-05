"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Trash2, Edit, TrendingDown, User, Calendar, Loader2, Printer } from 'lucide-react';
import { fetchExpenses, deleteExpense } from '../../../redux/slices/expensesSlice';
import Pagination from '../../ui/Pagination';
import SearchInput from '../../ui/SearchInput';
import Swal from 'sweetalert2';

const expenseTypeLabels = {
  SALARY: "رواتب",
  MAINTENANCE: "صيانة",
  SUPPLIES: "معدات وتوريدات",
  RENT: "إيجار",
  UTILITIES: "خدمات عامة",
  MARKETING: "تسويق",
  OTHER: "أخرى"
};

const expenseTypeColors = {
  SALARY: "bg-purple-50 text-purple-600",
  MAINTENANCE: "bg-orange-50 text-orange-600",
  SUPPLIES: "bg-emerald-50 text-emerald-600",
  RENT: "bg-blue-50 text-blue-600",
  UTILITIES: "bg-emerald-50 text-emerald-600",
  MARKETING: "bg-indigo-50 text-indigo-600",
  OTHER: "bg-slate-50 text-slate-600"
};

export default function ExpensesTable({ onEdit, onPrint }) {
  const dispatch = useDispatch();
  const { expenses, pagination, status, createStatus, updateStatus } = useSelector((state) => state.expenses);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch expenses when filters, page, OR success status changes
  useEffect(() => {
    dispatch(fetchExpenses({ 
      page: currentPage, 
      limit: itemsPerPage, 
      search: debouncedSearch,
      type: typeFilter
    }));
  }, [dispatch, currentPage, debouncedSearch, typeFilter, createStatus, updateStatus]);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف المصروف "${title}" بشكل نهائي.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981', // emerald-600
      cancelButtonColor: '#64748b',  // slate-500
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl',
      customClass: {
        popup: 'rounded-[2rem] font-sans border border-slate-100 shadow-2xl',
        title: 'font-black text-slate-800',
        htmlContainer: 'text-slate-500 font-bold',
        confirmButton: 'rounded-2xl px-10 py-3 font-black text-sm',
        cancelButton: 'rounded-2xl px-10 py-3 font-black text-sm'
      }
    });

    if (result.isConfirmed) {
      dispatch(deleteExpense(id));
      Swal.fire({
        title: 'تم الحذف!',
        text: 'تم حذف المصروف بنجاح.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        direction: 'rtl',
        customClass: {
          popup: 'rounded-[2rem] font-sans border border-slate-100 shadow-2xl',
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Controls & Filters ─── */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <SearchInput 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن مصروف..."
          className="w-full md:w-96"
        />

        {/* Filters */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold cursor-pointer transition-all hover:bg-slate-100"
            >
              <option value="">جميع التصنيفات</option>
              {Object.entries(expenseTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm font-bold">
                <th className="p-6 whitespace-nowrap">عنوان المصروف</th>
                <th className="p-6 whitespace-nowrap">التصنيف</th>
                <th className="p-6 whitespace-nowrap text-center">المستلم</th>
                <th className="p-6 whitespace-nowrap text-center">المبلغ</th>
                <th className="p-6 whitespace-nowrap text-center">التاريخ</th>
                <th className="p-6 whitespace-nowrap text-center">مسجل بواسطة</th>
                <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 font-bold">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" />
                    جاري تحميل سجلات المصاريف...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                         <TrendingDown className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="text-slate-400 font-bold">لا توجد سجلات مطابقة للبحث</div>
                    </div>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-50 hover:bg-emerald-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${expenseTypeColors[expense.type]} flex items-center justify-center shrink-0`}>
                           <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-slate-800 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{expense.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black ${expenseTypeColors[expense.type]}`}>
                        {expenseTypeLabels[expense.type] || expense.type}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {expense.recipient ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="text-sm font-black text-blue-600 flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {expense.recipient.firstName} {expense.recipient.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                            {expense.recipient.role}
                          </div>
                        </div>
                      ) : expense.recipientName ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="text-sm font-black text-slate-700 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {expense.recipientName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                            خارجي / يدوي
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs italic">غير محدد</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-black text-emerald-600 text-lg">
                        {expense.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">IQD</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                         <div className="text-sm font-bold text-slate-700">{new Date(expense.date).toLocaleDateString('en-GB')}</div>
                         <div className="text-[10px] text-slate-400 flex items-center gap-1">
                           <Calendar className="w-3 h-3" />
                           {new Date(expense.date).toLocaleDateString('ar-SA', { weekday: 'long' })}
                         </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="text-slate-600 font-bold text-sm">
                        {expense.recordedBy.firstName} {expense.recordedBy.lastName}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2 transition-opacity">
                        <button 
                          onClick={() => onPrint(expense)}
                          className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm shadow-emerald-100 cursor-pointer"
                          title="طباعة السند"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onEdit(expense)}
                          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm shadow-blue-100 cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id, expense.title)}
                          className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm shadow-rose-100 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination 
          currentPage={pagination.page || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.total || 0}
          itemsPerPage={itemsPerPage}
          itemName="سجل"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
