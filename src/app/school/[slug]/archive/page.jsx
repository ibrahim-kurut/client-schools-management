"use client";
import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  RotateCcw, 
  Trash2, 
  Layers, 
  BookOpen, 
  CalendarDays,
  Search,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getArchivedData, 
  restoreData, 
  permanentDelete, 
  resetArchiveState 
} from '@/redux/slices/archiveSlice';
import { useParams } from 'next/navigation';
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ArchivePage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const slug = params?.slug || '';
  const { classes, subjects, academicYears, loading, error, success, message } = useSelector((state) => state.archive);
  
  const [activeTab, setActiveTab] = useState('classes');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(getArchivedData());
    return () => dispatch(resetArchiveState());
  }, [dispatch]);

  // Handle Success/Error Alerts
  useEffect(() => {
    if (success && message) {
      Swal.fire({
        icon: 'success',
        title: 'تمت العملية',
        text: message,
        timer: 2000,
        showConfirmButton: false
      });
      dispatch(resetArchiveState());
    }
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error
      });
      dispatch(resetArchiveState());
    }
  }, [success, error, message, dispatch]);

  const handleRestore = (type, id, name) => {
    Swal.fire({
      title: 'استعادة البيانات؟',
      text: `سيتم إعادة "${name}" إلى القائمة النشطة. سيتم المنع إذا كان هناك سجل نشط حالياً بنفس الاسم.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، استعادة الآن',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(restoreData({ type, id }));
      }
    });
  };

  const handlePermanentDelete = (type, id, name) => {
    Swal.fire({
      title: 'تأكيد الحذف النهائي؟',
      text: `سيتم حذف "${name}" تماماً من قاعدة البيانات. تنبيه: لن تنجح العملية إذا كان السجل مرتبطاً بطلاب أو درجات أو بيانات مالية حيوية.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، حذف نهائي',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(permanentDelete({ type, id }));
      }
    });
  };

  // Get current data based on active tab and search
  const getCurrentData = () => {
    let data = [];
    if (activeTab === 'classes') data = classes;
    else if (activeTab === 'subjects') data = subjects;
    else if (activeTab === 'academicYears') data = academicYears;

    if (searchTerm) {
      return data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.className && item.className.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return data;
  };

  const currentData = getCurrentData();

  const tabs = [
    { id: 'classes', name: 'الصفوف', icon: Layers, count: classes.length },
    { id: 'subjects', name: 'المواد الدراسية', icon: BookOpen, count: subjects.length },
    { id: 'academicYears', name: 'السنوات الدراسية', icon: CalendarDays, count: academicYears.length },
  ];

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col" dir="rtl">
      
      {/* Sidebar */}
      <DashboardSidebar slug={slug} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader slug={slug} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6 lg:p-10 space-y-6 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <Archive className="text-blue-600 h-8 w-8" />
                  أرشيف البيانات
                </h1>
                <p className="text-slate-500 mt-1">إدارة البيانات المحذوفة واستعادتها أو حذفها نهائياً.</p>
              </div>
              
              <div className="relative group">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="بحث في الأرشيف..." 
                  className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium
                    ${activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                  `}
                >
                  <tab.icon size={18} />
                  {tab.name}
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}
                  `}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Content Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
              {loading ? (
                <div className="py-20 text-center space-y-4">
                   <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
                   <p className="text-slate-500 font-medium">جاري جلب البيانات من الأرشيف...</p>
                </div>
              ) : currentData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                        <th className="px-6 py-4 font-semibold text-sm">اسم العنصر</th>
                        {activeTab === 'subjects' && <th className="px-6 py-4 font-semibold text-sm">الصف الدراسي</th>}
                        <th className="px-6 py-4 font-semibold text-sm">تاريخ الحذف</th>
                        <th className="px-6 py-4 font-semibold text-sm text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {currentData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">
                              {item.name.split('_deleted_')[0]}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 font-mono">ID: {item.id}</div>
                          </td>
                          {activeTab === 'subjects' && (
                            <td className="px-6 py-4">
                              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                                {item.className}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div className="text-slate-600 text-sm">
                              {new Date(item.deletedAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(item.deletedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => {
                                  const typeMap = {
                                    classes: 'class',
                                    subjects: 'subject',
                                    academicYears: 'academicYear'
                                  };
                                  handleRestore(typeMap[activeTab], item.id, item.name.split('_deleted_')[0]);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium border border-transparent hover:border-blue-100"
                              >
                                <RotateCcw size={16} />
                                استعادة
                              </button>
                              <button 
                                onClick={() => {
                                  const typeMap = {
                                    classes: 'class',
                                    subjects: 'subject',
                                    academicYears: 'academicYear'
                                  };
                                  handlePermanentDelete(typeMap[activeTab], item.id, item.name.split('_deleted_')[0]);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium border border-transparent hover:border-red-100"
                              >
                                <Trash2 size={16} />
                                حذف نهائي
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Archive className="text-slate-400 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">الأرشيف فارغ</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">لم يتم العثور على أي {tabs.find(t => t.id === activeTab)?.name} مؤرشفة.</p>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start">
              <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-amber-800 font-bold text-sm">ملاحظة أمنية للمدير</h4>
                <p className="text-amber-700/80 text-xs mt-1 leading-relaxed">
                  الحذف النهائي يقوم بإزالة السجل تماماً من قاعدة البيانات. لا يمكن استرجاع البيانات بعد الحذف النهائي. 
                  يرجى التأكد من عدم حاجة النظام لهذا السجل مستقبلاً قبل تنفيذ هذا الإجراء.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArchivePage;
