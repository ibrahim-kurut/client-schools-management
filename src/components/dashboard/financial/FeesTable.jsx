"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, MoreVertical, CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { fetchStudentsSummary } from '../../../redux/slices/feesSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import Pagination from '../../ui/Pagination';
import SearchInput from '../../ui/SearchInput';

export default function FeesTable() {
  const dispatch = useDispatch();
  const { students, pagination, status } = useSelector((state) => state.fees);
  const { classes, status: classesStatus } = useSelector((state) => state.classes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
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

  useEffect(() => {
    dispatch(fetchStudentsSummary({ 
      page: currentPage, 
      limit: itemsPerPage, 
      search: debouncedSearch,
      classFilter: classFilter
    }));
  }, [dispatch, currentPage, debouncedSearch, classFilter]);

  useEffect(() => {
    if (classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [classesStatus, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> مكتمل</span>;
      case "PARTIAL":
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> جزئي</span>;
      case "PENDING":
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> معلق</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Controls & Filters ─── */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <SearchInput 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="ابحث عن طالب..."
          className="w-full md:w-96"
        />

        {/* Filters */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={classFilter}
              onChange={handleFilterChange}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer transition-all hover:bg-slate-100"
            >
              <option value="ALL">جميع الصفوف</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm font-bold">
                <th className="p-6 whitespace-nowrap">اسم الطالب</th>
                <th className="p-6 whitespace-nowrap">الصف</th>
                <th className="p-6 whitespace-nowrap text-center">إجمالي الرسوم</th>
                <th className="p-6 whitespace-nowrap text-center">المدفوع</th>
                <th className="p-6 whitespace-nowrap text-center">المتبقي</th>
                <th className="p-6 whitespace-nowrap text-center">الحالة</th>
                <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 font-bold">
                    جاري تحميل بيانات الرسوم...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400 font-bold">
                    لا توجد سجلات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{student.name}</div>
                    </td>
                    <td className="p-6 text-slate-600 font-medium">{student.className}</td>
                    <td className="p-6 text-slate-800 font-black text-center">{student.totalFees} $</td>
                    <td className="p-6 text-emerald-600 font-black text-center">{student.paid} $</td>
                    <td className="p-6 text-rose-600 font-black text-center">{student.balance} $</td>
                    <td className="p-6 flex justify-center">
                      <div className="flex items-center justify-center w-full">
                        {getStatusBadge(student.status)}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="تسجيل دفعة"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreVertical className="w-4 h-4" />
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
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.totalStudents || 0}
          itemsPerPage={itemsPerPage}
          itemName="طالب"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
