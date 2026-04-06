"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAcademicYears, 
  createAcademicYear, 
  updateAcademicYear, 
  deleteAcademicYear 
} from '../../redux/slices/academicYearsSlice';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import AddAcademicYearModal from './AddAcademicYearModal';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

// Mock data removed

export default function AcademicYearsManagement({ slug }) {
  const dispatch = useDispatch();
  const { years, status, error } = useSelector((state) => state.academicYears);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);

  useEffect(() => {
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  // Filtered & Sorted Years (Current Year first)
  const filteredYears = useMemo(() => {
    let result = [...years];
    
    // Sort: Current year first, then by name or date/id (existing backend sort usually by date)
    result.sort((a, b) => {
      if (a.isCurrent === b.isCurrent) return 0;
      return a.isCurrent ? -1 : 1;
    });

    if (!searchQuery.trim()) return result;
    return result.filter(y => y.name.includes(searchQuery));
  }, [years, searchQuery]);

  // Derived Stats
  const totalYears = years.length;
  const currentYear = years.find(y => y.isCurrent);
  const previousYears = years.filter(y => !y.isCurrent).length;

  // Handlers
  const handleAddModalOpen = () => {
    setEditingYear(null);
    setIsModalOpen(true);
  };

  const handleEditModalOpen = (year) => {
    setEditingYear(year);
    setIsModalOpen(true);
  };

  const handleSaveYear = (formData) => {
    if (editingYear) {
      dispatch(updateAcademicYear({ id: editingYear.id, yearData: formData }))
        .unwrap()
        .then(() => {
          toast.success("تم تحديث بيانات السنة بنجاح");
          setIsModalOpen(false);
          dispatch(fetchAcademicYears()); // Ensure sync
        })
        .catch((err) => toast.error(err || "فشل التحديث"));
    } else {
      dispatch(createAcademicYear(formData))
        .unwrap()
        .then(() => {
          toast.success("تم إضافة السنة الدراسية بنجاح");
          setIsModalOpen(false);
          dispatch(fetchAcademicYears()); // Ensure sync
        })
        .catch((err) => toast.error(err || "فشل الإضافة"));
    }
  };

  const handleDelete = (year) => {
    if (year.isCurrent) {
      Swal.fire({
        title: 'عذراً!',
        text: 'لا يمكن حذف السنة الدراسية الحالية، الرجاء تعيين سنة أخرى قبل الحذف.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'rounded-[32px] font-sans border border-slate-100 shadow-2xl',
          title: 'font-black text-slate-800',
          confirmButton: 'rounded-2xl px-8 py-3 font-black text-sm',
        }
      });
      return;
    }

    Swal.fire({
      title: 'أرشفة السنة الدراسية؟',
      text: `سيتم نقل السنة (${year.name}) إلى الأرشيف. يمكنك استعادتها لاحقاً، ولكن سيتم المنع إذا كانت السنة تحتوي على درجات مرصودة لضمان سلامة السجلات التاريخية.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، انقل للأرشيف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl',
      customClass: {
        popup: 'rounded-[32px] font-sans border border-slate-100 shadow-2xl',
        title: 'font-black text-slate-800',
        htmlContainer: 'text-slate-500 font-bold',
        confirmButton: 'rounded-2xl px-10 py-3 font-black text-sm',
        cancelButton: 'rounded-2xl px-10 py-3 font-black text-sm'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAcademicYear(year.id))
          .unwrap()
          .then(() => {
            toast.info("تم الحذف بنجاح");
            dispatch(fetchAcademicYears()); // Ensure sync
          })
          .catch((err) => toast.error(err || "فشل الحذف"));
      }
    });
  };

  const handleSetCurrent = (year) => {
    if (year.isCurrent) return; // already current
    
    Swal.fire({
       title: 'تحذير التفعيل',
       text: `هل تريد تفعيل السنة (${year.name}) لتكون السنة الحالية للنظام؟`,
       icon: 'question',
       showCancelButton: true,
       confirmButtonColor: '#2563eb',
       cancelButtonColor: '#64748b',
       confirmButtonText: 'نعم، تفعيل',
       cancelButtonText: 'إلغاء',
       reverseButtons: true,
       customClass: {
          popup: 'rounded-[32px] font-sans border border-slate-100 shadow-2xl',
          title: 'font-black text-slate-800',
          htmlContainer: 'text-slate-500 font-bold',
          confirmButton: 'rounded-2xl px-10 py-3 font-black text-sm',
          cancelButton: 'rounded-2xl px-10 py-3 font-black text-sm'
       }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateAcademicYear({ 
          id: year.id, 
          yearData: { isCurrent: true } 
        }))
          .unwrap()
          .then(() => {
            toast.success(`تم تعيين ${year.name} كسنة حالية`);
            dispatch(fetchAcademicYears()); // Ensure sync
          })
          .catch((err) => toast.error(err || "فشل التفعيل"));
      }
    });
  };

  const formatDateLabel = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM yyyy', { locale: arSA });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 space-y-8" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            إدارة السنوات الدراسية
          </h1>
          <p className="text-slate-500 font-semibold mt-2">إدارة الخطط الزمنية والسنوات الأكاديمية للمدرسة</p>
        </div>

        <button 
          onClick={handleAddModalOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>سنة دراسية جديدة</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 font-bold text-sm">إجمالي السنوات</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{totalYears}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 font-bold text-sm">السنة الحالية المفعلة</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1" dir="ltr">{currentYear?.name || 'غير محدد'}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 font-bold text-sm">السنوات السابقة</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{previousYears}</h3>
          </div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="ابحث عن سنة دراسية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-sm font-bold text-slate-700 placeholder-slate-400"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        
        {/* Status Reminder Badge */}
        <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${status === 'loading' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
          {status === 'loading' ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              جاري مزامنة البيانات...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              النظام متصل بالخادم
            </>
          )}
        </div>
      </div>

      {/* Years Display Area - Cards Layout */}
      {filteredYears.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 border-dashed">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">لا توجد سنوات دراسية</h3>
          <p className="text-slate-500 text-sm font-medium">لم يتم العثور على أية سنة بتفاصيل البحث المطلوبة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredYears.map((year) => (
            <div 
              key={year.id} 
              className={`relative bg-white rounded-3xl border ${year.isCurrent ? 'border-blue-500 shadow-blue-100' : 'border-slate-100 hover:border-slate-300'} shadow-sm overflow-hidden group transition-all duration-300`}
            >
              {/* Badge for Current Year */}
              {year.isCurrent && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-2xl z-10 flex items-center gap-1 shadow-md">
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  السنة الحالية
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 pt-6 relative">
                
                {/* Actions Menu (Always visible on hover, or mobile) */}
                <div className="absolute top-4 left-4 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    title="تعديل"
                    onClick={() => handleEditModalOpen(year)}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    title="حذف"
                    onClick={() => handleDelete(year)}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mt-1 mb-5 cursor-default">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${year.isCurrent ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-100 text-slate-500'}`}>
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800" dir="ltr">{year.name}</h3>
                  <div className="mt-3 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">
                     <span>{formatDateLabel(year.startDate)}</span>
                     <span className="text-slate-300">-</span>
                     <span>{formatDateLabel(year.endDate)}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {year.isCurrent ? (
                    <span className="flex-1 text-center font-bold text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg flex justify-center items-center gap-2">
                       <CheckCircle2 className="w-3.5 h-3.5" /> مفعلة
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleSetCurrent(year)}
                      className="flex-1 font-bold text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                    >
                      تفعيل كسنة حالية
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Modal for Add/Edit */}
      <AddAcademicYearModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingYear={editingYear}
        onSave={handleSaveYear}
      />
    </div>
  );
}
