"use client";
import React, { useState } from 'react';
import { 
  Archive, 
  RotateCcw, 
  Trash2, 
  Layers, 
  BookOpen, 
  CalendarDays,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const mockData = {
  classes: [
    { id: 'c1', name: 'الصف الأول الابتدائي - أ', deletedAt: '2024-03-15T10:30:00Z', studentsCount: 0 },
    { id: 'c2', name: 'الصف السادس العلمي - ب', deletedAt: '2024-03-20T14:45:00Z', studentsCount: 0 },
  ],
  subjects: [
    { id: 's1', name: 'الرياضيات المتقدمة', class: 'السادس الإعدادي', deletedAt: '2024-03-18T09:15:00Z' },
    { id: 's2', name: 'اللغة الإنجليزية', class: 'الثالث المتوسط', deletedAt: '2024-03-22T11:00:00Z' },
  ],
  years: [
    { id: 'y1', name: '2022-2023', startDate: '2022-09-01', endDate: '2023-06-30', deletedAt: '2023-07-05T08:00:00Z' },
  ]
};

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
    {count > 0 && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {count}
      </span>
    )}
  </button>
);

export default function ArchiveManagement({ slug }) {
  const [activeTab, setActiveTab] = useState('classes');
  const [searchTerm, setSearchTerm] = useState('');

  const handleRestore = (item) => {
    Swal.fire({
      title: 'هل تريد استعادة هذا السجل؟',
      text: `سيتم إعادة "${item.name}" إلى القوائم النشطة.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، استعادة',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#2563eb',
      reverseButtons: true,
      direction: 'rtl',
      customClass: {
        popup: 'rounded-[32px] font-sans shadow-2xl',
        confirmButton: 'rounded-2xl px-8 py-3 font-bold',
        cancelButton: 'rounded-2xl px-8 py-3 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(`تمت استعادة "${item.name}" بنجاح (تجريبي)`);
      }
    });
  };

  const handlePermanentDelete = (item) => {
    Swal.fire({
      title: 'حذف نهائي وقاطع؟',
      html: `أنت على وشك حذف <b>"${item.name}"</b> نهائياً من قاعدة البيانات.<br/><span class="text-red-500 text-sm font-bold">لا يمكن التراجع عن هذه الخطوة!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، حذف نهائي',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444',
      reverseButtons: true,
      direction: 'rtl',
      customClass: {
        popup: 'rounded-[32px] font-sans shadow-2xl',
        confirmButton: 'rounded-2xl px-8 py-3 font-bold',
        cancelButton: 'rounded-2xl px-8 py-3 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
         // Simulation of validation fail (for safe deletion validation demo later)
         if (item.id === 'y1') {
            Swal.fire({
                title: 'عذراً، لا يمكن الحذف!',
                text: 'هذا السجل مرتبط ببيانات مالية قديمة. نظام حماية السجلات يمنع الحذف النهائي لضمان سلامة الأرشيف المالي.',
                icon: 'error',
                confirmButtonText: 'فهمت',
                confirmButtonColor: '#334155',
                direction: 'rtl',
                customClass: { popup: 'rounded-[32px]' }
            });
         } else {
            toast.info(`تم الحذف النهائي لـ "${item.name}" من قاعدة البيانات (تجريبي)`);
         }
      }
    });
  };

  const currentItems = mockData[activeTab].filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center shadow-inner">
              <Archive className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">أرشيف النظام</h1>
              <p className="text-slate-500 font-bold mt-1">عرض واستعادة السجلات التي تم حذفها</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="بحث في الأرشيف..." 
                  className="bg-slate-50 border-none rounded-2xl py-3 pr-12 pl-6 focus:ring-2 focus:ring-blue-100 w-full lg:w-72 font-bold text-slate-600 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                <Filter className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mt-10 border-t border-slate-100 pt-8 mt-8">
          <TabButton 
            active={activeTab === 'classes'} 
            onClick={() => setActiveTab('classes')} 
            icon={Layers} 
            label="الصفوف المحذوفة" 
            count={mockData.classes.length} 
          />
          <TabButton 
            active={activeTab === 'subjects'} 
            onClick={() => setActiveTab('subjects')} 
            icon={BookOpen} 
            label="المواد المحذوفة" 
            count={mockData.subjects.length} 
          />
          <TabButton 
            active={activeTab === 'years'} 
            onClick={() => setActiveTab('years')} 
            icon={CalendarDays} 
            label="السنوات المحذوفة" 
            count={mockData.years.length} 
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
            >
              {/* Decorative side bar */}
              <div className="absolute top-0 right-0 w-2 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors duration-500"></div>
              
              <div className="flex justify-between items-start mb-5">
                <div className={`p-3 rounded-2xl ${
                    activeTab === 'classes' ? 'bg-orange-50 text-orange-600' :
                    activeTab === 'subjects' ? 'bg-blue-50 text-blue-600' :
                    'bg-emerald-50 text-emerald-600'
                }`}>
                    {activeTab === 'classes' ? <Layers className="w-6 h-6" /> :
                     activeTab === 'subjects' ? <BookOpen className="w-6 h-6" /> :
                     <CalendarDays className="w-6 h-6" />}
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleRestore(item)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                        title="استعادة"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => handlePermanentDelete(item)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all shadow-sm"
                        title="حذف نهائي"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{item.name}</h3>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>تاريخ الحذف: {new Date(item.deletedAt).toLocaleDateString('ar-EG')}</span>
                </div>
                {activeTab === 'subjects' && (
                    <div className="text-sm font-bold text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                        الصف: {item.class}
                    </div>
                )}
                {activeTab === 'classes' && (
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        عدد الطلاب قبل الحذف: {item.studentsCount}
                    </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Archive className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">الأرشيف فارغ حالياً</h3>
            <p className="text-slate-400 font-bold mt-2 max-w-sm">
                لا توجد سجلات محذوفة تطابق معايير البحث في هذا القسم.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
